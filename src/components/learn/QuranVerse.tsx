import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";

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
    <div className="bg-primary-50/50 rounded-xl p-5 space-y-3">
      <ArabicText
        arabic={arabic}
        transliteration={transliteration}
        translation={translation}
        size="lg"
      />
      <SourceReference type="quran" reference={`Quran ${reference}`} />
    </div>
  );
}
