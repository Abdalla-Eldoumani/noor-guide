import { getSurahsData, getSurahs, getLessonIdsForModule } from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { SurahsClient } from "./SurahsClient";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return moduleMetadata("surahs", locale);
}

export default async function SurahsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("surahs");
  const data = getSurahsData();
  const surahs = getSurahs();
  const lessonIds = getLessonIdsForModule("surahs");

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
      <SurahsClient data={data} surahs={surahs} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
