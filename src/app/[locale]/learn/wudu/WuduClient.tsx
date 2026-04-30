"use client";

import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { StepByStep } from "@/components/learn/StepByStep";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";
import { AlertCircle, Info } from "lucide-react";
import type { WuduData, WuduStep, WuduBreaker } from "@/types/content";

interface WuduClientProps {
  data: WuduData;
  steps: WuduStep[];
  breakers: WuduBreaker[];
  lessonIds: string[];
}

export function WuduClient({ data, steps, breakers, lessonIds }: WuduClientProps) {
  const transformedSteps = steps.map((step) => ({
    id: step.id,
    title: step.title_en,
    instruction: step.instruction_en,
    arabicContent: step.content
      ? {
          arabic: step.content.arabic,
          transliteration: step.content.transliteration,
          translation: step.content.translation,
        }
      : undefined,
    notes: step.notes
      ? step.notes +
        (step.repetitions ? ` (Repeat ${step.repetitions} times)` : "")
      : step.repetitions
        ? `Repeat ${step.repetitions} times.`
        : undefined,
    source: step.source
      ? {
          type: step.source.type as "quran" | "hadith" | "scholarly_consensus",
          reference: step.source.reference,
        }
      : undefined,
  }));

  return (
    <LessonContent
      moduleId="wudu"
      lessonIds={lessonIds}
      title={data.title_en}
      titleAr={data.title_ar}
      prevHref="/learn/pillars"
      prevLabel="Five Pillars"
      nextHref="/learn/salah"
      nextLabel="How to Pray"
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

      {/* Prerequisites */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-3">
          Before You Begin
        </h2>
        <ul className="space-y-2">
          {data.prerequisites.map((prereq, i) => (
            <li key={i} className="flex items-start gap-2 text-ink">
              <span className="text-primary-500 mt-1">&#x2022;</span>
              <span>{prereq}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Step-by-step */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-4">
          The Steps of Wudu
        </h2>
        <StepByStep steps={transformedSteps} moduleId="wudu" />
      </section>

      {/* Dua after Wudu */}
      {data.dua_after_wudu.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-3">
            Dua After Completing Wudu
          </h2>
          <RecitationBlockquote>
            <ArabicText
              arabic={data.dua_after_wudu.arabic}
              transliteration={data.dua_after_wudu.transliteration}
              translation={data.dua_after_wudu.translation}
              size="lg"
            />
            <SourceReference
              type={data.dua_after_wudu.source.type}
              reference={data.dua_after_wudu.source.reference}
            />
          </RecitationBlockquote>
        </section>
      )}

      {/* What breaks Wudu */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          What Breaks Your Wudu
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {breakers.map((breaker) => (
            <div key={breaker.id} className="px-5 py-3">
              <p className="text-ink">{breaker.description}</p>
              {breaker.notes && (
                <div className="flex gap-2 mt-1.5 text-sm text-muted">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{breaker.notes}</span>
                </div>
              )}
              {breaker.source && (
                <div className="mt-1.5">
                  <SourceReference type="hadith" reference={breaker.source} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </LessonContent>
  );
}
