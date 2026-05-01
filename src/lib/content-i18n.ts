import { useLocale } from "next-intl";

// Reads a field from a content object that may have `_en`, `_ar`, etc.
// siblings, returning the locale-specific value when present and falling back
// to English otherwise. The convention covers two field-naming styles in the
// content JSON:
//   1. Suffixed: title_en + title_ar  -> picks `title_${locale}` then `title_en`
//   2. Bare-named: key_points + key_points_ar -> picks `key_points_${locale}` then `key_points`
// When neither is available, returns undefined so callers can decide how to
// surface the gap (typically `?? ""`).
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

// Client-side hook variant. Returns a `pick(obj, field)` function bound to the
// active locale. Use inside any `"use client"` component within
// `NextIntlClientProvider`.
export function useLocalizedContent() {
  const locale = useLocale();
  return <T = string>(
    obj: object | null | undefined,
    field: string,
  ): T | undefined => pickLocalized<T>(obj, field, locale);
}
