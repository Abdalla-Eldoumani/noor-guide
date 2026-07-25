"use client";

import { useLocale, useTranslations } from "next-intl";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { RulingList } from "@/components/learn/RulingList";
import { StepByStep } from "@/components/learn/StepByStep";
import { PrayerPosition } from "@/components/learn/PrayerPosition";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";
import { Info } from "lucide-react";
import type { SalahData, SalahStep, SalahSection, Recitation, RulingItem } from "@/types/content";
import { getModuleById } from "@/lib/content";
import { pickLocalized, useLocalizedContent } from "@/lib/content-i18n";

interface SalahClientProps {
  arkan: RulingItem[];
  wajibat: RulingItem[];
  sunan: RulingItem[];
  data: SalahData;
  steps: SalahStep[];
  lessonIds: string[];
}

function pickRecitationTranslation(rec: Recitation, locale: string) {
  return pickLocalized<string>(rec, "translation", locale) ?? rec.translation;
}

export function SalahClient({
  data,
  steps,
  arkan,
  wajibat,
  sunan,
  lessonIds,
}: SalahClientProps) {
  const pickModule = useLocalizedContent();
  const t = useLocalizedContent();
  const locale = useLocale();
  const tSalah = useTranslations("salah");

  const lessonTitle = t<string>(data, "title") ?? data.title_en;
  const introContent =
    t<string>(data.introduction, "content") ?? data.introduction.content_en;
  const introHadithText =
    t<string>(data.introduction.source, "text") ?? data.introduction.source.text_en!;
  const prerequisites =
    t<string[]>(data, "prerequisites") ?? data.prerequisites;

  const renderSectionTitle = (section: SalahSection) =>
    pickLocalized<string>(section, "title", locale) ?? section.title_en;
  const renderSectionWhen = (section: SalahSection) =>
    pickLocalized<string>(section, "when", locale) ?? section.when;
  const renderSectionInstruction = (section: SalahSection) =>
    pickLocalized<string>(section, "instruction", locale) ?? section.instruction_en;
  const renderSectionFingerNote = (section: SalahSection) =>
    pickLocalized<string>(section, "finger_note", locale) ?? section.finger_note;

  const transformedSteps = steps.map((step) => {
    const stepInstruction =
      pickLocalized<string>(step, "instruction", locale) ?? step.instruction_en;
    const stepNotes = pickLocalized<string>(step, "notes", locale) ?? step.notes;
    const stepAfterFatiha =
      pickLocalized<string>(step, "after_fatiha", locale) ?? step.after_fatiha;
    const stepRecTranslation = step.recitation
      ? pickRecitationTranslation(step.recitation, locale)
      : undefined;

    return {
      id: step.id,
      title: pickLocalized<string>(step, "title", locale) ?? step.title_en,
      instruction: stepInstruction,
      arabicContent:
        step.recitation && stepRecTranslation
          ? {
              arabic: step.recitation.arabic,
              transliteration: step.recitation.transliteration,
              translation: stepRecTranslation,
            }
          : undefined,
      notes:
        [
          stepNotes,
          step.repetitions ? tSalah("sayThisTimes", { count: step.repetitions }) : null,
          stepAfterFatiha || null,
        ]
          .filter(Boolean)
          .join(" ") || undefined,
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
      moduleId="salah"
      lessonIds={lessonIds}
      title={lessonTitle}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      prevHref="/learn/wudu"
      prevLabel={pickModule(getModuleById("wudu"), "title")}
      nextHref="/learn/surahs"
      nextLabel={pickModule(getModuleById("surahs"), "title")}
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
          {tSalah("prereqHeading")}
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

      {/* Five Daily Prayers Table */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-4">
          {tSalah("fivePrayersHeading")}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-primary-600 text-white">
                <th className="px-4 py-3 text-start font-heading font-semibold">
                  {tSalah("tableHeaderPrayer")}
                </th>
                <th className="px-4 py-3 text-start font-heading font-semibold">
                  {tSalah("tableHeaderTime")}
                </th>
                <th className="px-4 py-3 text-center font-heading font-semibold">
                  {tSalah("tableHeaderFardh")}
                </th>
                <th className="px-4 py-3 text-center font-heading font-semibold">
                  {tSalah("tableHeaderSunnahBefore")}
                </th>
                <th className="px-4 py-3 text-center font-heading font-semibold">
                  {tSalah("tableHeaderSunnahAfter")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.five_prayers.map((prayer) => {
                const prayerTimeText =
                  pickLocalized<string>(prayer, "time", locale) ?? prayer.time;
                return (
                  <tr key={prayer.name_en} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-semibold text-ink">
                          {pickLocalized<string>(prayer, "name", locale)}
                        </span>
                        {locale !== "ar" && (
                          <span dir="rtl" lang="ar" className="font-arabic text-sm text-muted ms-2">
                            {prayer.name_ar}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{prayerTimeText}</td>
                    <td className="px-4 py-3 text-center font-semibold text-ink">
                      {prayer.fardh_rakaat}
                    </td>
                    <td className="px-4 py-3 text-center text-muted">
                      {prayer.sunnah_before || "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-muted">
                      {prayer.sunnah_after || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Steps of One Rakah with Position Indicators */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-2">
          {tSalah("rakahHeading")}
        </h2>
        <p className="text-muted text-sm mb-4">{tSalah("rakahSubheading")}</p>

        {/* Position legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { position: "standing", label: tSalah("positionStanding") },
            { position: "bowing", label: tSalah("positionBowing") },
            { position: "prostrating", label: tSalah("positionProstrating") },
            { position: "sitting", label: tSalah("positionSitting") },
          ].map((pos) => (
            <PrayerPosition
              key={pos.position}
              position={pos.position}
              label={pos.label}
            />
          ))}
        </div>

        <StepByStep steps={transformedSteps} moduleId="salah" />

        {/* Additional recitations for step 8 (I'tidal) */}
        {steps
          .filter((s) => s.recitation_rising || s.recitation_standing)
          .map((step) => {
            const stepTitle =
              pickLocalized<string>(step, "title", locale) ?? step.title_en;
            const risingTranslation = step.recitation_rising
              ? pickRecitationTranslation(step.recitation_rising, locale)
              : undefined;
            const standingTranslation = step.recitation_standing
              ? pickRecitationTranslation(step.recitation_standing, locale)
              : undefined;
            return (
              <RecitationBlockquote key={`extra-${step.id}`}>
                <h4 className="font-heading font-semibold text-ink text-sm">
                  {stepTitle}: {tSalah("additionalRecitations")}
                </h4>
                {step.recitation_rising && risingTranslation && (
                  <div>
                    <p className="text-xs text-muted mb-1">
                      {tSalah("whileRising")}:
                    </p>
                    <ArabicText
                      arabic={step.recitation_rising.arabic}
                      transliteration={step.recitation_rising.transliteration}
                      translation={risingTranslation}
                    />
                  </div>
                )}
                {step.recitation_standing && standingTranslation && (
                  <div>
                    <p className="text-xs text-muted mb-1">
                      {tSalah("onceStanding")}:
                    </p>
                    <ArabicText
                      arabic={step.recitation_standing.arabic}
                      transliteration={step.recitation_standing.transliteration}
                      translation={standingTranslation}
                    />
                  </div>
                )}
                {step.source && (
                  <SourceReference
                    type={step.source.type}
                    reference={step.source.reference}
                  />
                )}
              </RecitationBlockquote>
            );
          })}
      </section>

      {/* Tashahhud */}
      {data.tashahhud.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-2">
            {renderSectionTitle(data.tashahhud)}
          </h2>
          {locale !== "ar" && (
            <p dir="rtl" lang="ar" className="font-arabic text-sm text-muted mb-3">
              {data.tashahhud.title_ar}
            </p>
          )}
          {renderSectionWhen(data.tashahhud) && (
            <p className="text-sm text-muted italic mb-4">
              {tSalah("whenLabel")}: {renderSectionWhen(data.tashahhud)}
            </p>
          )}
          <RecitationBlockquote>
            <ArabicText
              arabic={data.tashahhud.recitation.arabic}
              transliteration={data.tashahhud.recitation.transliteration}
              translation={pickRecitationTranslation(data.tashahhud.recitation, locale)}
              size="lg"
            />
            {renderSectionFingerNote(data.tashahhud) && (
              <div className="flex gap-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg p-3 text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{renderSectionFingerNote(data.tashahhud)}</p>
              </div>
            )}
            <SourceReference
              type={data.tashahhud.source.type}
              reference={data.tashahhud.source.reference}
            />
          </RecitationBlockquote>
        </section>
      )}

      {/* Salawat Ibrahimiyyah */}
      {data.salawat_ibrahimiyyah.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-2">
            {renderSectionTitle(data.salawat_ibrahimiyyah)}
          </h2>
          {locale !== "ar" && (
            <p dir="rtl" lang="ar" className="font-arabic text-sm text-muted mb-3">
              {data.salawat_ibrahimiyyah.title_ar}
            </p>
          )}
          {renderSectionWhen(data.salawat_ibrahimiyyah) && (
            <p className="text-sm text-muted italic mb-4">
              {tSalah("whenLabel")}: {renderSectionWhen(data.salawat_ibrahimiyyah)}
            </p>
          )}
          <RecitationBlockquote>
            <ArabicText
              arabic={data.salawat_ibrahimiyyah.recitation.arabic}
              transliteration={data.salawat_ibrahimiyyah.recitation.transliteration}
              translation={pickRecitationTranslation(
                data.salawat_ibrahimiyyah.recitation,
                locale,
              )}
              size="lg"
            />
            <SourceReference
              type={data.salawat_ibrahimiyyah.source.type}
              reference={data.salawat_ibrahimiyyah.source.reference}
            />
          </RecitationBlockquote>
        </section>
      )}

      {/* Tasleem */}
      {data.tasleem.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-2">
            {renderSectionTitle(data.tasleem)}
          </h2>
          {locale !== "ar" && (
            <p dir="rtl" lang="ar" className="font-arabic text-sm text-muted mb-3">
              {data.tasleem.title_ar}
            </p>
          )}
          {renderSectionInstruction(data.tasleem) && (
            <p className="text-ink leading-relaxed mb-4">
              {renderSectionInstruction(data.tasleem)}
            </p>
          )}
          <RecitationBlockquote>
            <ArabicText
              arabic={data.tasleem.recitation.arabic}
              transliteration={data.tasleem.recitation.transliteration}
              translation={pickRecitationTranslation(data.tasleem.recitation, locale)}
              size="lg"
            />
            <SourceReference
              type={data.tasleem.source.type}
              reference={data.tasleem.source.reference}
            />
          </RecitationBlockquote>
        </section>
      )}

      {/* Pillars, required duties, and recommended acts */}
      <RulingList
        heading={pickLocalized<string>(data, "arkan_heading", locale) ?? data.arkan_heading}
        items={arkan}
        emphasis="required"
      />

      <RulingList
        heading={pickLocalized<string>(data, "wajibat_heading", locale) ?? data.wajibat_heading}
        items={wajibat}
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
    </LessonContent>
  );
}
