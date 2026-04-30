import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noorguide.app";

const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "monthly", priority: 1.0 },
  { path: "/learn", changeFrequency: "monthly", priority: 0.9 },
  { path: "/learn/aqeedah", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/pillars", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/wudu", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/salah", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/surahs", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/duas", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/glossary", changeFrequency: "yearly", priority: 0.7 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools/prayer-times", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools/qibla", changeFrequency: "yearly", priority: 0.6 },
  { path: "/tools/masjid-finder", changeFrequency: "yearly", priority: 0.6 },
  { path: "/progress", changeFrequency: "monthly", priority: 0.5 },
];

// One entry per English (default-locale) URL. The `alternates.languages` block
// declares the Arabic counterpart so search engines can pick the right locale.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => {
    const enUrl = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
    const arUrl = path === "/" ? `${SITE_URL}/ar` : `${SITE_URL}/ar${path}`;
    return {
      url: enUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: enUrl,
          ar: arUrl,
          "x-default": enUrl,
        },
      },
    };
  });
}
