import type { ReactNode } from "react";

type ArabicTextSize = "sm" | "base" | "lg" | "xl";

interface ArabicTextProps {
  arabic?: string;
  children?: ReactNode;
  transliteration?: string;
  translation?: string;
  size?: ArabicTextSize;
  className?: string;
}

const sizeClasses: Record<ArabicTextSize, string> = {
  sm: "text-arabic-sm",
  base: "text-arabic-base",
  lg: "text-arabic-lg",
  xl: "text-arabic-xl",
};

export function ArabicText({
  arabic,
  children,
  transliteration,
  translation,
  size = "base",
  className = "",
}: ArabicTextProps) {
  const text = arabic || children;

  return (
    <div className={`space-y-2 ${className}`}>
      <p
        dir="rtl"
        lang="ar"
        className={`font-arabic ${sizeClasses[size]} leading-loose text-ink dark:text-gray-100`}
      >
        {text}
      </p>
      {transliteration && (
        <p className="transliteration dark:text-gray-400">{transliteration}</p>
      )}
      {translation && (
        <p className="text-sm text-muted dark:text-gray-300">{translation}</p>
      )}
    </div>
  );
}

export default ArabicText;
