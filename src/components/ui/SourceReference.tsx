import { BookOpen } from "lucide-react";

interface SourceReferenceProps {
  type: "quran" | "hadith" | "scholarly_consensus";
  reference: string;
  className?: string;
}

export function SourceReference({
  type,
  reference,
  className = "",
}: SourceReferenceProps) {
  const label =
    type === "quran"
      ? "Quran"
      : type === "hadith"
        ? "Hadith"
        : "Scholarly Consensus";

  return (
    <span className={`source-ref ${className}`}>
      <BookOpen size={12} aria-hidden="true" />
      <span>
        {label}: {reference}
      </span>
    </span>
  );
}

export default SourceReference;
