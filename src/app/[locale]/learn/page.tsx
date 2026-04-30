import { getLearningModules } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { LearnDashboardClient } from "./LearnDashboardClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noorguide.app";

export const metadata = {
  title: "Learning Path | Noor Guide",
  description:
    "A step-by-step learning path for new Muslims covering beliefs, prayer, Quran, and daily life.",
};

export default function LearnPage() {
  const modules = getLearningModules();

  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Noor Guide Learning Path",
    description:
      "A step-by-step path for new Muslims covering Islamic beliefs, the Five Pillars, ablution, prayer, essential surahs, and daily supplications.",
    provider: {
      "@type": "Organization",
      name: "Noor Guide",
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT3H",
    },
    hasPart: modules.map((mod) => ({
      "@type": "LearningResource",
      name: mod.title_en,
      description: mod.description_en,
      url: `${SITE_URL}/learn/${mod.id}`,
      timeRequired: `PT${mod.estimatedMinutes}M`,
      learningResourceType: "Lesson",
      inLanguage: "en",
    })),
  };

  return (
    <PageWrapper>
      <JsonLd data={courseLd} />
      <LearnDashboardClient modules={modules} />
    </PageWrapper>
  );
}
