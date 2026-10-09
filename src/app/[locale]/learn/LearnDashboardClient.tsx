"use client";

import { useTranslations } from "next-intl";
import { useProgress } from "@/hooks/useProgress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import type { ModuleSummary } from "@/lib/content";

// Shown once the reader has started: how far along they are and where to pick
// up. Before that the contents below are the whole page.
export function LearnDashboardClient({ rows }: { rows: ModuleSummary[] }) {
  const t = useTranslations("learn");
  const { progress } = useProgress();

  if (!progress.startedAt) return null;

  const total = rows.reduce((sum, row) => sum + row.lessons.length, 0);
  const done = rows.reduce(
    (sum, row) => sum + row.lessons.filter((id) => progress.completedLessons.includes(id)).length,
    0,
  );
  const unfinished = (row: ModuleSummary) => row.lessons.some((id) => !progress.completedLessons.includes(id));
  const resume =
    rows.find((row) => row.id === progress.currentLesson && unfinished(row)) ?? rows.find(unfinished);

  return (
    <div className="mt-8 space-y-4 rounded-panel border border-rule px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 font-ui text-ui">
        <span className="text-ink">{t("overallProgress")}</span>
        <span className="text-ink-2">{t("lessonsCompleted", { completed: done, total })}</span>
      </div>
      <ProgressBar value={total ? (done / total) * 100 : 0} label={t("overallProgress")} />
      {resume && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-small text-ink">
            <span className="block font-ui text-caption text-ink-2">{t("continueTitle")}</span>
            {resume.title}
          </p>
          <Button href={`/learn/${resume.id}`}>{t("continueButton")}</Button>
        </div>
      )}
    </div>
  );
}
