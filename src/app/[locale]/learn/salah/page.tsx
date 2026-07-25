import { getSalahData, getSalahSteps, getLessonIdsForModule } from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { SalahClient } from "./SalahClient";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return moduleMetadata("salah", locale);
}

export default async function SalahPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("salah");
  const data = getSalahData();
  const steps = getSalahSteps();
  const lessonIds = getLessonIdsForModule("salah");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "salah",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <SalahClient data={data} steps={steps} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
