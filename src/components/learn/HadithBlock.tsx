import { SourceReference } from "@/components/ui/SourceReference";

interface HadithBlockProps {
  text: string;
  reference: string;
  grade?: string;
}

export function HadithBlock({ text, reference, grade }: HadithBlockProps) {
  return (
    <div className="border-s-4 border-accent-400 bg-accent-50/50 dark:bg-accent-400/10 rounded-e-xl p-5 space-y-3">
      <p className="text-ink dark:text-gray-100 italic leading-relaxed">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <SourceReference type="hadith" reference={reference} />
        {grade && (
          <span className="text-xs text-muted dark:text-gray-400 capitalize">({grade})</span>
        )}
      </div>
    </div>
  );
}
