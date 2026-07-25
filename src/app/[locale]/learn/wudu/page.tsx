import {
  getWuduData,
  getWuduSteps,
  getWuduBreakers,
  getLessonIdsForModule,
} from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { WuduClient } from "./WuduClient";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return moduleMetadata("wudu", locale);
}

export default async function WuduPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const module = getModuleById("wudu");
  const data = getWuduData();
  const steps = getWuduSteps();
  const breakers = getWuduBreakers();
  const lessonIds = getLessonIdsForModule("wudu");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "wudu",
          title: pickLocalized<string>(module, "title", locale) ?? "",
          description: pickLocalized<string>(module, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <WuduClient data={data} steps={steps} breakers={breakers} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
