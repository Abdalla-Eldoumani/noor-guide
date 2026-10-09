import { useTranslations } from "next-intl";

interface SourceReferenceProps {
  type: "quran" | "hadith" | "scholarly_consensus";
  reference: string;
}

// Content stores a reference as an English collection name and a locator, such
// as "Sahih Bukhari 6312" or "Quran 5:6". Splitting them lets the name be
// translated while the locator stays as written.
const COLLECTION_SLUGS: Record<string, string> = {
  "sahih bukhari": "bukhari",
  "sahih al-bukhari": "bukhari",
  "sahih muslim": "muslim",
  "sunan abu dawud": "abudawud",
  "sunan an-nasa'i": "nasai",
  "jami' at-tirmidhi": "tirmidhi",
  quran: "quran",
};

function splitReference(reference: string): { slug?: string; locator: string } {
  const match = reference.match(/^(.*?)\s*(\d[\w:.-]*)$/);
  if (!match) return { locator: reference };
  const [, name, locator] = match;
  return { slug: COLLECTION_SLUGS[name.trim().toLowerCase()], locator };
}

export function SourceReference({ type, reference }: SourceReferenceProps) {
  const t = useTranslations("sources");

  if (type === "scholarly_consensus") {
    return <p className="font-ui text-caption text-ink-2">{t("consensus")}</p>;
  }

  const { slug, locator } = splitReference(reference);
  return (
    <p className="font-ui text-caption text-ink-2">
      {slug ? (
        <>
          {t(`collections.${slug}`)} <span dir="ltr">{locator}</span>
        </>
      ) : (
        <span dir="ltr" lang="en">
          {reference}
        </span>
      )}
    </p>
  );
}
