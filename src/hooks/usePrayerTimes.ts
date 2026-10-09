"use client";

import { useEffect, useState } from "react";
import { useNow } from "next-intl";
import { fetchPrayerTimes, getNextPrayer, PrayerTimesError, type PrayerDay } from "@/lib/prayer-times";

interface Result {
  key: string;
  day: PrayerDay | null;
  error: PrayerTimesError["kind"] | null;
}

export function usePrayerTimes(lat: number | null, lng: number | null, method: number) {
  const key = lat === null || lng === null ? null : `${lat},${lng},${method}`;
  const [result, setResult] = useState<Result | null>(null);
  // Re-renders once a minute so the next prayer moves on by itself.
  const now = useNow({ updateInterval: 60000 });

  useEffect(() => {
    if (key === null || lat === null || lng === null) return;
    let cancelled = false;
    fetchPrayerTimes(lat, lng, method)
      .then((day) => {
        if (!cancelled) setResult({ key, day, error: null });
      })
      .catch((e: unknown) => {
        if (!cancelled) setResult({ key, day: null, error: e instanceof PrayerTimesError ? e.kind : "network" });
      });
    return () => {
      cancelled = true;
    };
  }, [key, lat, lng, method]);

  // A result for an earlier location or method does not count.
  const current = result && result.key === key ? result : null;
  const day = current?.day ?? null;

  return {
    day,
    nextPrayer: day ? getNextPrayer(day.timings, now, day.timezone) : null,
    loading: key !== null && current === null,
    error: current?.error ?? null,
  };
}
