"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

const NAV = [
  { href: "/learn", key: "learn" },
  { href: "/tools", key: "tools" },
  { href: "/progress", key: "progress" },
] as const;

// A running head rather than an app bar. On phones the bottom bar carries the
// navigation, so only the name and the language choice sit up here.
export default function Header() {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const tLandmarks = useTranslations("landmarks");
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="mx-auto w-full max-w-book px-5 sm:px-8">
      <div className="flex min-h-16 items-center justify-between gap-4 border-b border-rule py-2">
        <Link
          href="/"
          className={`inline-flex min-h-11 items-center gap-2 text-ink ${
            locale === "ar" ? "font-quran text-section" : "font-prose text-subsection font-semibold"
          }`}
        >
          {tSite("name")}
          {locale !== "ar" && (
            <span lang="ar" dir="rtl" className="font-quran text-arabic font-normal text-ink-2">
              نور
            </span>
          )}
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label={tLandmarks("mainNav")} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center px-3 font-ui text-ui transition-colors duration-150 ${
                        active
                          ? "text-ink underline decoration-ochre decoration-2 underline-offset-[10px]"
                          : "text-ink-2 hover:text-ink"
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
