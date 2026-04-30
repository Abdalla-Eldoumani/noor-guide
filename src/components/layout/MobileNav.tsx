"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, BookOpen, Wrench, BarChart3 } from "lucide-react";

export default function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/learn", label: t("learn"), icon: BookOpen },
    { href: "/tools", label: t("tools"), icon: Wrench },
    { href: "/progress", label: t("progress"), icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface dark:bg-gray-900 dark:border-gray-800 border-t border-gray-100 md:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 min-w-[3rem] min-h-[3rem] rounded-lg transition-colors ${
                active
                  ? "text-primary-500 dark:text-primary-300"
                  : "text-muted hover:text-ink dark:text-gray-400 dark:hover:text-gray-100"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
