"use client";

import { useTranslations } from "next-intl";
import { PRAYER_KEYS } from "@/lib/prayer-times";
import type { AlAdhanTimings } from "@/types/api";

// AlAdhan returns "05:23" or, for some zones, "05:23 (EET)".
const clock = (value: string) => value.split(" ")[0];

export function PrayerTimesDisplay({ timings, nextPrayer }: { timings: AlAdhanTimings; nextPrayer: string | null }) {
  const t = useTranslations("prayers");
  const tTimes = useTranslations("prayerTimes");

  return (
    <ol className="border-y border-rule">
      {PRAYER_KEYS.map((key) => {
        const isNext = nextPrayer === key;
        return (
          <li
            key={key}
            className={`-mx-3 flex items-baseline gap-3 border-b border-rule px-3 py-3.5 last:border-b-0 ${
              isNext ? "bg-wash" : ""
            }`}
          >
            <span className={`text-body text-ink ${isNext ? "font-semibold" : ""}`}>{t(key.toLowerCase())}</span>
            {isNext && (
              <span className="inline-flex items-center gap-1.5 font-ui text-caption text-ink-2">
                <span aria-hidden="true" className="size-2 rounded-full bg-ochre" />
                {tTimes("nextPrayerLabel")}
              </span>
            )}
            <span aria-hidden="true" className="leader" />
            <span dir="ltr" className={`font-ui text-body tabular-nums text-ink ${isNext ? "font-semibold" : ""}`}>
              {clock(timings[key])}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
