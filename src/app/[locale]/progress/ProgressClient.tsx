"use client";

import { useState } from "react";
import { useFormatter, useNow, useTranslations } from "next-intl";
import { useProgress } from "@/hooks/useProgress";
import { currentStreak } from "@/lib/progress";
import { PathContents } from "@/components/learn/PathContents";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import type { ModuleSummary } from "@/lib/content";

export function ProgressClient({ rows }: { rows: ModuleSummary[] }) {
  const t = useTranslations("progress");
  const format = useFormatter();
  const now = useNow();
  const { progress, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);

  const total = rows.reduce((sum, row) => sum + row.lessons.length, 0);
  const done = rows.reduce(
    (sum, row) => sum + row.lessons.filter((id) => progress.completedLessons.includes(id)).length,
    0,
  );
  const percent = total ? (done / total) * 100 : 0;

  const facts = [
    { label: t("lessonsCompletedLabel"), value: t("lessonsCompletedValue", { done, total }) },
    { label: t("streakLabel"), value: t("streakValue", { count: currentStreak(progress, now) }) },
    {
      label: t("startedLabel"),
      value: progress.startedAt ? format.dateTime(new Date(progress.startedAt), { dateStyle: "long" }) : t("notStarted"),
    },
  ];

  return (
    <>
      <dl className="mt-8 grid gap-x-8 gap-y-5 border-y border-rule py-6 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-ui text-caption text-ink-2">{fact.label}</dt>
            <dd className="mt-1 font-prose text-subsection font-semibold text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 space-y-2">
        <ProgressBar value={percent} label={t("overallProgress")} />
        <p className="font-ui text-caption text-ink-2">
          {t("overallPercent", { percent: Math.round(percent) })}
        </p>
      </div>

      <section className="mt-12" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="font-prose text-section font-semibold text-ink">
          {t("moduleProgressHeading")}
        </h2>
        <div className="mt-5">
          <PathContents rows={rows} detail="progress" />
        </div>
      </section>

      {progress.startedAt && (
        <section className="mt-10">
          {confirming ? (
            <div role="alertdialog" aria-labelledby="reset-question" className="space-y-4">
              <p id="reset-question" className="text-body text-ink">
                {t("resetConfirmBody")}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setConfirming(false);
                  }}
                  className="inline-flex min-h-11 items-center rounded-control bg-clay px-4 font-ui text-ui font-medium text-paper"
                >
                  {t("resetConfirmYes")}
                </button>
                <Button variant="outline" onClick={() => setConfirming(false)}>
                  {t("resetCancel")}
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="min-h-11 font-ui text-ui text-clay underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              {t("resetButton")}
            </button>
          )}
        </section>
      )}
    </>
  );
}
