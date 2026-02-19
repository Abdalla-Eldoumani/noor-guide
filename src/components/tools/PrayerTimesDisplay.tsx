"use client";

import type { AlAdhanTimings } from "@/types/api";

interface PrayerTimesDisplayProps {
  timings: AlAdhanTimings;
  nextPrayer: string | null;
}

const PRAYERS = [
  { key: "Fajr" as const, name_en: "Fajr", name_ar: "الفجر" },
  { key: "Dhuhr" as const, name_en: "Dhuhr", name_ar: "الظهر" },
  { key: "Asr" as const, name_en: "Asr", name_ar: "العصر" },
  { key: "Maghrib" as const, name_en: "Maghrib", name_ar: "المغرب" },
  { key: "Isha" as const, name_en: "Isha", name_ar: "العشاء" },
];

function formatTime(timeStr: string): string {
  // AlAdhan returns times like "05:23 (EET)" — strip the timezone part
  return timeStr.split(" ")[0];
}

export function PrayerTimesDisplay({ timings, nextPrayer }: PrayerTimesDisplayProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {PRAYERS.map((prayer) => {
        const isNext = nextPrayer === prayer.key;
        return (
          <div
            key={prayer.key}
            className={`rounded-2xl border p-5 text-center transition-all ${
              isNext
                ? "border-accent-400 bg-accent-50 shadow-md dark:border-accent-400 dark:bg-accent-400/10"
                : "border-gray-200 bg-surface dark:border-gray-700 dark:bg-gray-800"
            }`}
          >
            {isNext && (
              <span className="mb-2 inline-block rounded-full bg-accent-400 px-3 py-0.5 text-xs font-semibold text-white">
                Next Prayer
              </span>
            )}
            <p className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
              {prayer.name_en}
            </p>
            <p className="font-arabic text-arabic-sm text-muted dark:text-gray-400" dir="rtl">
              {prayer.name_ar}
            </p>
            <p className={`mt-3 font-heading text-2xl font-bold ${
              isNext ? "text-accent-500" : "text-primary-500"
            }`}>
              {formatTime(timings[prayer.key])}
            </p>
          </div>
        );
      })}
    </div>
  );
}
