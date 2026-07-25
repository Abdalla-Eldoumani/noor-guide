"use client";

import { useLocale, useTranslations } from "next-intl";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { Card } from "@/components/ui/Card";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import type { PillarsData, IslamPillar } from "@/types/content";
import { getModuleById } from "@/lib/content";
import { useLocalizedContent } from "@/lib/content-i18n";

interface PillarsClientProps {
  data: PillarsData;
  pillars: IslamPillar[];
  lessonIds: string[];
}

export function PillarsClient({ data, pillars, lessonIds }: PillarsClientProps) {
  const pickModule = useLocalizedContent();
  const t = useLocalizedContent();
  const locale = useLocale();
  const tPillars = useTranslations("pillars");

  const lessonTitle = t<string>(data, "title") ?? data.title_en;
  const introContent =
    t<string>(data.introduction, "content") ?? data.introduction.content_en;
  const introHadithText =
    t<string>(data.introduction.source, "text") ?? data.introduction.source.text_en;

  return (
    <LessonContent
      moduleId="pillars"
      lessonIds={lessonIds}
      title={lessonTitle}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      prevHref="/learn/aqeedah"
      prevLabel={pickModule(getModuleById("aqeedah"), "title")}
      nextHref="/learn/wudu"
      nextLabel={pickModule(getModuleById("wudu"), "title")}
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
      <section className="space-y-4">
        {pillars.map((pillar) => {
          const pillarTitle = t<string>(pillar, "title") ?? pillar.title_en;
          const pillarDescription =
            t<string>(pillar, "description") ?? pillar.description_en;
          const pillarNotes = t<string>(pillar, "notes") ?? pillar.notes;
          const pillarTranslation = pillar.content
            ? (t<string>(pillar.content, "translation") ?? pillar.content.translation)
            : undefined;

          return (
            <Card key={pillar.id}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center font-semibold">
                    {pillar.order}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
                      {pillarTitle}
                    </h3>
                    {locale !== "ar" && (
                      <p dir="rtl" lang="ar" className="font-arabic text-sm text-muted">
                        {pillar.title_ar}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-ink leading-relaxed">{pillarDescription}</p>

                {pillar.content && pillarTranslation && (
                  <RecitationBlockquote>
                    <ArabicText
                      arabic={pillar.content.arabic}
                      transliteration={pillar.content.transliteration}
                      translation={pillarTranslation}
                      size="lg"
                    />
                  </RecitationBlockquote>
                )}

                {pillar.quran_reference && (
                  <SourceReference
                    type="quran"
                    reference={pillar.quran_reference.reference}
                  />
                )}

                {pillarNotes && (
                  <p className="text-sm text-muted italic">{pillarNotes}</p>
                )}

                {pillar.link_to_module && (
                  <Button
                    variant="outline"
                    size="sm"
                    href={pillar.link_to_module}
                  >
                    <span className="flex items-center gap-1.5">
                      {tPillars("learnMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </LessonContent>
  );
}
