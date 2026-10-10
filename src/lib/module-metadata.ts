import type { Metadata } from "next";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { absoluteUrl } from "@/lib/site";

// Module titles and descriptions are already translated in learning-path.json,
// so page metadata reads them rather than duplicating the strings in messages.
// The site name is appended by the title template in the locale layout and must
// not be repeated here.
export function moduleMetadata(moduleId: string, locale: string): Metadata {
  const moduleData = getModuleById(moduleId);
  const title = pickLocalized<string>(moduleData, "title", locale);
  const description = pickLocalized<string>(moduleData, "description", locale);

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    // Absolute and unprefixed for the default locale. A relative "./" resolves
    // to the internal /en path, which redirects.
    alternates: { canonical: absoluteUrl(locale, `/learn/${moduleId}`) },
  };
}
