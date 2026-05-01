"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";

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
  // On the Arabic locale, the transliteration and English translation are
  // study aids for English readers and add nothing for someone who reads the
  // Arabic source directly. Hide them so an Arabic reader sees the verse or
  // dua on its own.
  const locale = useLocale();
  const showSecondary = locale !== "ar";
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
      {showSecondary && transliteration && (
        <p className="transliteration dark:text-gray-400">{transliteration}</p>
      )}
      {showSecondary && translation && (
        <p className="text-sm text-muted dark:text-gray-300">{translation}</p>
      )}
    </div>
  );
}

export default ArabicText;
