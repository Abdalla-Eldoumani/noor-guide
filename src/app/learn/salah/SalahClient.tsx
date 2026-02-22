"use client";

import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { StepByStep } from "@/components/learn/StepByStep";
import { PrayerPosition } from "@/components/learn/PrayerPosition";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { Info } from "lucide-react";
import type { SalahData, SalahStep } from "@/types/content";

interface SalahClientProps {
  data: SalahData;
  steps: SalahStep[];
  lessonIds: string[];
}

export function SalahClient({ data, steps, lessonIds }: SalahClientProps) {
  const transformedSteps = steps.map((step) => ({
    id: step.id,
    title: step.title_en,
    instruction: step.instruction_en,
    arabicContent: step.recitation
      ? {
          arabic: step.recitation.arabic,
          transliteration: step.recitation.transliteration,
          translation: step.recitation.translation,
        }
      : undefined,
    notes: [
      step.notes,
      step.repetitions ? `Say this ${step.repetitions} times.` : null,
      step.after_fatiha || null,
    ]
      .filter(Boolean)
      .join(" ") || undefined,
    source: step.source
      ? {
          type: step.source.type as "quran" | "hadith" | "scholarly_consensus",
          reference: step.source.reference,
        }
      : undefined,
  }));

  return (
    <LessonContent
      moduleId="salah"
      lessonIds={lessonIds}
      title={data.title_en}
      titleAr={data.title_ar}
      prevHref="/learn/wudu"
      prevLabel="Wudu"
      nextHref="/learn/surahs"
      nextLabel="Essential Surahs"
    >
      {/* Introduction */}
      <section>
        <p className="text-ink leading-relaxed mb-4">
          {data.introduction.content_en}
        </p>
        <HadithBlock
          text={data.introduction.source.text_en!}
          reference={data.introduction.source.reference}
          grade={data.introduction.source.grade}
        />
      </section>

      {/* Prerequisites */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-3">
          Before You Pray
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

      {/* Five Daily Prayers Table */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-4">
          The Five Daily Prayers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-primary-600 text-white">
                <th className="px-4 py-3 text-left font-heading font-semibold">
                  Prayer
                </th>
                <th className="px-4 py-3 text-left font-heading font-semibold">
                  Time
                </th>
                <th className="px-4 py-3 text-center font-heading font-semibold">
                  Fardh
                </th>
                <th className="px-4 py-3 text-center font-heading font-semibold">
                  Sunnah Before
                </th>
                <th className="px-4 py-3 text-center font-heading font-semibold">
                  Sunnah After
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.five_prayers.map((prayer) => (
                <tr key={prayer.name_en} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-semibold text-ink">
                        {prayer.name_en}
                      </span>
                      <span className="font-arabic text-sm text-muted ml-2">
                        {prayer.name_ar}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{prayer.time}</td>
                  <td className="px-4 py-3 text-center font-semibold text-ink">
                    {prayer.fardh_rakaat}
                  </td>
                  <td className="px-4 py-3 text-center text-muted">
                    {prayer.sunnah_before || "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-muted">
                    {prayer.sunnah_after || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Steps of One Rakah with Position Indicators */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink mb-2">
          Steps of One Rakah (Unit of Prayer)
        </h2>
        <p className="text-muted text-sm mb-4">
          Each unit of prayer (rakah) follows these steps. The number of rakaat
          varies by prayer — see the table above.
        </p>

        {/* Position legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { position: "standing", label: "Standing" },
            { position: "bowing", label: "Bowing" },
            { position: "prostrating", label: "Prostrating" },
            { position: "sitting", label: "Sitting" },
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
          .map((step) => (
            <div
              key={`extra-${step.id}`}
              className="mt-4 bg-primary-50/50 rounded-xl p-5 space-y-3"
            >
              <h4 className="font-heading font-semibold text-ink text-sm">
                {step.title_en} — Additional Recitations
              </h4>
              {step.recitation_rising && (
                <div>
                  <p className="text-xs text-muted mb-1">While rising:</p>
                  <ArabicText
                    arabic={step.recitation_rising.arabic}
                    transliteration={step.recitation_rising.transliteration}
                    translation={step.recitation_rising.translation}
                  />
                </div>
              )}
              {step.recitation_standing && (
                <div>
                  <p className="text-xs text-muted mb-1">Once standing:</p>
                  <ArabicText
                    arabic={step.recitation_standing.arabic}
                    transliteration={step.recitation_standing.transliteration}
                    translation={step.recitation_standing.translation}
                  />
                </div>
              )}
              {step.source && (
                <SourceReference
                  type={step.source.type}
                  reference={step.source.reference}
                />
              )}
            </div>
          ))}
      </section>

      {/* Tashahhud */}
      {data.tashahhud.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-2">
            {data.tashahhud.title_en}
          </h2>
          <p className="font-arabic text-sm text-muted mb-3">
            {data.tashahhud.title_ar}
          </p>
          {data.tashahhud.when && (
            <p className="text-sm text-muted italic mb-4">
              When: {data.tashahhud.when}
            </p>
          )}
          <div className="bg-primary-50/50 rounded-xl p-5 space-y-3">
            <ArabicText
              arabic={data.tashahhud.recitation.arabic}
              transliteration={data.tashahhud.recitation.transliteration}
              translation={data.tashahhud.recitation.translation}
              size="lg"
            />
            {data.tashahhud.finger_note && (
              <div className="flex gap-3 bg-blue-50 text-blue-800 rounded-lg p-3 text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{data.tashahhud.finger_note}</p>
              </div>
            )}
            <SourceReference
              type={data.tashahhud.source.type}
              reference={data.tashahhud.source.reference}
            />
          </div>
        </section>
      )}

      {/* Salawat Ibrahimiyyah */}
      {data.salawat_ibrahimiyyah.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-2">
            {data.salawat_ibrahimiyyah.title_en}
          </h2>
          <p className="font-arabic text-sm text-muted mb-3">
            {data.salawat_ibrahimiyyah.title_ar}
          </p>
          {data.salawat_ibrahimiyyah.when && (
            <p className="text-sm text-muted italic mb-4">
              When: {data.salawat_ibrahimiyyah.when}
            </p>
          )}
          <div className="bg-primary-50/50 rounded-xl p-5 space-y-3">
            <ArabicText
              arabic={data.salawat_ibrahimiyyah.recitation.arabic}
              transliteration={
                data.salawat_ibrahimiyyah.recitation.transliteration
              }
              translation={data.salawat_ibrahimiyyah.recitation.translation}
              size="lg"
            />
            <SourceReference
              type={data.salawat_ibrahimiyyah.source.type}
              reference={data.salawat_ibrahimiyyah.source.reference}
            />
          </div>
        </section>
      )}

      {/* Tasleem */}
      {data.tasleem.verified && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink mb-2">
            {data.tasleem.title_en}
          </h2>
          <p className="font-arabic text-sm text-muted mb-3">
            {data.tasleem.title_ar}
          </p>
          {data.tasleem.instruction_en && (
            <p className="text-ink leading-relaxed mb-4">
              {data.tasleem.instruction_en}
            </p>
          )}
          <div className="bg-primary-50/50 rounded-xl p-5 space-y-3">
            <ArabicText
              arabic={data.tasleem.recitation.arabic}
              transliteration={data.tasleem.recitation.transliteration}
              translation={data.tasleem.recitation.translation}
              size="lg"
            />
            <SourceReference
              type={data.tasleem.source.type}
              reference={data.tasleem.source.reference}
            />
          </div>
        </section>
      )}
    </LessonContent>
  );
}
