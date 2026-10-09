import { useLocale } from "next-intl";
import { pickLocalized } from "@/lib/content-i18n";
import { SourceReference } from "@/components/ui/SourceReference";
import type { RulingItem } from "@/types/content";

// A ruling rests on the Qur'an, on a named narration, or on consensus where no
// single narration carries it; consensus is labelled as such.
function sourceType(source: string): "quran" | "hadith" | "scholarly_consensus" {
  if (source.startsWith("Quran")) return "quran";
  if (source === "Scholarly consensus") return "scholarly_consensus";
  return "hadith";
}

export function RulingList({ heading, items }: { heading: string; items: RulingItem[] }) {
  const locale = useLocale();
  const number = new Intl.NumberFormat(locale);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="font-prose text-section font-semibold text-ink">{heading}</h2>
      <ol className="mt-5 space-y-5">
        {items.map((item, index) => {
          const note = pickLocalized<string>(item, "note", locale);
          return (
            <li key={item.id} className="grid grid-cols-[2rem_1fr] gap-x-2">
              <span aria-hidden="true" className="oldstyle text-body text-ink-2">
                {number.format(index + 1)}
              </span>
              <div className="space-y-1.5">
                <p className="text-body text-ink">{pickLocalized<string>(item, "description", locale)}</p>
                {note && <p className="text-small text-ink-2">{note}</p>}
                {item.source && (
                  <SourceReference type={sourceType(item.source)} reference={item.source} />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
