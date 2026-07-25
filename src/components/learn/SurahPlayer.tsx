"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { ArabicText } from "@/components/ui/ArabicText";
import { fetchSurahAudio } from "@/lib/quran-api";
import type { Surah } from "@/types/content";

interface SurahPlayerProps {
  surah: Surah;
}

export function SurahPlayer({ surah }: SurahPlayerProps) {
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playAll, setPlayAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAllRef = useRef(false);
  const playingIndexRef = useRef<number | null>(null);

  useEffect(() => {
    playAllRef.current = playAll;
  }, [playAll]);

  useEffect(() => {
    playingIndexRef.current = playingIndex;
  }, [playingIndex]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSurahAudio(surah.number)
      .then((urls) => {
        if (!cancelled) {
          setAudioUrls(urls);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load audio. Please try again later.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [surah.number]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (
        playAllRef.current &&
        playingIndexRef.current !== null &&
        playingIndexRef.current < audioUrls.length - 1
      ) {
        const nextIndex = playingIndexRef.current + 1;
        audio.src = audioUrls[nextIndex];
        audio.load();
        audio
          .play()
          .then(() => {
            setPlayingIndex(nextIndex);
            setIsPlaying(true);
          })
          .catch(() => {});
      } else {
        setIsPlaying(false);
        setPlayingIndex(null);
        setPlayAll(false);
      }
    };

    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrls]);

  const playVerse = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio || !audioUrls[index]) return;

      audio.src = audioUrls[index];
      audio.load();
      audio
        .play()
        .then(() => {
          setPlayingIndex(index);
          setIsPlaying(true);
        })
        .catch(() => {});
    },
    [audioUrls]
  );

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setPlayingIndex(null);
    setPlayAll(false);
  }, []);

  const handlePlayAll = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      setPlayAll(true);
      playVerse(0);
    }
  };

  const handleVersePlay = (index: number) => {
    if (isPlaying && playingIndex === index) {
      stopPlayback();
    } else {
      setPlayAll(false);
      playVerse(index);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-primary-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold">
              {surah.title_en}
            </h3>
            <p className="text-primary-200 text-sm mt-0.5">
              Surah {surah.number}
            </p>
          </div>
          <p dir="rtl" lang="ar" className="font-arabic text-arabic-lg">{surah.title_ar}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {surah.priority && (
          <p className="text-sm font-medium text-primary-500 bg-primary-50 dark:bg-primary-900/30 rounded-lg px-3 py-2">
            {surah.priority}
          </p>
        )}

        {/* Play All button */}
        {!loading && !error && audioUrls.length > 0 && (
          <button
            type="button"
            onClick={handlePlayAll}
            className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors w-full justify-center"
          >
            {isPlaying && playAll ? (
              <Pause size={18} />
            ) : (
              <Volume2 size={18} />
            )}
            {isPlaying && playAll ? "Stop" : "Play Entire Surah"}
          </button>
        )}

        {loading && (
          <p className="text-sm text-muted text-center py-2">
            Loading audio...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500 text-center py-2">{error}</p>
        )}

        <div className="space-y-3">
          {surah.verses.map((verse, i) => (
            <div
              key={verse.verse}
              className={`border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0 transition-colors ${
                playingIndex === i
                  ? "bg-primary-50/50 dark:bg-primary-900/20 -mx-2 px-2 rounded-lg"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs flex items-center justify-center font-medium">
                    {verse.verse}
                  </span>
                  {audioUrls[i] && (
                    <button
                      type="button"
                      onClick={() => handleVersePlay(i)}
                      className="relative w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors before:absolute before:inset-[-6px] before:content-['']"
                      aria-label={
                        isPlaying && playingIndex === i
                          ? `Pause verse ${verse.verse}`
                          : `Play verse ${verse.verse}`
                      }
                    >
                      {isPlaying && playingIndex === i ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} className="ml-0.5" />
                      )}
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <ArabicText
                    arabic={verse.arabic}
                    transliteration={verse.transliteration}
                    translation={verse.translation}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
