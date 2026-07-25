"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LessonContent } from "@/components/learn/LessonContent";
import { Card } from "@/components/ui/Card";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { DuasData, DuaCategory } from "@/types/content";
import { getModuleById } from "@/lib/content";
import { pickLocalized, useLocalizedContent } from "@/lib/content-i18n";

interface DuasClientProps {
  data: DuasData;
  categories: DuaCategory[];
  lessonIds: string[];
}

export function DuasClient({ data, categories, lessonIds }: DuasClientProps) {
  const pickModule = useLocalizedContent();
  const t = useLocalizedContent();
  const locale = useLocale();
  const tDuas = useTranslations("duas");
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

  const lessonTitle = t<string>(data, "title") ?? data.title_en;
  const introContent =
    t<string>(data.introduction, "content") ?? data.introduction.content_en;

  return (
    <LessonContent
      moduleId="duas"
      lessonIds={lessonIds}
      title={lessonTitle}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      prevHref="/learn/surahs"
      prevLabel={pickModule(getModuleById("surahs"), "title")}
    >
      {/* Introduction */}
      <section>
        <p className="text-ink leading-relaxed">{introContent}</p>
      </section>

      {/* Categories */}
      <section className="space-y-8">
        {categories.map((category) => {
          const categoryTitle =
            pickLocalized<string>(category, "title", locale) ?? category.title_en;
          return (
            <div key={category.id}>
              <h2 className="font-heading text-xl font-semibold text-ink mb-4">
                {categoryTitle}
              </h2>

              <div className="space-y-4">
                {category.duas.map((dua) => {
                  const duaContext =
                    pickLocalized<string>(dua, "context", locale) ?? dua.context;
                  const duaNotes =
                    pickLocalized<string>(dua, "notes", locale) ?? dua.notes;
                  const duaTranslation =
                    pickLocalized<string>(dua, "translation", locale) ?? dua.translation;
                  return (
                    <Card key={dua.id}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          {duaContext && (
                            <p className="text-sm font-medium text-primary-500">
                              {duaContext}
                            </p>
                          )}
                          <button
                            onClick={() => toggleBookmark(dua.id)}
                            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-muted hover:text-accent-500"
                            aria-label={
                              bookmarked.has(dua.id)
                                ? tDuas("bookmarkRemove")
                                : tDuas("bookmarkAdd")
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
                          translation={duaTranslation}
                          size="lg"
                        />

                        {duaNotes && (
                          <p className="text-sm text-muted italic">{duaNotes}</p>
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
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </LessonContent>
  );
}
