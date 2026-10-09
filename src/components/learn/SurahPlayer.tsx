"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Play, Pause } from "lucide-react";
import { ArabicText } from "@/components/ui/ArabicText";
import { fetchSurahAudio } from "@/lib/quran-api";

interface PlayerVerse {
  verse: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

interface SurahPlayerProps {
  surahNumber: number;
  verses: PlayerVerse[];
}

// Nothing is requested until the reader presses play, so opening the page
// sends nothing to the recitation service.
export function SurahPlayer({ surahNumber, verses }: SurahPlayerProps) {
  const t = useTranslations("surahs");
  const locale = useLocale();
  const number = new Intl.NumberFormat(locale);
  const [playing, setPlaying] = useState<number | null>(null);
  const [playAll, setPlayAll] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlsRef = useRef<string[] | null>(null);
  const stateRef = useRef({ index: -1, all: false });

  const stop = useCallback(() => {
    audioRef.current?.pause();
    stateRef.current = { index: -1, all: false };
    setPlaying(null);
    setPlayAll(false);
  }, []);

  const playAt = useCallback(async (index: number) => {
    const audio = audioRef.current;
    const url = urlsRef.current?.[index];
    if (!audio || !url) return false;
    audio.src = url;
    stateRef.current.index = index;
    try {
      await audio.play();
      setPlaying(index);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const onEnded = () => {
      const { index, all } = stateRef.current;
      if (all && index + 1 < (urlsRef.current?.length ?? 0)) void playAt(index + 1);
      else stop();
    };
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [playAt, stop]);

  const start = async (index: number, all: boolean) => {
    if (!urlsRef.current) {
      setStatus("loading");
      try {
        urlsRef.current = await fetchSurahAudio(surahNumber);
      } catch {
        setStatus("error");
        return;
      }
    }
    stateRef.current = { index, all };
    setPlayAll(all);
    if (await playAt(index)) {
      setStatus("idle");
    } else {
      setStatus("error");
      stop();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => (playAll ? stop() : void start(0, true))}
          className="inline-flex min-h-11 items-center gap-2 rounded-control border border-fajr px-4 font-ui text-ui font-medium text-fajr transition-colors duration-150 hover:bg-fajr/10"
        >
          {playAll ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {playAll ? t("stopPlayback") : t("playFullSurah")}
        </button>
        <p role="status" className="font-ui text-caption text-ink-2">
          {status === "loading" && t("loadingAudio")}
          {status === "error" && <span className="text-clay">{t("audioError")}</span>}
        </p>
      </div>

      <ol className="space-y-2">
        {verses.map((verse, i) => {
          const isPlaying = playing === i;
          return (
            <li
              key={verse.verse}
              className={`grid grid-cols-[2.75rem_1fr] gap-x-4 rounded-panel px-3 py-3 transition-colors duration-150 ${
                isPlaying ? "bg-wash" : ""
              }`}
            >
              <div className="flex flex-col items-center gap-1 pt-2">
                <button
                  type="button"
                  onClick={() => (isPlaying ? stop() : void start(i, false))}
                  aria-label={
                    isPlaying
                      ? t("pauseVerseAria", { number: verse.verse })
                      : t("playVerseAria", { number: verse.verse })
                  }
                  className={`flex size-11 items-center justify-center rounded-full border transition-colors duration-150 ${
                    isPlaying
                      ? "border-fajr bg-fajr text-paper"
                      : "border-fajr text-fajr hover:bg-fajr/10"
                  }`}
                >
                  {isPlaying ? (
                    <Pause size={16} aria-hidden="true" />
                  ) : (
                    <Play size={16} aria-hidden="true" className="translate-x-px" />
                  )}
                </button>
                <span aria-hidden="true" className="font-ui text-micro text-ink-2">
                  {number.format(verse.verse)}
                </span>
              </div>
              <ArabicText
                arabic={verse.arabic}
                transliteration={verse.transliteration}
                translation={verse.translation}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
