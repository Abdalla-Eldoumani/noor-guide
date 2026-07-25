import { getTranslations } from "next-intl/server";
import { getTaharahData, getLessonIdsForModule, getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { SectionedLesson } from "@/components/learn/SectionedLesson";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("taharah", locale);
}

export default async function TaharahPage({ params }: Params) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const data = getTaharahData();
  const lessonIds = getLessonIdsForModule("taharah");
  const moduleData = getModuleById("taharah");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "taharah",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <SectionedLesson
        data={data}
        lessonIds={lessonIds}
      prevHref="/learn/duas"
      prevModuleId="duas"
      nextHref="/learn/prayer-practice"
      nextModuleId="prayer-practice"
      />
    </PageWrapper>
  );
}
