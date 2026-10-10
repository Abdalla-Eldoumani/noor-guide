import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getSalahData,
  getSalahSteps,
  getSalahShurut,
  getSalahArkan,
  getSalahWajibat,
  getSalahSunan,
  getSujudAsSahw,
  getSalahNullifiers,
  getModuleById,
  getModuleNav,
  type ModuleNav,
} from "@/lib/content";
import { pickLocalized, useTranslationCredit } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { RulingList } from "@/components/learn/RulingList";
import { StepByStep, type StepData, type StepRecitation } from "@/components/learn/StepByStep";
import { postureOf, type Posture } from "@/components/learn/PrayerPosition";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";
import type { Recitation, SalahSection } from "@/types/content";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("salah", locale);
}

export default async function SalahPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("salah");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "salah",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <SalahLesson nav={getModuleNav("salah", locale)} />
    </PageWrapper>
  );
}

const POSTURE_KEYS: Record<Posture, string> = {
  standing: "positionStanding",
  bowing: "positionBowing",
  prostrating: "positionProstrating",
  sitting: "positionSitting",
};

function SalahLesson({ nav }: { nav: ModuleNav }) {
  const locale = useLocale();
  const t = useTranslations("salah");
  const credit = useTranslationCredit();
  const data = getSalahData();
  const pick = <T = string,>(obj: object | undefined, field: string) => pickLocalized<T>(obj, field, locale);

  const recitation = (rec: Recitation, label?: string): StepRecitation => ({
    label,
    arabic: rec.arabic,
    transliteration: rec.transliteration,
    translation: pick(rec, "translation") ?? rec.translation,
    credit: credit(rec.translation_provenance),
  });

  const steps: StepData[] = getSalahSteps().map((step) => {
    const posture = postureOf(step.position);
    const recitations = [
      step.recitation && recitation(step.recitation),
      step.recitation_rising && recitation(step.recitation_rising, t("whileRising")),
      step.recitation_standing && recitation(step.recitation_standing, t("onceStanding")),
    ].filter((r): r is StepRecitation => Boolean(r));
    return {
      id: step.id,
      title: pick(step, "title") ?? step.title_en,
      instruction: pick(step, "instruction") ?? step.instruction_en,
      position: { posture, label: t(POSTURE_KEYS[posture]) },
      recitations: recitations.length ? recitations : undefined,
      notes:
        [
          pick(step, "notes"),
          pick(step, "after_fatiha"),
        ]
          .filter(Boolean)
          .join(" ") || undefined,
      source: step.source && { type: step.source.type, reference: step.source.reference },
    };
  });

  const sections: SalahSection[] = [data.tashahhud, data.salawat_ibrahimiyyah, data.tasleem];

  return (
    <LessonContent
      nav={nav}
      title={pick(data, "title") ?? data.title_en}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      schoolsNote
    >
      <section className="space-y-6">
        <p className="text-body text-ink">{pick(data.introduction, "content")}</p>
        <HadithBlock
          text={pick(data.introduction.source, "text") ?? data.introduction.source.text_en}
          reference={data.introduction.source.reference}
          grade={data.introduction.source.grade}
          provenance={data.introduction.source.translation_provenance}
        />
      </section>

      <section>
        <h2 className="font-prose text-section font-semibold text-ink">{t("prereqHeading")}</h2>
        <ul className="mt-4 list-disc space-y-2 ps-5 text-body text-ink marker:text-ink-2">
          {(pick<string[]>(data, "prerequisites") ?? data.prerequisites).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-prose text-section font-semibold text-ink">{t("fivePrayersHeading")}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-start">
            <thead>
              <tr className="border-b border-ink-2 font-ui text-caption text-ink-2">
                <th scope="col" className="py-2 pe-3 text-start font-medium">{t("tableHeaderPrayer")}</th>
                <th scope="col" className="py-2 pe-3 text-start font-medium">{t("tableHeaderTime")}</th>
                <th scope="col" className="px-2 py-2 text-center font-medium">{t("tableHeaderFardh")}</th>
                <th scope="col" className="px-2 py-2 text-center font-medium">{t("tableHeaderSunnahBefore")}</th>
                <th scope="col" className="px-2 py-2 text-center font-medium">{t("tableHeaderSunnahAfter")}</th>
              </tr>
            </thead>
            <tbody>
              {data.five_prayers.map((prayer) => (
                <tr key={prayer.name_en} className="border-b border-rule align-baseline">
                  <th scope="row" className="py-3 pe-3 text-start font-normal">
                    <span className="block text-body font-semibold text-ink">{pick(prayer, "name")}</span>
                    {locale !== "ar" && (
                      <span className="block">
                        <span lang="ar" dir="rtl" className="font-quran text-arabic text-ink-2">
                          {prayer.name_ar}
                        </span>
                      </span>
                    )}
                  </th>
                  <td className="py-3 pe-3 text-small text-ink-2">{pick(prayer, "time") ?? prayer.time}</td>
                  <td className="px-2 py-3 text-center font-ui text-ui font-semibold text-ink">
                    {prayer.fardh_rakaat}
                  </td>
                  <td className="px-2 py-3 text-center font-ui text-ui text-ink-2">{prayer.sunnah_before || "-"}</td>
                  <td className="px-2 py-3 text-center font-ui text-ui text-ink-2">{prayer.sunnah_after || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-prose text-section font-semibold text-ink">{t("rakahHeading")}</h2>
        <p className="mb-5 mt-2 text-small text-ink-2">{t("rakahSubheading")}</p>
        <StepByStep steps={steps} />
      </section>

      {sections
        .filter((section) => section.verified)
        .map((section) => {
          const when = pick(section, "when");
          const instruction = pick(section, "instruction");
          const fingerNote = pick(section, "finger_note");
          const words = recitation(section.recitation);
          return (
            <section key={section.title_en} className="space-y-4">
              <h2 className="flex flex-wrap items-baseline gap-x-3 font-prose text-section font-semibold text-ink">
                <span>{pick(section, "title") ?? section.title_en}</span>
                {locale !== "ar" && (
                  <span lang="ar" dir="rtl" className="font-quran text-arabic font-normal text-ink-2">
                    {section.title_ar}
                  </span>
                )}
              </h2>
              {when && <p className="text-small text-ink-2">{t("whenLabel", { when })}</p>}
              {instruction && <p className="text-body text-ink">{instruction}</p>}
              <RecitationBlockquote>
                <ArabicText
                  arabic={words.arabic}
                  transliteration={words.transliteration}
                  translation={words.translation}
                  credit={words.credit}
                />
                {fingerNote && <p className="text-small text-ink-2">{fingerNote}</p>}
                <SourceReference type={section.source.type} reference={section.source.reference} />
              </RecitationBlockquote>
            </section>
          );
        })}

      <RulingList heading={pick(data, "shurut_heading") ?? data.shurut_heading} items={getSalahShurut()} />

      <p className="rounded-panel border border-rule px-4 py-3 font-ui text-ui text-ink-2">
        {pick(data, "madhab_note") ?? data.madhab_note}
      </p>

      <RulingList heading={pick(data, "arkan_heading") ?? data.arkan_heading} items={getSalahArkan()} />
      <RulingList heading={pick(data, "wajibat_heading") ?? data.wajibat_heading} items={getSalahWajibat()} />
      <RulingList heading={pick(data, "sunan_heading") ?? data.sunan_heading} items={getSalahSunan()} />
      <RulingList
        heading={pick(data, "sujud_as_sahw_heading") ?? data.sujud_as_sahw_heading}
        items={getSujudAsSahw()}
      />
      <RulingList
        heading={pick(data, "nullifiers_heading") ?? data.nullifiers_heading}
        items={getSalahNullifiers()}
      />
    </LessonContent>
  );
}
