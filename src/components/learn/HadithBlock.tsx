import { useLocale, useTranslations } from "next-intl";
import { SourceReference } from "@/components/ui/SourceReference";
import { useTranslationCredit } from "@/lib/content-i18n";
import type { Provenance } from "@/types/content";

interface HadithBlockProps {
  text: string;
  reference: string;
  grade?: string;
  provenance?: Provenance;
}

// On `/ar` the text prop holds an English or French rendering unless the
// content carries Arabic, and an Arabic reader gains nothing from a
// back-translation, so only the reference is shown.
const ARABIC = /[؀-ۿ]/;

export function HadithBlock({ text, reference, grade, provenance }: HadithBlockProps) {
  const locale = useLocale();
  const t = useTranslations("sources");
  const credit = useTranslationCredit()(provenance);
  const showText = locale !== "ar" || ARABIC.test(text);

  return (
    <figure className="space-y-2 border-s border-rule ps-5">
      {showText && <blockquote className="text-body text-ink">{text}</blockquote>}
      <figcaption className="flex flex-wrap items-baseline gap-x-2 font-ui text-caption text-ink-2">
        <SourceReference type="hadith" reference={reference} />
        {grade && grade !== "n/a" && (
          <>
            <span aria-hidden="true">·</span>
            <span>{t(`grades.${grade}`)}</span>
          </>
        )}
        {credit && (
          <>
            <span aria-hidden="true">·</span>
            <span>{credit}</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
