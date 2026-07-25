import type { Metadata } from "next";
import { getModuleById } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";

// Module titles and descriptions are already translated in learning-path.json,
// so page metadata reads them rather than duplicating the strings in messages.
// The site name is appended by the title template in the locale layout and must
// not be repeated here.
export function moduleMetadata(moduleId: string, locale: string): Metadata {
  const module = getModuleById(moduleId);
  const title = pickLocalized<string>(module, "title", locale);
  const description = pickLocalized<string>(module, "description", locale);

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}
