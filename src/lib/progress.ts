import type { NoorProgress } from "@/types/content";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function daysBetween(fromIso: string, to: Date): number | null {
  const from = new Date(fromIso);
  if (!fromIso || Number.isNaN(from.getTime())) return null;
  return Math.round((startOfLocalDay(to) - startOfLocalDay(from)) / MS_PER_DAY);
}

// Days are bucketed at local midnight, so 23:55 followed by 00:05 the next
// day counts as two days in a row.
export function nextStreak(previousActiveAt: string, now: Date, previousStreak: number): number {
  const gap = daysBetween(previousActiveAt, now);
  if (gap === null || gap > 1) return 1;
  if (gap === 1) return previousStreak + 1;
  return Math.max(previousStreak, 1);
}

// The stored streak only changes on activity, so a run that ended days ago
// still reads as a number until the reader comes back.
export function currentStreak(progress: NoorProgress, now: Date): number {
  const gap = daysBetween(progress.lastActiveAt, now);
  if (gap === null || gap > 1) return 0;
  return progress.streakDays;
}
