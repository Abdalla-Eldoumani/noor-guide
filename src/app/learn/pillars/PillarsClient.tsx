"use client";

import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { Card } from "@/components/ui/Card";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import type { PillarsData, IslamPillar } from "@/types/content";

interface PillarsClientProps {
  data: PillarsData;
  pillars: IslamPillar[];
  lessonIds: string[];
}

export function PillarsClient({ data, pillars, lessonIds }: PillarsClientProps) {
  return (
    <LessonContent
      moduleId="pillars"
      lessonIds={lessonIds}
      title={data.title_en}
      titleAr={data.title_ar}
      prevHref="/learn/aqeedah"
      prevLabel="Aqeedah"
      nextHref="/learn/wudu"
      nextLabel="How to Perform Wudu"
    >
      {/* Introduction */}
      <section>
        <p className="text-ink leading-relaxed mb-4">
          {data.introduction.content_en}
        </p>
        <HadithBlock
          text={data.introduction.source.text_en}
          reference={data.introduction.source.reference}
          grade={data.introduction.source.grade}
        />
      </section>

      {/* Pillars */}
      <section className="space-y-4">
        {pillars.map((pillar) => (
          <Card key={pillar.id}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center font-semibold">
                  {pillar.order}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-ink">
                    {pillar.title_en}
                  </h3>
                  <p className="font-arabic text-sm text-muted">
                    {pillar.title_ar}
                  </p>
                </div>
              </div>

              <p className="text-ink leading-relaxed">
                {pillar.description_en}
              </p>

              {pillar.content && (
                <div className="bg-primary-50/50 rounded-lg p-4">
                  <ArabicText
                    arabic={pillar.content.arabic}
                    transliteration={pillar.content.transliteration}
                    translation={pillar.content.translation}
                    size="lg"
                  />
                </div>
              )}

              {pillar.quran_reference && (
                <SourceReference
                  type="quran"
                  reference={pillar.quran_reference.reference}
                />
              )}

              {pillar.notes && (
                <p className="text-sm text-muted italic">{pillar.notes}</p>
              )}

              {pillar.link_to_module && (
                <Button
                  variant="outline"
                  size="sm"
                  href={pillar.link_to_module}
                >
                  <span className="flex items-center gap-1.5">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </section>
    </LessonContent>
  );
}
