"use client";

import dynamic from "next/dynamic";
import { LessonContent } from "@/components/learn/LessonContent";
import type { SurahsData, Surah } from "@/types/content";

const SurahPlayer = dynamic(
  () =>
    import("@/components/learn/SurahPlayer").then((m) => m.SurahPlayer),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    ),
  }
);

const MemorizationHelper = dynamic(
  () =>
    import("@/components/learn/MemorizationHelper").then(
      (m) => m.MemorizationHelper
    ),
  { ssr: false }
);

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
