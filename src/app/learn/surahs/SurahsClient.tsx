"use client";

import { LessonContent } from "@/components/learn/LessonContent";
import { SurahPlayer } from "@/components/learn/SurahPlayer";
import { MemorizationHelper } from "@/components/learn/MemorizationHelper";
import type { SurahsData, Surah } from "@/types/content";

interface SurahsClientProps {
  data: SurahsData;
  surahs: Surah[];
  lessonIds: string[];
}

export function SurahsClient({ data, surahs, lessonIds }: SurahsClientProps) {
  return (
    <LessonContent
      moduleId="surahs"
      lessonIds={lessonIds}
      title={data.title_en}
      titleAr={data.title_ar}
      prevHref="/learn/salah"
      prevLabel="How to Pray"
      nextHref="/learn/duas"
      nextLabel="Daily Duas"
    >
      {/* Introduction */}
      <section>
        <p className="text-ink leading-relaxed">
          {data.introduction.content_en}
        </p>
      </section>

      {/* Surahs */}
      <section className="space-y-8">
        {surahs.map((surah, index) => (
          <div key={surah.id} className="space-y-4">
            {/* Priority callout for Al-Fatiha */}
            {index === 0 && (
              <div className="bg-accent-50 border border-accent-200 rounded-xl px-5 py-3">
                <p className="text-sm font-semibold text-accent-700">
                  Start Here — {surah.priority}
                </p>
              </div>
            )}

            <SurahPlayer surah={surah} />

            <MemorizationHelper verses={surah.verses} />
          </div>
        ))}
      </section>
    </LessonContent>
  );
}
