"use client";

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
  obj: Record<string, unknown> | null | undefined,
  field: string,
  locale: string,
): T | undefined {
  if (!obj) return undefined;
  if (locale !== "en") {
    const localized = obj[`${field}_${locale}`];
    if (localized != null) return localized as T;
  }
  const bare = obj[field];
  if (bare != null) return bare as T;
  const enSuffix = obj[`${field}_en`];
  if (enSuffix != null) return enSuffix as T;
  return undefined;
}

// Client-side hook variant. Returns a `pick(obj, field)` function bound to the
// active locale. Use inside any `"use client"` component within
// `NextIntlClientProvider`.
export function useLocalizedContent() {
  const locale = useLocale();
  return <T = string>(
    obj: Record<string, unknown> | null | undefined,
    field: string,
  ): T | undefined => pickLocalized<T>(obj, field, locale);
}
