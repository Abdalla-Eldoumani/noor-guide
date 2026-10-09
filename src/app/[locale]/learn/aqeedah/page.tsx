import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { getAqeedahData, getAqeedahPillars, getModuleById, getModuleNav, type ModuleNav } from "@/lib/content";
import { pickLocalized, useTranslationCredit } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { QuranVerse } from "@/components/learn/QuranVerse";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("aqeedah", locale);
}

export default async function AqeedahPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("aqeedah");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "aqeedah",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <AqeedahLesson nav={getModuleNav("aqeedah", locale)} />
    </PageWrapper>
  );
}

function AqeedahLesson({ nav }: { nav: ModuleNav }) {
  const locale = useLocale();
  const t = useTranslations("aqeedah");
  const credit = useTranslationCredit();
  const data = getAqeedahData();
  const pillars = getAqeedahPillars();
  const pick = <T = string,>(obj: object | undefined, field: string) => pickLocalized<T>(obj, field, locale);
  const number = new Intl.NumberFormat(locale);

  return (
    <LessonContent
      nav={nav}
      title={pick(data, "title") ?? data.title_en}
      titleAr={locale === "ar" ? undefined : data.title_ar}
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

      <section className="border-t border-rule">
        {pillars.map((pillar, index) => {
          const hadithText = pillar.hadith_reference ? pick(pillar.hadith_reference, "text") : undefined;
          return (
            <details key={pillar.id} open={index === 0} className="group border-b border-rule">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="oldstyle w-6 shrink-0 text-body text-ink-2">
                  {number.format(pillar.order)}
                </span>
                <span className="flex-1">
                  <span className="block font-prose text-subsection font-semibold text-ink">
                    {pick(pillar, "title") ?? pillar.title_en}
                  </span>
                  {locale !== "ar" && (
                    <span lang="ar" dir="rtl" className="font-quran text-arabic text-ink-2">
                      {pillar.title_ar}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-ink-2 transition-transform duration-150 group-open:rotate-180"
                />
              </summary>

              <div className="space-y-6 pb-8 ps-10">
                <p className="text-body text-ink">{pick(pillar, "description") ?? pillar.description_en}</p>

                <div>
                  <h3 className="font-ui text-ui font-semibold text-ink">{t("keyPoints")}</h3>
                  <ul className="mt-2 list-disc space-y-1.5 ps-5 text-body text-ink marker:text-ink-2">
                    {(pick<string[]>(pillar, "key_points") ?? pillar.key_points).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                {pillar.quran_references.map((ref) => (
                  <QuranVerse
                    key={ref.reference}
                    reference={ref.reference}
                    arabic={ref.arabic}
                    transliteration={ref.transliteration}
                    translation={pick(ref, "translation") ?? ref.translation}
                    credit={credit(ref.translation_provenance)}
                  />
                ))}

                {pillar.hadith_reference && hadithText && (
                  <HadithBlock
                    text={hadithText}
                    reference={pillar.hadith_reference.reference}
                    grade={pillar.hadith_reference.grade}
                    provenance={pillar.hadith_reference.translation_provenance}
                  />
                )}
              </div>
            </details>
          );
        })}
      </section>
    </LessonContent>
  );
}
