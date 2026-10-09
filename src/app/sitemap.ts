import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

type Frequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const ROUTES: { path: string; changeFrequency: Frequency; priority: number }[] = [
  { path: "/", changeFrequency: "monthly", priority: 1.0 },
  { path: "/learn", changeFrequency: "monthly", priority: 0.9 },
  { path: "/learn/aqeedah", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/pillars", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/wudu", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/salah", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/surahs", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/duas", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/taharah", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/prayer-practice", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/janazah", changeFrequency: "yearly", priority: 0.8 },
  { path: "/learn/glossary", changeFrequency: "yearly", priority: 0.7 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools/prayer-times", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools/qibla", changeFrequency: "yearly", priority: 0.6 },
  { path: "/tools/masjid-finder", changeFrequency: "yearly", priority: 0.6 },
  { path: "/progress", changeFrequency: "monthly", priority: 0.5 },
];

// One entry per default-locale URL; the other locales are declared as
// alternates so search engines can serve the right one.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => {
    const url = absoluteUrl(routing.defaultLocale, path);
    const languages: Record<string, string> = { "x-default": url };
    for (const locale of routing.locales) languages[locale] = absoluteUrl(locale, path);
    return { url, lastModified: now, changeFrequency, priority, alternates: { languages } };
  });
}
