import { routing } from "@/i18n/routing";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://noor-guide-dusky.vercel.app"
).replace(/\/+$/, "");

// The default locale has no prefix (`localePrefix: "as-needed"`).
export function localizedPath(locale: string, path = "/"): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  if (path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

export function absoluteUrl(locale: string, path = "/"): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}
