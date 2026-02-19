"use client";

import { Play, Pause } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface AudioPlayerProps {
  src: string;
  label?: string;
  className?: string;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, label, className = "" }: AudioPlayerProps) {
  const { isPlaying, currentTime, duration, toggle, seek, currentUrl } = useAudioPlayer();

  const isThisPlaying = isPlaying && currentUrl === src;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3 ${className}`}
    >
      <button
        type="button"
        onClick={() => toggle(src)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        aria-label={isThisPlaying ? "Pause" : "Play"}
      >
        {isThisPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        {label && (
          <p className="text-sm font-medium text-ink truncate mb-1">{label}</p>
        )}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={isThisPlaying || currentUrl === src ? currentTime : 0}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-primary-200 accent-primary-500 cursor-pointer"
          aria-label="Seek audio"
        />
      </div>

      <span className="text-xs text-muted font-mono tabular-nums shrink-0">
        {formatTime(isThisPlaying || currentUrl === src ? currentTime : 0)}
        {" / "}
        {formatTime(duration)}
      </span>
    </div>
  );
}

export default AudioPlayer;
