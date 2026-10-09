import { useLocale } from "next-intl";

interface ArabicTextProps {
  arabic: string;
  transliteration?: string;
  translation?: string;
  credit?: string;
}

// The transliteration and rendering are study aids for readers of English and
// French; an Arabic reader sees the text on its own.
export function ArabicText({
  arabic,
  transliteration,
  translation,
  credit,
}: ArabicTextProps) {
  const locale = useLocale();
  const showAids = locale !== "ar";

  return (
    <div className="space-y-2">
      <p lang="ar" dir="rtl" className="font-quran text-quran-sm text-ink sm:text-quran">
        {arabic}
      </p>
      {showAids && transliteration && <p className="translit text-small">{transliteration}</p>}
      {showAids && translation && <p className="text-body text-ink">{translation}</p>}
      {showAids && credit && <p className="font-ui text-caption text-ink-2">{credit}</p>}
    </div>
  );
}
