import { useLocale } from "next-intl";
import { pickLocalized } from "@/lib/content-i18n";
import { LessonContent } from "@/components/learn/LessonContent";
import { RulingList } from "@/components/learn/RulingList";
import type { ModuleNav } from "@/lib/content";
import type { SectionedModule } from "@/types/content";

// Taharah, prayer in practice and janazah are each an introduction plus
// numbered sections, so they share one renderer.
export function SectionedLesson({ data, nav }: { data: SectionedModule; nav: ModuleNav }) {
  const locale = useLocale();

  return (
    <LessonContent
      nav={nav}
      title={pickLocalized<string>(data, "title", locale) ?? data.title_en}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      schoolsNote
    >
      <p className="text-body text-ink">
        {pickLocalized<string>(data.introduction, "content", locale) ?? data.introduction.content_en}
      </p>

      {data.sections.map((section) => (
        <RulingList
          key={section.id}
          heading={pickLocalized<string>(section, "heading", locale) ?? section.heading}
          items={section.items}
        />
      ))}
    </LessonContent>
  );
}
