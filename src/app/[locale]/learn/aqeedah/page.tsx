import { getAqeedahData, getAqeedahPillars, getLessonIdsForModule } from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { AqeedahClient } from "./AqeedahClient";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return moduleMetadata("aqeedah", locale);
}

export default async function AqeedahPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("aqeedah");
  const data = getAqeedahData();
  const pillars = getAqeedahPillars();
  const lessonIds = getLessonIdsForModule("aqeedah");

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
      <AqeedahClient data={data} pillars={pillars} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
