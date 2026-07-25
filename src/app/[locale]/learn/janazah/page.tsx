import { getTranslations } from "next-intl/server";
import { getJanazahData, getLessonIdsForModule, getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { SectionedLesson } from "@/components/learn/SectionedLesson";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("janazah", locale);
}

export default async function JanazahPage({ params }: Params) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const data = getJanazahData();
  const lessonIds = getLessonIdsForModule("janazah");
  const moduleData = getModuleById("janazah");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "janazah",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <SectionedLesson
        data={data}
        lessonIds={lessonIds}
      prevHref="/learn/prayer-practice"
      prevModuleId="prayer-practice"
      />
    </PageWrapper>
  );
}
