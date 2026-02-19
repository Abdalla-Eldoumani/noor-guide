"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { NoorProgress } from "@/types/content";

const DEFAULT: NoorProgress = {
  completedLessons: [],
  currentLesson: null,
  startedAt: "",
  lastActiveAt: "",
  streakDays: 0,
};

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<NoorProgress>(
    STORAGE_KEYS.progress,
    DEFAULT
  );

  const markComplete = useCallback(
    (lessonId: string) => {
      setProgress((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        const now = new Date().toISOString();
        return {
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId],
          lastActiveAt: now,
          startedAt: prev.startedAt || now,
        };
      });
    },
    [setProgress]
  );

  const setCurrent = useCallback(
    (lessonId: string) => {
      setProgress((prev) => ({
        ...prev,
        currentLesson: lessonId,
        lastActiveAt: new Date().toISOString(),
        startedAt: prev.startedAt || new Date().toISOString(),
      }));
    },
    [setProgress]
  );

  const isComplete = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const completionPercent = useCallback(
    (total: number) =>
      total === 0
        ? 0
        : Math.round((progress.completedLessons.length / total) * 100),
    [progress.completedLessons]
  );

  const reset = useCallback(() => {
    setProgress(DEFAULT);
  }, [setProgress]);

  return {
    progress,
    markComplete,
    setCurrent,
    isComplete,
    completionPercent,
    reset,
  };
}
