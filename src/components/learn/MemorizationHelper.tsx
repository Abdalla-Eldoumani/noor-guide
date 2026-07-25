"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import type { Verse } from "@/types/content";

interface MemorizationHelperProps {
  verses: Verse[];
}

export function MemorizationHelper({ verses }: MemorizationHelperProps) {
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="bg-cream rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-semibold text-ink">
          Memorization Practice
        </h4>
        <div className="flex gap-2">
          <Button
            variant={showTransliteration ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowTransliteration(!showTransliteration)}
          >
            <span className="flex items-center gap-1.5">
              {showTransliteration ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              Transliteration
            </span>
          </Button>
          <Button
            variant={showTranslation ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            <span className="flex items-center gap-1.5">
              {showTranslation ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              Translation
            </span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {verses.map((verse) => (
          <div
            key={verse.verse}
            className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <p dir="rtl" lang="ar" className="font-arabic text-arabic-lg text-right text-ink leading-loose">
              {verse.arabic}
            </p>
            {showTransliteration && (
              <p className="font-mono text-sm text-muted mt-1">
                {verse.transliteration}
              </p>
            )}
            {showTranslation && (
              <p className="text-sm text-muted italic mt-1">
                {verse.translation}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted">
        Try reading the Arabic first, then reveal the transliteration to check
        your pronunciation.
      </p>
    </div>
  );
}
