// Returns a JSON-LD payload describing a single lesson page as a
// schema.org LearningResource that is part of the Noor Guide Course.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noorguide.app";

export type LessonLdInput = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes?: number;
};

export function lessonJsonLd({
  id,
  title,
  description,
  estimatedMinutes,
}: LessonLdInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    url: `${SITE_URL}/learn/${id}`,
    inLanguage: "en",
    learningResourceType: "Lesson",
    educationalUse: "instruction",
    ...(estimatedMinutes ? { timeRequired: `PT${estimatedMinutes}M` } : {}),
    isPartOf: {
      "@type": "Course",
      name: "Noor Guide Learning Path",
      url: `${SITE_URL}/learn`,
    },
  };
}
