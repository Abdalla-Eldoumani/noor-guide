"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { LessonContent } from "@/components/learn/LessonContent";
import type { SurahsData, Surah } from "@/types/content";
import { getModuleById } from "@/lib/content";
import { pickLocalized, useLocalizedContent } from "@/lib/content-i18n";

const SurahPlayer = dynamic(
  () =>
    import("@/components/learn/SurahPlayer").then((m) => m.SurahPlayer),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    ),
  }
);

const MemorizationHelper = dynamic(
  () =>
    import("@/components/learn/MemorizationHelper").then(
      (m) => m.MemorizationHelper
    ),
  { ssr: false }
);

interface SurahsClientProps {
  data: SurahsData;
  surahs: Surah[];
  lessonIds: string[];
}

export function SurahsClient({ data, surahs, lessonIds }: SurahsClientProps) {
  const pickModule = useLocalizedContent();
  const t = useLocalizedContent();
  const locale = useLocale();
  const tSurahs = useTranslations("surahs");

  const lessonTitle = t<string>(data, "title") ?? data.title_en;
  const introContent =
    t<string>(data.introduction, "content") ?? data.introduction.content_en;

  return (
    <LessonContent
      moduleId="surahs"
      lessonIds={lessonIds}
      title={lessonTitle}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      prevHref="/learn/salah"
      prevLabel={pickModule(getModuleById("salah"), "title")}
      nextHref="/learn/duas"
      nextLabel={pickModule(getModuleById("duas"), "title")}
    >
      {/* Introduction */}
      <section>
        <p className="text-ink leading-relaxed">{introContent}</p>
      </section>

      {/* Surahs */}
      <section className="space-y-8">
        {surahs.map((surah, index) => {
          const priorityText =
            pickLocalized<string>(surah, "priority", locale) ?? surah.priority;
          return (
            <div key={surah.id} className="space-y-4">
              {/* Priority callout for Al-Fatiha */}
              {index === 0 && (
                <div className="bg-accent-50 dark:bg-accent-400/10 border border-accent-200 dark:border-accent-400/30 rounded-xl px-5 py-3">
                  <p className="text-sm font-semibold text-accent-700 dark:text-accent-300">
                    {tSurahs("startHere")}: {priorityText}
                  </p>
                </div>
              )}

              <SurahPlayer surah={surah} />

              <MemorizationHelper verses={surah.verses} />
            </div>
          );
        })}
      </section>
    </LessonContent>
  );
}
