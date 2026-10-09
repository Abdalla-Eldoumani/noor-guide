"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, BookOpen, Compass, ListChecks } from "lucide-react";

const ITEMS = [
  { href: "/", key: "home", icon: Home },
  { href: "/learn", key: "learn", icon: BookOpen },
  { href: "/tools", key: "tools", icon: Compass },
  { href: "/progress", key: "progress", icon: ListChecks },
] as const;

export default function MobileNav() {
  const t = useTranslations("nav");
  const tLandmarks = useTranslations("landmarks");
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label={tLandmarks("bottomNav")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-book items-stretch justify-around px-2">
        {ITEMS.map(({ href, key, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 font-ui text-micro ${
                  active ? "text-fajr" : "text-ink-2"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                <span className={active ? "font-semibold" : undefined}>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
