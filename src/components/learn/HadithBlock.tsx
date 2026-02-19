import { SourceReference } from "@/components/ui/SourceReference";

interface HadithBlockProps {
  text: string;
  reference: string;
  grade?: string;
}

export function HadithBlock({ text, reference, grade }: HadithBlockProps) {
  return (
    <div className="border-l-4 border-accent-400 bg-accent-50/50 rounded-r-xl p-5 space-y-3">
      <p className="text-ink italic leading-relaxed">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <SourceReference type="hadith" reference={reference} />
        {grade && (
          <span className="text-xs text-muted capitalize">({grade})</span>
        )}
      </div>
    </div>
  );
}
