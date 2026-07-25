"use client";

import { useLocale, useTranslations } from "next-intl";
import { SourceReference } from "@/components/ui/SourceReference";

interface HadithBlockProps {
  text: string;
  reference: string;
  grade?: string;
}

// On the Arabic locale, the `text` prop holds the English translation of the
// hadith. An Arabic reader does not benefit from a back-translation, so when
// the supplied text contains no Arabic characters we hide the quoted text and
// render only the source reference.
const ARABIC_RE = /[؀-ۿ]/;

export function HadithBlock({ text, reference, grade }: HadithBlockProps) {
  const locale = useLocale();
  const t = useTranslations("sources");
  const showText = locale !== "ar" || ARABIC_RE.test(text);

  return (
    <div className="border-s-4 border-accent-400 bg-accent-50/50 dark:bg-accent-400/10 rounded-e-xl p-5 space-y-3">
      {showText && (
        <p className="text-ink dark:text-gray-100 italic leading-relaxed">
          &ldquo;{text}&rdquo;
        </p>
      )}
      <div className="flex items-center gap-3">
        <SourceReference type="hadith" reference={reference} />
        {grade && grade !== "n/a" && (
          <span className="text-xs text-muted dark:text-gray-400">
            ({t(`grades.${grade}`)})
          </span>
        )}
      </div>
    </div>
  );
}
