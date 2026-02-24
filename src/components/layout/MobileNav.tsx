"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Wrench, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-gray-100 md:hidden"
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
                  ? "text-primary-500"
                  : "text-muted hover:text-ink"
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
