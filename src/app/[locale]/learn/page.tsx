import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLearningModules, getModuleSummaries } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { absoluteUrl } from "@/lib/site";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { PathContents } from "@/components/learn/PathContents";
import { LearnDashboardClient } from "./LearnDashboardClient";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "learn" });
  return { title: t("dashboardTitle"), description: t("dashboardIntro") };
}

export default async function LearnPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "learn" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const tCrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const modules = getLearningModules();
  const rows = getModuleSummaries(locale);
  const minutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);

  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: t("dashboardTitle"),
    description: t("dashboardIntro"),
    inLanguage: locale,
    provider: { "@type": "Organization", name: tSite("name"), url: absoluteUrl(locale) },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${Math.floor(minutes / 60)}H${minutes % 60}M`,
    },
    hasPart: modules.map((mod) => ({
      "@type": "LearningResource",
      name: pickLocalized<string>(mod, "title", locale),
      description: pickLocalized<string>(mod, "description", locale),
      url: absoluteUrl(locale, `/learn/${mod.id}`),
      timeRequired: `PT${mod.estimatedMinutes}M`,
      learningResourceType: "Lesson",
      inLanguage: locale,
    })),
  };

  return (
    <PageWrapper>
      <JsonLd data={courseLd} />
      <Breadcrumb items={[{ label: tCrumb("home"), href: "/" }, { label: tCrumb("learn") }]} />

      <h1 className="mt-6 font-prose text-title-sm font-semibold text-ink sm:text-title">
        {t("dashboardTitle")}
      </h1>
      <p className="mt-3 max-w-prose text-body text-ink-2">{t("dashboardIntro")}</p>

      <LearnDashboardClient rows={rows} />

      <div className="mt-8">
        <PathContents rows={rows} />
      </div>

      <p className="mt-10 text-body text-ink">
        {t("glossaryLead")}{" "}
        <Link href="/learn/glossary" className="text-link">
          {t("glossaryLink")}
        </Link>
      </p>
    </PageWrapper>
  );
}
