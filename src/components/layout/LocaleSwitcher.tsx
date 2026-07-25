"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

const SETTINGS_KEY = "noor-settings";

export function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (next: Locale) => {
    if (next === locale) return;

    // Persist the choice so future visits land on the right locale.
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(SETTINGS_KEY);
        const settings = raw ? JSON.parse(raw) : {};
        settings.language = next;
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        // localStorage unavailable; the route swap below still applies.
      }
    }

    router.replace(pathname, { locale: next });
  };

  return (
    <label className="relative inline-flex items-center gap-1 text-sm text-muted dark:text-gray-400">
      <Languages size={16} className="pointer-events-none" aria-hidden="true" />
      <span className="sr-only">{t("language")}</span>
      <select
        aria-label={t("language")}
        value={locale}
        onChange={(e) => handleChange(e.target.value as Locale)}
        className="appearance-none bg-transparent pe-2 ps-1 py-1.5 rounded-md font-medium text-ink dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {LABELS[l as Locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
