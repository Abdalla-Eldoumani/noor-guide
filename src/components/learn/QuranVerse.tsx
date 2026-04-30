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
      <SourceReference type="quran" reference={`Quran ${reference}`} />
    </RecitationBlockquote>
  );
}
