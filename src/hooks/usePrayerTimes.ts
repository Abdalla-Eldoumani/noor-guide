"use client";

import { useState, useEffect } from "react";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";
import type { AlAdhanTimings } from "@/types/api";

interface UsePrayerTimesResult {
  timings: AlAdhanTimings | null;
  nextPrayer: string | null;
  loading: boolean;
  error: string | null;
}

export function usePrayerTimes(
  lat: number | null,
  lng: number | null,
  method: number = 2
): UsePrayerTimesResult {
  const [timings, setTimings] = useState<AlAdhanTimings | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPrayerTimes(lat, lng, method)
      .then((t) => {
        if (cancelled) return;
        setTimings(t);
        setNextPrayer(getNextPrayer(t));
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load prayer times");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, method]);

  // Update next prayer every minute
  useEffect(() => {
    if (!timings) return;
    const interval = setInterval(() => {
      setNextPrayer(getNextPrayer(timings));
    }, 60000);
    return () => clearInterval(interval);
  }, [timings]);

  return { timings, nextPrayer, loading, error };
}
