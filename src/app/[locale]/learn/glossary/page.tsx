"use client";

import { useState, useMemo } from "react";
import { getGlossaryTerms, getArabicPhrases } from "@/lib/content";
import { ArabicText } from "@/components/ui/ArabicText";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const allTerms = getGlossaryTerms();
  const allPhrases = getArabicPhrases();

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return allTerms;
    const q = searchQuery.toLowerCase();
    return allTerms.filter(
      (t) =>
        t.term_en.toLowerCase().includes(q) ||
        t.term_ar.includes(searchQuery) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [searchQuery, allTerms]);

  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return allPhrases;
    const q = searchQuery.toLowerCase();
    return allPhrases.filter(
      (p) =>
        p.transliteration.toLowerCase().includes(q) ||
        p.phrase_ar.includes(searchQuery) ||
        p.translation.toLowerCase().includes(q) ||
        p.usage.toLowerCase().includes(q)
    );
  }, [searchQuery, allPhrases]);

  return (
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: "Glossary" },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          Islamic Glossary
        </h1>
        <p className="mt-2 font-arabic text-arabic-sm text-muted dark:text-gray-400" dir="rtl">
          مصطلحات إسلامية
        </p>
        <p className="mt-3 text-muted dark:text-gray-400">
          Key Islamic terms and everyday Arabic phrases every Muslim should know.
        </p>
      </div>

      {/* Search input */}
      <div className="mb-8">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms and phrases..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-ink placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Glossary terms */}
      <section className="mb-12">
        <h2 className="mb-6 font-heading text-xl font-bold text-ink dark:text-gray-100">
          Islamic Terms ({filteredTerms.length})
        </h2>
        {filteredTerms.length === 0 ? (
          <p className="py-8 text-center text-muted dark:text-gray-400">
            No terms match your search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                className="rounded-2xl border border-gray-200 bg-surface p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
                    {term.term_en}
                  </h3>
                  <ArabicText className="text-arabic-sm shrink-0 text-primary-500">
                    {term.term_ar}
                  </ArabicText>
                </div>
                <p className="text-sm leading-relaxed text-muted dark:text-gray-400">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <hr className="mb-12 border-gray-200 dark:border-gray-700" />

      {/* Arabic phrases */}
      <section>
        <h2 className="mb-6 font-heading text-xl font-bold text-ink dark:text-gray-100">
          Essential Arabic Phrases ({filteredPhrases.length})
        </h2>
        {filteredPhrases.length === 0 ? (
          <p className="py-8 text-center text-muted dark:text-gray-400">
            No phrases match your search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="rounded-2xl border border-gray-200 bg-surface p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <ArabicText className="mb-3 text-arabic-base text-primary-600 dark:text-primary-400">
                  {phrase.phrase_ar}
                </ArabicText>
                <p className="font-mono text-sm italic text-ink dark:text-gray-200">
                  {phrase.transliteration}
                </p>
                <p className="mt-1 text-sm font-medium text-ink dark:text-gray-100">
                  {phrase.translation}
                </p>
                <p className="mt-2 text-xs text-muted dark:text-gray-400">
                  {phrase.usage}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
