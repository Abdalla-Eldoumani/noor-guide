import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TOOL_GLYPHS } from "@/components/ui/Glyphs";

const TOOLS = [
  { href: "/tools/prayer-times", key: "prayerTimes" },
  { href: "/tools/qibla", key: "qibla" },
  { href: "/tools/masjid-finder", key: "masjidFinder" },
] as const;

export function ToolRows() {
  const t = useTranslations("tools");

  return (
    <ul className="border-y border-rule">
      {TOOLS.map((tool) => {
        const Glyph = TOOL_GLYPHS[tool.key];
        return (
          <li key={tool.href} className="border-b border-rule last:border-b-0">
            <Link
              href={tool.href}
              className="group -mx-3 grid grid-cols-[2rem_1fr] gap-x-3 rounded-control px-3 py-4 transition-colors duration-150 hover:bg-wash"
            >
              <Glyph size={24} className="mt-1 text-ink-2 group-hover:text-fajr" />
              <span>
                <span className="block text-body text-ink group-hover:text-fajr">{t(`${tool.key}Title`)}</span>
                <span className="block font-ui text-ui text-ink-2">{t(`${tool.key}Body`)}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
