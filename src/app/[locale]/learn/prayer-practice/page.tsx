import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPrayerPracticeData, getModuleById, getModuleNav } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { SectionedLesson } from "@/components/learn/SectionedLesson";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("prayer-practice", locale);
}

export default async function PrayerPracticePage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("prayer-practice");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "prayer-practice",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <SectionedLesson data={getPrayerPracticeData()} nav={getModuleNav("prayer-practice", locale)} />
    </PageWrapper>
  );
}
