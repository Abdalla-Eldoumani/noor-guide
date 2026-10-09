import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPillarsData, getIslamPillars, getModuleById, getModuleNav, type ModuleNav } from "@/lib/content";
import { pickLocalized, useTranslationCredit } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("pillars", locale);
}

export default async function PillarsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("pillars");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "pillars",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <PillarsLesson nav={getModuleNav("pillars", locale)} />
    </PageWrapper>
  );
}

function PillarsLesson({ nav }: { nav: ModuleNav }) {
  const locale = useLocale();
  const t = useTranslations("pillars");
  const credit = useTranslationCredit();
  const data = getPillarsData();
  const pillars = getIslamPillars();
  const pick = (obj: object | undefined, field: string) => pickLocalized<string>(obj, field, locale);
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

      <ol className="space-y-12">
        {pillars.map((pillar) => {
          const notes = pick(pillar, "notes");
          const translation = pillar.content ? pick(pillar.content, "translation") : undefined;
          return (
            <li key={pillar.id} className="grid grid-cols-[2rem_1fr] gap-x-3">
              <span aria-hidden="true" className="oldstyle pt-0.5 font-prose text-section text-ink-2">
                {number.format(pillar.order)}
              </span>
              <div className="space-y-4">
                <h2 className="flex flex-wrap items-baseline gap-x-3 font-prose text-section font-semibold text-ink">
                  <span>{pick(pillar, "title") ?? pillar.title_en}</span>
                  {locale !== "ar" && (
                    <span lang="ar" dir="rtl" className="font-quran text-arabic font-normal text-ink-2">
                      {pillar.title_ar}
                    </span>
                  )}
                </h2>
                <p className="text-body text-ink">{pick(pillar, "description") ?? pillar.description_en}</p>

                {pillar.content && translation && (
                  <RecitationBlockquote>
                    <ArabicText
                      arabic={pillar.content.arabic}
                      transliteration={pillar.content.transliteration}
                      translation={translation}
                      credit={credit(pillar.content.translation_provenance)}
                    />
                  </RecitationBlockquote>
                )}

                {pillar.quran_reference && (
                  <SourceReference type="quran" reference={pillar.quran_reference.reference} />
                )}

                {notes && <p className="text-small text-ink-2">{notes}</p>}

                {pillar.link_to_module && (
                  <p>
                    <Link href={pillar.link_to_module} className="text-link font-ui text-ui">
                      {t("learnMore")}
                      <span aria-hidden="true" className="ms-1 inline-block rtl:-scale-x-100">
                        →
                      </span>
                    </Link>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </LessonContent>
  );
}
