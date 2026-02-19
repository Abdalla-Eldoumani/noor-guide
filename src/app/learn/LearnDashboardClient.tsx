"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { LessonCard } from "@/components/learn/LessonCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { BookOpen, ArrowRight, BookA } from "lucide-react";
import type { LearningModule } from "@/types/content";

interface LearnDashboardClientProps {
  modules: LearningModule[];
}

export function LearnDashboardClient({ modules }: LearnDashboardClientProps) {
  const { progress, isComplete } = useProgress();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedTotal = progress.completedLessons.length;
  const overallPercent =
    totalLessons === 0
      ? 0
      : Math.round((completedTotal / totalLessons) * 100);

  // Find the first incomplete module for "continue" link
  const currentModule = modules.find((m) =>
    m.lessons.some((l) => !progress.completedLessons.includes(l))
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Learn" }]}
      />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary-500" />
          <h1 className="font-heading text-3xl font-bold text-ink">
            Your Learning Journey
          </h1>
        </div>
        <p className="text-muted">
          Follow this guided path to learn the essentials of Islam at your own
          pace. Each module builds on the one before it.
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-semibold text-ink">
            Overall Progress
          </span>
          <span className="text-sm text-muted">
            {completedTotal} of {totalLessons} lessons
          </span>
        </div>
        <ProgressBar value={overallPercent} />
      </div>

      {/* Continue where you left off */}
      {currentModule && completedTotal > 0 && (
        <div className="bg-primary-50 rounded-xl p-5 mb-8">
          <p className="text-sm font-medium text-primary-600 mb-2">
            Continue where you left off
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-ink">
                {currentModule.title_en}
              </h3>
              <p className="font-arabic text-sm text-muted">
                {currentModule.title_ar}
              </p>
            </div>
            <Button variant="primary" size="sm" href={`/learn/${currentModule.id}`}>
              <span className="flex items-center gap-1.5">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Module roadmap */}
      <div className="space-y-4">
        {modules.map((module) => {
          const moduleLessonsCompleted = module.lessons.filter((l) =>
            progress.completedLessons.includes(l)
          ).length;

          return (
            <LessonCard
              key={module.id}
              module={module}
              completedLessons={moduleLessonsCompleted}
              totalLessons={module.lessons.length}
            />
          );
        })}

        {/* Glossary — reference resource */}
        <Link
          href="/learn/glossary"
          className="block rounded-2xl border border-gray-200 bg-surface p-5 transition-all hover:border-primary-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
              <BookA className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-ink dark:text-gray-100">
                Islamic Glossary
              </h3>
              <p className="font-arabic text-sm text-muted dark:text-gray-400 mb-2" dir="rtl">
                مصطلحات إسلامية
              </p>
              <p className="text-sm text-muted dark:text-gray-400">
                A reference of essential Islamic terms and common Arabic phrases you will encounter on your journey.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
