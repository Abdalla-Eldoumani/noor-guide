import { useLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDuasData, getDuaCategories, getModuleById, getModuleNav, type ModuleNav } from "@/lib/content";
import { pickLocalized, useTranslationCredit } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { LessonContent } from "@/components/learn/LessonContent";
import { BookmarkToggle } from "@/components/learn/BookmarkToggle";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("duas", locale);
}

export default async function DuasPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("duas");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "duas",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <DuasLesson nav={getModuleNav("duas", locale)} />
    </PageWrapper>
  );
}

function DuasLesson({ nav }: { nav: ModuleNav }) {
  const locale = useLocale();
  const credit = useTranslationCredit();
  const data = getDuasData();
  const pick = (obj: object | undefined, field: string) => pickLocalized<string>(obj, field, locale);

  return (
    <LessonContent
      nav={nav}
      title={pick(data, "title") ?? data.title_en}
      titleAr={locale === "ar" ? undefined : data.title_ar}
    >
      <p className="text-body text-ink">{pick(data.introduction, "content")}</p>

      {getDuaCategories().map((category) => (
        <section key={category.id} className="space-y-5">
          <h2 className="font-prose text-section font-semibold text-ink">
            {pick(category, "title") ?? category.title_en}
          </h2>
          {category.duas.map((dua) => {
            const context = pick(dua, "context");
            const notes = pick(dua, "notes");
            return (
              <RecitationBlockquote key={dua.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="pt-2.5 font-ui text-caption text-ink-2">{context}</p>
                  <BookmarkToggle id={dua.id} />
                </div>
                <ArabicText
                  arabic={dua.arabic}
                  transliteration={dua.transliteration}
                  translation={pick(dua, "translation") ?? dua.translation}
                  credit={credit(dua.translation_provenance)}
                />
                {notes && <p className="text-small text-ink-2">{notes}</p>}
                <SourceReference
                  type={dua.source.reference.startsWith("Quran") ? "quran" : "hadith"}
                  reference={dua.source.reference}
                />
              </RecitationBlockquote>
            );
          })}
        </section>
      ))}
    </LessonContent>
  );
}
