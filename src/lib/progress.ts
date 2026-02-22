import { getItem, setItem, STORAGE_KEYS } from "./storage";
import type { NoorProgress } from "@/types/content";

const DEFAULT_PROGRESS: NoorProgress = {
  completedLessons: [],
  currentLesson: null,
  startedAt: "",
  lastActiveAt: "",
  streakDays: 0,
};

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
  progress.lastActiveAt = new Date().toISOString();
  updateStreak(progress);
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

function updateStreak(progress: NoorProgress): void {
  const now = new Date();
  const lastActive = progress.lastActiveAt
    ? new Date(progress.lastActiveAt)
    : null;

  if (!lastActive) {
    progress.streakDays = 1;
    return;
  }

  const diffMs = now.getTime() - lastActive.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
  } else if (diffDays < 2) {
    progress.streakDays += 1;
  } else {
    progress.streakDays = 1;
  }
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
