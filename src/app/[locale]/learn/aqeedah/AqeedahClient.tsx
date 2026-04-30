"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { QuranVerse } from "@/components/learn/QuranVerse";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { AqeedahData, AqeedahPillar } from "@/types/content";
import { useLocalizedContent } from "@/lib/content-i18n";

interface AqeedahClientProps {
  data: AqeedahData;
  pillars: AqeedahPillar[];
  lessonIds: string[];
}

export function AqeedahClient({ data, pillars, lessonIds }: AqeedahClientProps) {
  const t = useLocalizedContent();
  const locale = useLocale();
  const tAqeedah = useTranslations("aqeedah");
  const [openPillar, setOpenPillar] = useState<string | null>(
    pillars[0]?.id || null
  );

  const toggle = (id: string) => {
    setOpenPillar((prev) => (prev === id ? null : id));
  };

  const lessonTitle = t<string>(data, "title") ?? data.title_en;
  const introContent =
    t<string>(data.introduction, "content") ?? data.introduction.content_en;
  const introHadithText =
    t<string>(data.introduction.source, "text") ?? data.introduction.source.text_en;

  return (
    <LessonContent
      moduleId="aqeedah"
      lessonIds={lessonIds}
      title={lessonTitle}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      nextHref="/learn/pillars"
      nextLabel="Five Pillars of Islam"
    >
      {/* Introduction */}
      <section>
        <p className="text-ink leading-relaxed mb-4">{introContent}</p>
        <HadithBlock
          text={introHadithText}
          reference={data.introduction.source.reference}
          grade={data.introduction.source.grade}
        />
      </section>

      {/* Pillars */}
      <section className="space-y-3">
        {pillars.map((pillar) => {
          const isOpen = openPillar === pillar.id;
          const pillarTitle = t<string>(pillar, "title") ?? pillar.title_en;
          const pillarDescription =
            t<string>(pillar, "description") ?? pillar.description_en;
          const keyPoints = t<string[]>(pillar, "key_points") ?? pillar.key_points;
          const hadithText = pillar.hadith_reference
            ? (t<string>(pillar.hadith_reference, "text") ?? pillar.hadith_reference.text_en)
            : null;

          return (
            <div
              key={pillar.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-start hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggle(pillar.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center font-semibold">
                    {pillar.order}
                  </span>
                  <div className="text-start">
                    <h3 className="font-heading font-semibold text-ink dark:text-gray-100">
                      {pillarTitle}
                    </h3>
                    {locale !== "ar" && (
                      <p className="font-arabic text-sm text-muted">
                        {pillar.title_ar}
                      </p>
                    )}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <p className="text-ink leading-relaxed">{pillarDescription}</p>

                  <div>
                    <h4 className="font-heading text-sm font-semibold text-muted uppercase tracking-wide mb-2">
                      {tAqeedah("keyPoints")}
                    </h4>
                    <ul className="space-y-1.5">
                      {keyPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-ink"
                        >
                          <span className="text-primary-500 mt-1">&#x2022;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {pillar.quran_references.map((ref) => (
                    <QuranVerse
                      key={ref.reference}
                      reference={ref.reference}
                      arabic={ref.arabic}
                      transliteration={ref.transliteration}
                      translation={ref.translation}
                    />
                  ))}

                  {pillar.hadith_reference && hadithText && (
                    <HadithBlock
                      text={hadithText}
                      reference={pillar.hadith_reference.reference}
                      grade={pillar.hadith_reference.grade}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </LessonContent>
  );
}
