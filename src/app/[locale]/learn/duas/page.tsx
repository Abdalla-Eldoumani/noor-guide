import { getDuasData, getDuaCategories, getLessonIdsForModule } from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { DuasClient } from "./DuasClient";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return moduleMetadata("duas", locale);
}

export default async function DuasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const module = getModuleById("duas");
  const data = getDuasData();
  const categories = getDuaCategories();
  const lessonIds = getLessonIdsForModule("duas");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "duas",
          title: pickLocalized<string>(module, "title", locale) ?? "",
          description: pickLocalized<string>(module, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <DuasClient data={data} categories={categories} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
