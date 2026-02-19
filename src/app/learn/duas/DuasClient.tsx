"use client";

import { useState } from "react";
import { LessonContent } from "@/components/learn/LessonContent";
import { Card } from "@/components/ui/Card";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { DuasData, DuaCategory } from "@/types/content";

interface DuasClientProps {
  data: DuasData;
  categories: DuaCategory[];
  lessonIds: string[];
}

export function DuasClient({ data, categories, lessonIds }: DuasClientProps) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <LessonContent
      moduleId="duas"
      lessonIds={lessonIds}
      title={data.title_en}
      titleAr={data.title_ar}
      prevHref="/learn/surahs"
      prevLabel="Essential Surahs"
    >
      {/* Introduction */}
      <section>
        <p className="text-ink leading-relaxed">
          {data.introduction.content_en}
        </p>
      </section>

      {/* Categories */}
      <section className="space-y-8">
        {categories.map((category) => (
          <div key={category.id}>
            <h2 className="font-heading text-xl font-semibold text-ink mb-4">
              {category.title_en}
            </h2>

            <div className="space-y-4">
              {category.duas.map((dua) => (
                <Card key={dua.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      {dua.context && (
                        <p className="text-sm font-medium text-primary-500">
                          {dua.context}
                        </p>
                      )}
                      <button
                        onClick={() => toggleBookmark(dua.id)}
                        className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors text-muted hover:text-accent-500"
                        aria-label={
                          bookmarked.has(dua.id)
                            ? "Remove bookmark"
                            : "Bookmark this dua"
                        }
                      >
                        {bookmarked.has(dua.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-accent-500" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <ArabicText
                      arabic={dua.arabic}
                      transliteration={dua.transliteration}
                      translation={dua.translation}
                      size="lg"
                    />

                    {dua.notes && (
                      <p className="text-sm text-muted italic">{dua.notes}</p>
                    )}

                    <SourceReference
                      type={
                        dua.source.reference.startsWith("Quran")
                          ? "quran"
                          : "hadith"
                      }
                      reference={dua.source.reference}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </LessonContent>
  );
}
