"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

interface MemorizationVerse {
  verse: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

// Reading the Arabic first and checking against the Latin afterwards. Arabic
// readers have no use for it, so the page leaves it out on `/ar`.
export function MemorizationHelper({ verses }: { verses: MemorizationVerse[] }) {
  const t = useTranslations("lesson");
  const headingId = useId();
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const toggles = [
    { label: t("transliteration"), on: showTransliteration, set: setShowTransliteration },
    { label: t("translation"), on: showTranslation, set: setShowTranslation },
  ];

  return (
    <section aria-labelledby={headingId} className="rounded-panel border border-rule px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h3 id={headingId} className="font-prose text-subsection font-semibold text-ink">
          {t("memorizationTitle")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {toggles.map(({ label, on, set }) => (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => set(!on)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-control border px-3 font-ui text-ui transition-colors duration-150 ${
                on ? "border-fajr bg-fajr text-paper" : "border-fajr text-fajr hover:bg-fajr/10"
              }`}
            >
              {on ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 font-ui text-caption text-ink-2">{t("memorizationHelper")}</p>

      <ol className="mt-5 space-y-4">
        {verses.map((verse) => (
          <li key={verse.verse} className="space-y-1 border-b border-rule pb-4 last:border-0 last:pb-0">
            <p lang="ar" dir="rtl" className="font-quran text-quran-sm text-ink sm:text-quran">
              {verse.arabic}
            </p>
            {showTransliteration && <p className="translit text-small">{verse.transliteration}</p>}
            {showTranslation && <p className="text-small text-ink">{verse.translation}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
