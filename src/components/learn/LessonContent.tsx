"use client";

import { useProgress } from "@/hooks/useProgress";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface LessonContentProps {
  moduleId: string;
  lessonIds?: string[];
  title: string;
  titleAr?: string;
  children: React.ReactNode;
  prevHref?: string;
  prevLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}

export function LessonContent({
  moduleId,
  lessonIds,
  title,
  titleAr,
  children,
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
}: LessonContentProps) {
  const { markComplete, isComplete } = useProgress();

  // Use the lesson IDs from learning-path.json if provided, otherwise fall back to moduleId
  const idsToTrack = lessonIds && lessonIds.length > 0 ? lessonIds : [moduleId];
  const completed = idsToTrack.every((id) => isComplete(id));

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: title },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink">{title}</h1>
        {titleAr && (
          <p className="font-arabic text-arabic-lg text-primary-500 mt-2">
            {titleAr}
          </p>
        )}
      </div>

      <div className="space-y-8">{children}</div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-center mb-8">
          {completed ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>You have completed this lesson</span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={() => idsToTrack.forEach((id) => markComplete(id))}
            >
              Mark as Complete
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {prevHref && (
              <Button variant="ghost" href={prevHref} icon={<ArrowLeft className="w-4 h-4" />}>
                {prevLabel || "Previous"}
              </Button>
            )}
          </div>
          <div>
            {nextHref && (
              <Button variant="secondary" href={nextHref}>
                <span className="flex items-center gap-2">
                  {nextLabel || "Next"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
