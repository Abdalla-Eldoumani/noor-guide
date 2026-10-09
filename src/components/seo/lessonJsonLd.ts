import { absoluteUrl } from "@/lib/site";

// A lesson page as a schema.org LearningResource inside the course.
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
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    url: absoluteUrl(locale, `/learn/${id}`),
    inLanguage: locale,
    learningResourceType: "Lesson",
    educationalUse: "instruction",
    ...(estimatedMinutes ? { timeRequired: `PT${estimatedMinutes}M` } : {}),
    isPartOf: {
      "@type": "Course",
      name: courseName,
      url: absoluteUrl(locale, "/learn"),
    },
  };
}
