import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSurahsData, getSurahs, getModuleById, getModuleNav, type ModuleNav } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { LessonContent } from "@/components/learn/LessonContent";
import { SurahPlayer } from "@/components/learn/SurahPlayer";
import { MemorizationHelper } from "@/components/learn/MemorizationHelper";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("surahs", locale);
}

export default async function SurahsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("surahs");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "surahs",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <SurahsLesson nav={getModuleNav("surahs", locale)} />
    </PageWrapper>
  );
}

function SurahsLesson({ nav }: { nav: ModuleNav }) {
  const locale = useLocale();
  const t = useTranslations("surahs");
  const data = getSurahsData();
  const pick = (obj: object | undefined, field: string) => pickLocalized<string>(obj, field, locale);

  return (
    <LessonContent
      nav={nav}
      title={pick(data, "title") ?? data.title_en}
      titleAr={locale === "ar" ? undefined : data.title_ar}
    >
      <section className="space-y-3">
        <p className="text-body text-ink">{pick(data.introduction, "content")}</p>
        {locale !== "ar" && <p className="font-ui text-caption text-ink-2">{t("translationNote")}</p>}
      </section>

      {getSurahs().map((surah, index) => {
        const verses = surah.verses.map((verse) => ({
          verse: verse.verse,
          arabic: verse.arabic,
          transliteration: verse.transliteration,
          translation: pick(verse, "translation") ?? verse.translation,
        }));
        return (
          <section key={surah.id} aria-labelledby={`${surah.id}-title`} className="space-y-6">
            <header className="space-y-1">
              <p className="font-ui text-caption text-ink-2">
                {index === 0 ? `${t("startHere")} · ` : ""}
                {t("surahNumberLabel", { number: surah.number })}
              </p>
              <h2
                id={`${surah.id}-title`}
                className="flex flex-wrap items-baseline gap-x-3 font-prose text-section font-semibold text-ink"
              >
                <span>{pick(surah, "title") ?? surah.title_en}</span>
                {locale !== "ar" && (
                  <span lang="ar" dir="rtl" className="font-quran text-section font-normal text-ink-2">
                    {surah.title_ar}
                  </span>
                )}
              </h2>
              <p className="text-small text-ink-2">{pick(surah, "priority") ?? surah.priority}</p>
            </header>
            <SurahPlayer surahNumber={surah.number} verses={verses} />
            {locale !== "ar" && <MemorizationHelper verses={verses} />}
          </section>
        );
      })}
    </LessonContent>
  );
}
