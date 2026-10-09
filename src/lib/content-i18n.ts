import { useLocale, useTranslations } from "next-intl";
import type { Provenance } from "@/types/content";

// Reads a field that may have locale siblings, falling back to English. Two
// naming styles exist in the content JSON:
//   1. Suffixed: title_en + title_ar picks `title_${locale}`, then `title_en`
//   2. Bare: key_points + key_points_ar picks `key_points_${locale}`, then `key_points`
export function pickLocalized<T = string>(
  obj: object | null | undefined,
  field: string,
  locale: string,
): T | undefined {
  if (!obj) return undefined;
  const record = obj as Record<string, unknown>;
  if (locale !== "en") {
    const localized = record[`${field}_${locale}`];
    if (localized != null) return localized as T;
  }
  const bare = record[field];
  if (bare != null) return bare as T;
  const enSuffix = record[`${field}_en`];
  if (enSuffix != null) return enSuffix as T;
  return undefined;
}

export function useLocalizedContent() {
  const locale = useLocale();
  return <T = string>(obj: object | null | undefined, field: string): T | undefined =>
    pickLocalized<T>(obj, field, locale);
}

// Names where an English or French rendering came from. Every fetched
// rendering in the content is the Qur'an, in Saheeh International or
// Hamidullah; the rest are the project's own. Arabic readers see no rendering.
export function useTranslationCredit() {
  const t = useTranslations("sources");
  const locale = useLocale();
  return (provenance?: Provenance): string | undefined => {
    if (locale === "ar" || !provenance) return undefined;
    return provenance === "fetched" ? t("creditQuran") : t("creditProject");
  };
}
