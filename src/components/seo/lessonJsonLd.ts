// Returns a JSON-LD payload describing a single lesson page as a
// schema.org LearningResource that is part of the Noor Guide Course.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noorguide.app";

export type LessonLdInput = {
  id: string;
  title: string;
  description: string;
  locale: string;
  courseName: string;
  estimatedMinutes?: number;
};

export function lessonJsonLd({
  id,
  title,
  description,
  locale,
  courseName,
  estimatedMinutes,
}: LessonLdInput): Record<string, unknown> {
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    url: `${SITE_URL}${localePath}/learn/${id}`,
    inLanguage: locale,
    learningResourceType: "Lesson",
    educationalUse: "instruction",
    ...(estimatedMinutes ? { timeRequired: `PT${estimatedMinutes}M` } : {}),
    isPartOf: {
      "@type": "Course",
      name: courseName,
      url: `${SITE_URL}${localePath}/learn`,
    },
  };
}
