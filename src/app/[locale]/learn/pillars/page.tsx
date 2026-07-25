import { getPillarsData, getIslamPillars, getLessonIdsForModule } from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { PillarsClient } from "./PillarsClient";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return moduleMetadata("pillars", locale);
}

export default async function PillarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const module = getModuleById("pillars");
  const data = getPillarsData();
  const pillars = getIslamPillars();
  const lessonIds = getLessonIdsForModule("pillars");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "pillars",
          title: pickLocalized<string>(module, "title", locale) ?? "",
          description: pickLocalized<string>(module, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <PillarsClient data={data} pillars={pillars} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
