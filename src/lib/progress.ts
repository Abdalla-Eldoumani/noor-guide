import { getItem, setItem, STORAGE_KEYS } from "./storage";
import type { NoorProgress } from "@/types/content";

const DEFAULT_PROGRESS: NoorProgress = {
  completedLessons: [],
  currentLesson: null,
  startedAt: "",
  lastActiveAt: "",
  streakDays: 0,
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getProgress(): NoorProgress {
  return getItem<NoorProgress>(STORAGE_KEYS.progress, DEFAULT_PROGRESS);
}

export function saveProgress(progress: NoorProgress): void {
  setItem(STORAGE_KEYS.progress, progress);
}

export function markLessonComplete(lessonId: string): NoorProgress {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  const priorLastActiveAt = progress.lastActiveAt;
  const now = new Date();
  progress.lastActiveAt = now.toISOString();
  progress.streakDays = computeStreak(priorLastActiveAt, now, progress.streakDays);
  saveProgress(progress);
  return progress;
}

export function setCurrentLesson(lessonId: string): void {
  const progress = getProgress();
  progress.currentLesson = lessonId;
  progress.lastActiveAt = new Date().toISOString();
  if (!progress.startedAt) {
    progress.startedAt = new Date().toISOString();
  }
  saveProgress(progress);
}

export function isLessonComplete(lessonId: string): boolean {
  return getProgress().completedLessons.includes(lessonId);
}

export function getCompletionPercentage(totalLessons: number): number {
  const { completedLessons } = getProgress();
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons.length / totalLessons) * 100);
}

export function resetProgress(): void {
  saveProgress(DEFAULT_PROGRESS);
}

// Streak is bucketed by local-midnight day boundaries so a visit at 23:55
// followed by 00:05 the next day registers as a +1 streak.
export function computeStreak(
  priorLastActiveAt: string,
  now: Date,
  prevStreak: number,
): number {
  if (!priorLastActiveAt) return 1;

  const prior = new Date(priorLastActiveAt);
  if (Number.isNaN(prior.getTime())) return 1;

  const priorDay = startOfLocalDay(prior);
  const nowDay = startOfLocalDay(now);
  const diffDays = Math.round((nowDay.getTime() - priorDay.getTime()) / MS_PER_DAY);

  if (diffDays <= 0) return prevStreak;
  if (diffDays === 1) return prevStreak + 1;
  return 1;
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Bookmarks
export function getBookmarks(): string[] {
  return getItem<string[]>(STORAGE_KEYS.bookmarks, []);
}

export function toggleBookmark(contentId: string): string[] {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(contentId);
  if (idx === -1) {
    bookmarks.push(contentId);
  } else {
    bookmarks.splice(idx, 1);
  }
  setItem(STORAGE_KEYS.bookmarks, bookmarks);
  return bookmarks;
}

export function isBookmarked(contentId: string): boolean {
  return getBookmarks().includes(contentId);
}
