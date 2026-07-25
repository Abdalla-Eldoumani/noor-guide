"use client";

import { useLocale } from "next-intl";
import { pickLocalized } from "@/lib/content-i18n";
import { SourceReference } from "@/components/ui/SourceReference";
import type { RulingItem } from "@/types/content";

interface RulingListProps {
  heading: string;
  items: RulingItem[];
  /** Obligatory acts get the emphasised treatment; recommended acts sit quieter. */
  emphasis?: "required" | "recommended";
}

// A ruling can rest on the Quran, on a named narration, or on consensus where
// no single narration carries it. Consensus is labelled as such rather than
// dressed up as a hadith citation.
function sourceType(source: string): "quran" | "hadith" | "scholarly_consensus" {
  if (source.startsWith("Quran")) return "quran";
  if (source === "Scholarly consensus") return "scholarly_consensus";
  return "hadith";
}

const TONE = {
  required: "border-s-primary-500 bg-primary-50/60 dark:bg-primary-500/10",
  recommended: "border-s-accent-400 bg-accent-50/50 dark:bg-accent-400/10",
} as const;

export function RulingList({ heading, items, emphasis = "required" }: RulingListProps) {
  const locale = useLocale();

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
        {heading}
      </h3>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`rounded-e-xl border-s-4 p-4 ${TONE[emphasis]}`}
          >
            <div className="flex gap-3">
              <span className="font-heading text-sm font-bold text-primary-500 tabular-nums">
                {index + 1}
              </span>
              <div className="space-y-2">
                <p className="text-ink dark:text-gray-100">
                  {pickLocalized<string>(item, "description", locale)}
                </p>
                {pickLocalized<string>(item, "note", locale) && (
                  <p className="text-sm text-muted dark:text-gray-400">
                    {pickLocalized<string>(item, "note", locale)}
                  </p>
                )}
                {item.source && (
                  <SourceReference
                    type={sourceType(item.source)}
                    reference={item.source}
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default RulingList;
