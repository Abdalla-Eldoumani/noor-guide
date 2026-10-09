"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface Term {
  id: string;
  term: string;
  termAr: string;
  definition: string;
}

interface Phrase {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  usage: string;
}

// Arabic search text is matched without its vowel marks, so "سلام" finds "سَلَام".
const HARAKAT = /[ً-ٰٟ]/g;
const normalize = (text: string) => text.toLocaleLowerCase().replace(HARAKAT, "");

export function GlossaryClient({ terms, phrases }: { terms: Term[]; phrases: Phrase[] }) {
  const t = useTranslations("glossary");
  const locale = useLocale();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());
  const matches = (...fields: string[]) => !q || fields.some((field) => normalize(field).includes(q));

  const shownTerms = terms.filter((term) => matches(term.term, term.termAr, term.definition));
  const shownPhrases = phrases.filter((p) =>
    matches(p.arabic, p.transliteration, p.translation, p.usage),
  );
  const latin = locale !== "ar";

  return (
    <>
      <div className="mt-8">
        <label htmlFor={searchId} className="block font-ui text-ui text-ink">
          {t("searchLabel")}
        </label>
        <div className="relative mt-2">
          <Search
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-2"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-h-11 w-full rounded-control border border-ink-2 bg-paper py-2 pe-3 ps-10 font-ui text-ui text-ink placeholder:text-ink-2"
          />
        </div>
      </div>

      <section className="mt-12" aria-labelledby="terms-heading">
        <h2 id="terms-heading" className="font-prose text-section font-semibold text-ink">
          {t("termsHeading", { count: shownTerms.length })}
        </h2>
        {shownTerms.length === 0 ? (
          <p className="mt-4 text-body text-ink-2">{t("noTermsMatch")}</p>
        ) : (
          <dl className="mt-4 border-t border-rule">
            {shownTerms.map((term) => (
              <div key={term.id} className="border-b border-rule py-4">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-body font-semibold text-ink">{term.term}</span>
                  {latin && (
                    <span lang="ar" dir="rtl" className="font-quran text-arabic text-ink-2">
                      {term.termAr}
                    </span>
                  )}
                </dt>
                <dd className="mt-1 text-small text-ink">{term.definition}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="mt-14" aria-labelledby="phrases-heading">
        <h2 id="phrases-heading" className="font-prose text-section font-semibold text-ink">
          {t("phrasesHeading", { count: shownPhrases.length })}
        </h2>
        {shownPhrases.length === 0 ? (
          <p className="mt-4 text-body text-ink-2">{t("noPhrasesMatch")}</p>
        ) : (
          <ul className="mt-4 border-t border-rule">
            {shownPhrases.map((phrase) => (
              <li key={phrase.id} className="space-y-1 border-b border-rule py-5">
                <p lang="ar" dir="rtl" className="font-quran text-quran-sm text-ink">
                  {phrase.arabic}
                </p>
                {latin && (
                  <>
                    <p className="translit text-small">
                      {phrase.transliteration}
                    </p>
                    <p className="text-small text-ink">{phrase.translation}</p>
                  </>
                )}
                <p className="font-ui text-caption text-ink-2">{phrase.usage}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
