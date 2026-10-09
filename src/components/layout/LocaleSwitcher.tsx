"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

// next-intl remembers the choice in its own cookie, so switching is only a
// route change.
export function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative inline-flex items-center">
      <select
        aria-label={t("language")}
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value as Locale })}
        className="min-h-11 cursor-pointer appearance-none rounded-control bg-transparent py-2 pe-7 ps-2 font-ui text-ui text-ink hover:text-fajr"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {LABELS[l]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute end-1.5 text-ink-2"
      />
    </div>
  );
}
