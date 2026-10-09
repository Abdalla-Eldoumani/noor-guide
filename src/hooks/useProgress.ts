"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { nextStreak } from "@/lib/progress";
import type { NoorProgress } from "@/types/content";

const DEFAULT: NoorProgress = {
  completedLessons: [],
  currentLesson: null,
  startedAt: "",
  lastActiveAt: "",
  streakDays: 0,
};

function active(prev: NoorProgress, now: Date): NoorProgress {
  const iso = now.toISOString();
  return {
    ...prev,
    startedAt: prev.startedAt || iso,
    lastActiveAt: iso,
    streakDays: nextStreak(prev.lastActiveAt, now, prev.streakDays),
  };
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<NoorProgress>(STORAGE_KEYS.progress, DEFAULT);

  // Opening a module counts as a day of study and marks it as the current one.
  const visit = useCallback(
    (moduleId: string) => setProgress((prev) => ({ ...active(prev, new Date()), currentLesson: moduleId })),
    [setProgress],
  );

  const completeLessons = useCallback(
    (lessonIds: string[]) =>
      setProgress((prev) => {
        const missing = lessonIds.filter((id) => !prev.completedLessons.includes(id));
        if (missing.length === 0) return prev;
        return {
          ...active(prev, new Date()),
          completedLessons: [...prev.completedLessons, ...missing],
        };
      }),
    [setProgress],
  );

  const reset = useCallback(() => setProgress(DEFAULT), [setProgress]);

  return { progress, visit, completeLessons, reset };
}
