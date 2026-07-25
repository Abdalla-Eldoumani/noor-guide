"use client";

import { useLocale } from "next-intl";
import { getModuleById } from "@/lib/content";
import { pickLocalized, useLocalizedContent } from "@/lib/content-i18n";
import { LessonContent } from "@/components/learn/LessonContent";
import { RulingList } from "@/components/learn/RulingList";
import type { SectionedModule } from "@/types/content";

interface SectionedLessonProps {
  data: SectionedModule;
  lessonIds: string[];
  prevHref?: string;
  prevModuleId?: string;
  nextHref?: string;
  nextModuleId?: string;
}

// Renders any module built from an introduction plus a list of sections. The
// three modules added after the original six share this shape, so they share
// one renderer rather than repeating a bespoke client each time.
export function SectionedLesson({
  data,
  lessonIds,
  prevHref,
  prevModuleId,
  nextHref,
  nextModuleId,
}: SectionedLessonProps) {
  const locale = useLocale();
  const pick = useLocalizedContent();

  return (
    <LessonContent
      moduleId={data.module_id}
      lessonIds={lessonIds}
      title={pick<string>(data, "title") ?? data.title_en}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      prevHref={prevHref}
      prevLabel={prevModuleId ? pick(getModuleById(prevModuleId), "title") : undefined}
      nextHref={nextHref}
      nextLabel={nextModuleId ? pick(getModuleById(nextModuleId), "title") : undefined}
    >
      <section>
        <p className="text-ink leading-relaxed">
          {pick<string>(data.introduction, "content") ?? data.introduction.content_en}
        </p>
      </section>

      {data.sections.map((entry) => (
        <RulingList
          key={entry.id}
          heading={pickLocalized<string>(entry, "heading", locale) ?? entry.heading}
          items={entry.items}
          emphasis={entry.emphasis}
        />
      ))}
    </LessonContent>
  );
}

export default SectionedLesson;
