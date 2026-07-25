"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { MODULE_GLYPHS, GlyphBook } from "@/components/ui/Glyphs";
import type { LearningModule } from "@/types/content";
import { pickLocalized } from "@/lib/content-i18n";

interface LessonCardProps {
  module: LearningModule;
  completedLessons: number;
  totalLessons: number;
}

export function LessonCard({
  module,
  completedLessons,
  totalLessons,
}: LessonCardProps) {
  const locale = useLocale();
  const tLearn = useTranslations("learn");
  const tHome = useTranslations("home");

  const Glyph = MODULE_GLYPHS[module.icon] ?? GlyphBook;
  const percent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);
  const variant =
    percent === 100
      ? "completed"
      : completedLessons > 0
        ? "in-progress"
        : "locked";

  const title = pickLocalized<string>(module, "title", locale) ?? module.title_en;
  const description =
    pickLocalized<string>(module, "description", locale) ?? module.description_en;

  const statusLabel =
    percent === 100
      ? tLearn("statusComplete")
      : completedLessons > 0
        ? tLearn("statusInProgress")
        : tLearn("statusNotStarted");

  return (
    <Card href={`/learn/${module.id}`} className="group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500 dark:text-primary-300 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
          <Glyph size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-heading font-semibold text-ink dark:text-gray-100 truncate">
              {title}
            </h3>
            <Badge variant={variant}>{statusLabel}</Badge>
          </div>
          {locale !== "ar" && (
            <p dir="rtl" lang="ar" className="font-arabic text-sm text-muted mb-2">
              {module.title_ar}
            </p>
          )}
          <p className="text-sm text-muted mb-3 line-clamp-2">{description}</p>
          <div className="flex items-center gap-3">
            <ProgressBar value={percent} className="flex-1" />
            <span className="text-xs text-muted whitespace-nowrap">
              {tHome("estimatedMinutes", { minutes: module.estimatedMinutes })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
