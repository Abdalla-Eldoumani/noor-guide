"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getGlossaryTerms, getArabicPhrases } from "@/lib/content";
import { useLocalizedContent } from "@/lib/content-i18n";
import { ArabicText } from "@/components/ui/ArabicText";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("glossary");
  const tCrumb = useTranslations("breadcrumb");
  const pick = useLocalizedContent();
  const locale = useLocale();

  // An Arabic reader already sees the phrase in Arabic, so the Latin
  // transliteration and the English back-translation add nothing.
  const showLatinAids = locale !== "ar";

  const allTerms = getGlossaryTerms();
  const allPhrases = getArabicPhrases();

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return allTerms;
    const q = searchQuery.toLowerCase();
    return allTerms.filter(
      (term) =>
        term.term_en.toLowerCase().includes(q) ||
        term.term_ar.includes(searchQuery) ||
        String(pick(term, "definition") ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [searchQuery, allTerms, pick]);

  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return allPhrases;
    const q = searchQuery.toLowerCase();
    return allPhrases.filter(
      (phrase) =>
        phrase.transliteration.toLowerCase().includes(q) ||
        phrase.phrase_ar.includes(searchQuery) ||
        phrase.translation.toLowerCase().includes(q) ||
        String(pick(phrase, "usage") ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [searchQuery, allPhrases, pick]);

  return (
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: tCrumb("home"), href: "/" },
          { label: tCrumb("learn"), href: "/learn" },
          { label: tCrumb("glossary") },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          {t("title")}
        </h1>
        {locale !== "ar" && (
          <p
            className="mt-2 font-arabic text-arabic-sm text-muted dark:text-gray-400"
            dir="rtl"
            lang="ar"
          >
            مصطلحات إسلامية
          </p>
        )}
        <p className="mt-3 text-muted dark:text-gray-400">{t("subtitle")}</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 ps-12 pe-4 text-ink placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 font-heading text-xl font-bold text-ink dark:text-gray-100">
          {t("termsHeading", { count: filteredTerms.length })}
        </h2>
        {filteredTerms.length === 0 ? (
          <p className="py-8 text-center text-muted dark:text-gray-400">
            {t("noTermsMatch")}
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
                    {pick(term, "term")}
                  </h3>
                  {locale !== "ar" && (
                    <ArabicText className="text-arabic-sm shrink-0 text-primary-500">
                      {term.term_ar}
                    </ArabicText>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted dark:text-gray-400">
                  {pick(term, "definition")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <hr className="mb-12 border-gray-200 dark:border-gray-700" />

      <section>
        <h2 className="mb-6 font-heading text-xl font-bold text-ink dark:text-gray-100">
          {t("phrasesHeading", { count: filteredPhrases.length })}
        </h2>
        {filteredPhrases.length === 0 ? (
          <p className="py-8 text-center text-muted dark:text-gray-400">
            {t("noPhrasesMatch")}
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
                {showLatinAids && (
                  <>
                    <p
                      className="font-mono text-sm italic text-ink dark:text-gray-200"
                      dir="ltr"
                      lang="en"
                    >
                      {phrase.transliteration}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink dark:text-gray-100">
                      {pick(phrase, "translation")}
                    </p>
                  </>
                )}
                <p className="mt-2 text-xs text-muted dark:text-gray-400">
                  {pick(phrase, "usage")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
