import { getTranslations } from "next-intl/server";
import { getLearningModules } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { LearnDashboardClient } from "./LearnDashboardClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noorguide.app";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "learn" });
  return { title: t("dashboardTitle"), description: t("dashboardIntro") };
}

export default async function LearnPage({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "learn" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const modules = getLearningModules();
  const localePath = locale === "en" ? "" : `/${locale}`;

  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: t("dashboardTitle"),
    description: t("dashboardIntro"),
    inLanguage: locale,
    provider: {
      "@type": "Organization",
      name: tSite("name"),
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT3H",
    },
    hasPart: modules.map((mod) => ({
      "@type": "LearningResource",
      name: pickLocalized<string>(mod, "title", locale),
      description: pickLocalized<string>(mod, "description", locale),
      url: `${SITE_URL}${localePath}/learn/${mod.id}`,
      timeRequired: `PT${mod.estimatedMinutes}M`,
      learningResourceType: "Lesson",
      inLanguage: locale,
    })),
  };

  return (
    <PageWrapper>
      <JsonLd data={courseLd} />
      <LearnDashboardClient modules={modules} />
    </PageWrapper>
  );
}
