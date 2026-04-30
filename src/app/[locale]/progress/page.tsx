"use client";

import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { getLearningModules } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ProgressPage() {
  const { progress, completionPercent, reset } = useProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const modules = getLearningModules();

  // Calculate total lessons across all modules
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const overallPercent = completionPercent(totalLessons);

  // Format date for display
  const formatDate = (iso: string) => {
    if (!iso) return "Not started";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  return (
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Progress" },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          Your Progress
        </h1>
        <p className="mt-3 text-muted dark:text-gray-400">
          Track your learning journey through the fundamentals of Islam.
        </p>
      </div>

      {/* Overall stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-surface p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="font-heading text-3xl font-bold text-primary-500">
            {completedCount}/{totalLessons}
          </p>
          <p className="mt-1 text-sm text-muted dark:text-gray-400">Lessons Completed</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-surface p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="font-heading text-3xl font-bold text-accent-500">
            {progress.streakDays}
          </p>
          <p className="mt-1 text-sm text-muted dark:text-gray-400">Day Streak</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-surface p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="font-heading text-lg font-bold text-ink dark:text-gray-100">
            {formatDate(progress.startedAt)}
          </p>
          <p className="mt-1 text-sm text-muted dark:text-gray-400">Started</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-ink dark:text-gray-100">
            Overall Progress
          </span>
          <span className="text-sm font-medium text-primary-500">
            {overallPercent}%
          </span>
        </div>
        <ProgressBar value={overallPercent} max={100} />
      </div>

      {/* Module-by-module breakdown */}
      <div className="mb-10">
        <h2 className="mb-6 font-heading text-xl font-bold text-ink dark:text-gray-100">
          Module Progress
        </h2>
        <div className="space-y-4">
          {modules.map((mod) => {
            const modCompleted = mod.lessons.filter((l) =>
              progress.completedLessons.includes(l)
            ).length;
            const modTotal = mod.lessons.length;
            const modPercent = modTotal === 0 ? 0 : Math.round((modCompleted / modTotal) * 100);

            return (
              <div
                key={mod.id}
                className="rounded-2xl border border-gray-200 bg-surface p-5 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-base font-semibold text-ink dark:text-gray-100">
                      {mod.title_en}
                    </h3>
                    <p className="mt-0.5 font-arabic text-sm text-muted dark:text-gray-400" dir="rtl">
                      {mod.title_ar}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-muted dark:bg-gray-700 dark:text-gray-400">
                    {modCompleted}/{modTotal}
                  </span>
                </div>
                <ProgressBar value={modPercent} max={100} />
                {modPercent === 100 && (
                  <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                    Completed
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset button */}
      <div className="border-t border-gray-200 pt-8 dark:border-gray-700">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="rounded-xl border border-red-300 px-6 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Reset All Progress
          </button>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <p className="mb-4 font-medium text-red-700 dark:text-red-400">
              This will erase all your progress. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="rounded-xl bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-gray-300 px-6 py-2 text-sm font-medium text-ink transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
