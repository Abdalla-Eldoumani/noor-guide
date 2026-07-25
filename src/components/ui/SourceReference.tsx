"use client";

import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";

interface SourceReferenceProps {
  type: "quran" | "hadith" | "scholarly_consensus";
  reference: string;
  className?: string;
}

// Content stores references as an English collection name followed by a
// locator, for example "Sahih Bukhari 6312" or "Quran 5:6". Splitting the two
// lets the collection name be translated while the locator stays a numeral.
const COLLECTION_SLUGS: Record<string, string> = {
  "sahih bukhari": "bukhari",
  "sahih al-bukhari": "bukhari",
  "sahih muslim": "muslim",
  "sunan abu dawud": "abudawud",
  quran: "quran",
};

function splitReference(reference: string): { slug?: string; locator: string } {
  const match = reference.match(/^(.*?)\s*(\d[\w:.-]*)$/);
  if (!match) return { locator: reference };
  const [, name, locator] = match;
  return { slug: COLLECTION_SLUGS[name.trim().toLowerCase()], locator };
}

export function SourceReference({
  type,
  reference,
  className = "",
}: SourceReferenceProps) {
  const t = useTranslations("sources");
  const label =
    type === "quran"
      ? t("quran")
      : type === "hadith"
        ? t("hadith")
        : t("consensus");

  const { slug, locator } = splitReference(reference);
  const collection = slug ? t(`collections.${slug}`) : null;

  return (
    <span className={`source-ref ${className}`}>
      <BookOpen size={12} aria-hidden="true" />
      <span>
        {label}: {collection ? `${collection} ` : ""}
        <span dir="ltr">{collection ? locator : reference}</span>
      </span>
    </span>
  );
}

export default SourceReference;
