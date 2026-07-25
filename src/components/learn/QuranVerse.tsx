import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";

interface QuranVerseProps {
  reference: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export function QuranVerse({
  reference,
  arabic,
  transliteration,
  translation,
}: QuranVerseProps) {
  return (
    <RecitationBlockquote>
      <ArabicText
        arabic={arabic}
        transliteration={transliteration}
        translation={translation}
        size="lg"
      />
      {/* References are stored canonically as "Quran 2:255", but older content
          used the bare "2:255". Normalise here so neither shape double-prefixes. */}
      <SourceReference
        type="quran"
        reference={/^quran\b/i.test(reference) ? reference : `Quran ${reference}`}
      />
    </RecitationBlockquote>
  );
}
