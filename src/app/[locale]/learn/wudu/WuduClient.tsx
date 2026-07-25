"use client";

import { useLocale, useTranslations } from "next-intl";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { RulingList } from "@/components/learn/RulingList";
import { StepByStep } from "@/components/learn/StepByStep";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";
import { AlertCircle, Info } from "lucide-react";
import type { WuduData, WuduStep, WuduBreaker, RulingItem } from "@/types/content";
import { getModuleById } from "@/lib/content";
import { pickLocalized, useLocalizedContent } from "@/lib/content-i18n";

interface WuduClientProps {
  obligations: RulingItem[];
  sunan: RulingItem[];
  data: WuduData;
  steps: WuduStep[];
  breakers: WuduBreaker[];
  lessonIds: string[];
}

export function WuduClient({
  data,
  steps,
  breakers,
  obligations,
  sunan,
  lessonIds,
}: WuduClientProps) {
  const pickModule = useLocalizedContent();
  const t = useLocalizedContent();
  const locale = useLocale();
  const tWudu = useTranslations("wudu");

  const lessonTitle = t<string>(data, "title") ?? data.title_en;
  const introContent =
    t<string>(data.introduction, "content") ?? data.introduction.content_en;
  const introHadithText =
    t<string>(data.introduction.source, "text") ?? data.introduction.source.text_en;
  const prerequisites =
    t<string[]>(data, "prerequisites") ?? data.prerequisites;
  const duaTranslation =
    t<string>(data.dua_after_wudu, "translation") ?? data.dua_after_wudu.translation;

  const repeatLabel = (count: number) => tWudu("repeat", { count });

  const transformedSteps = steps.map((step) => {
    const stepInstruction =
      pickLocalized<string>(step, "instruction", locale) ?? step.instruction_en;
    const stepNotes = pickLocalized<string>(step, "notes", locale) ?? step.notes;
    const stepTranslation = step.content
      ? (pickLocalized<string>(step.content, "translation", locale) ??
        step.content.translation)
      : undefined;

    return {
      id: step.id,
      title: pickLocalized<string>(step, "title", locale) ?? step.title_en,
      instruction: stepInstruction,
      arabicContent:
        step.content && stepTranslation
          ? {
              arabic: step.content.arabic,
              transliteration: step.content.transliteration,
              translation: stepTranslation,
            }
          : undefined,
      notes: stepNotes
        ? stepNotes + (step.repetitions ? ` (${repeatLabel(step.repetitions)})` : "")
        : step.repetitions
          ? repeatLabel(step.repetitions)
          : undefined,
      source: step.source
        ? {
            type: step.source.type as "quran" | "hadith" | "scholarly_consensus",
            reference: step.source.reference,
          }
        : undefined,
    };
  });

  return (
    <LessonContent
      moduleId="wudu"
      lessonIds={lessonIds}
      title={lessonTitle}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      prevHref="/learn/pillars"
      prevLabel={pickModule(getModuleById("pillars"), "title")}
      nextHref="/learn/salah"
      nextLabel={pickModule(getModuleById("salah"), "title")}
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

      {/* Prerequisites */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-3">
          {tWudu("prereqHeading")}
        </h2>
        <ul className="space-y-2">
          {prerequisites.map((prereq, i) => (
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
          {tWudu("stepsHeading")}
        </h2>
        <StepByStep steps={transformedSteps} moduleId="wudu" />
      </section>

      {/* Dua after Wudu */}
      {data.dua_after_wudu.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-3">
            {tWudu("duaHeading")}
          </h2>
          <RecitationBlockquote>
            <ArabicText
              arabic={data.dua_after_wudu.arabic}
              transliteration={data.dua_after_wudu.transliteration}
              translation={duaTranslation}
              size="lg"
            />
            <SourceReference
              type={data.dua_after_wudu.source.type}
              reference={data.dua_after_wudu.source.reference}
            />
          </RecitationBlockquote>
        </section>
      )}

      {/* Obligatory acts, then recommended acts, then what nullifies them */}
      <RulingList
        heading={pickLocalized<string>(data, "obligations_heading", locale) ?? data.obligations_heading}
        items={obligations}
        emphasis="required"
      />

      <RulingList
        heading={pickLocalized<string>(data, "sunan_heading", locale) ?? data.sunan_heading}
        items={sunan}
        emphasis="recommended"
      />

      <p className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 text-sm text-muted dark:text-gray-400">
        {pickLocalized<string>(data, "madhab_note", locale) ?? data.madhab_note}
      </p>

      {/* What breaks Wudu */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          {tWudu("breakersHeading")}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {breakers.map((breaker) => {
            const breakerDescription =
              pickLocalized<string>(breaker, "description", locale) ?? breaker.description;
            const breakerNotes =
              pickLocalized<string>(breaker, "notes", locale) ?? breaker.notes;
            return (
              <div key={breaker.id} className="px-5 py-3">
                <p className="text-ink">{breakerDescription}</p>
                {breakerNotes && (
                  <div className="flex gap-2 mt-1.5 text-sm text-muted">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{breakerNotes}</span>
                  </div>
                )}
                {breaker.source && (
                  <div className="mt-1.5">
                    <SourceReference type="hadith" reference={breaker.source} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </LessonContent>
  );
}
