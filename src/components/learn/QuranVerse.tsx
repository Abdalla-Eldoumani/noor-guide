import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";

interface QuranVerseProps {
  reference: string;
  arabic: string;
  transliteration: string;
  translation: string;
  credit?: string;
}

export function QuranVerse({ reference, arabic, transliteration, translation, credit }: QuranVerseProps) {
  return (
    <RecitationBlockquote>
      <ArabicText
        arabic={arabic}
        transliteration={transliteration}
        translation={translation}
        credit={credit}
      />
      <SourceReference
        type="quran"
        reference={/^quran\b/i.test(reference) ? reference : `Quran ${reference}`}
      />
    </RecitationBlockquote>
  );
}
