// AlAdhan API wrapper — prayer times with localStorage caching

import type { AlAdhanResponse, AlAdhanTimings } from "@/types/api";
import { getItem, setItem } from "./storage";

const API_BASE = "https://api.aladhan.com/v1";
const CACHE_KEY = "noor-prayer-times-cache";

interface CachedPrayerTimes {
  date: string;
  lat: number;
  lng: number;
  method: number;
  timings: AlAdhanTimings;
}

function todayDateString(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number = 2
): Promise<AlAdhanTimings> {
  const today = todayDateString();

  // Check cache
  const cached = getItem<CachedPrayerTimes | null>(CACHE_KEY, null);
  if (
    cached &&
    cached.date === today &&
    cached.lat === lat &&
    cached.lng === lng &&
    cached.method === method
  ) {
    return cached.timings;
  }

  // Fetch from API
  const url = `${API_BASE}/timings/${today}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const res = await fetch(url);

  if (!res.ok) {
    // Fall back to cache if available (even if stale)
    if (cached) return cached.timings;
    throw new Error(`AlAdhan API error: ${res.status}`);
  }

  const json: AlAdhanResponse = await res.json();
  const timings = json.data.timings;

  // Cache result
  setItem(CACHE_KEY, {
    date: today,
    lat,
    lng,
    method,
    timings,
  } satisfies CachedPrayerTimes);

  return timings;
}

export const PRAYER_METHODS: { id: number; name: string }[] = [
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 3, name: "Muslim World League (MWL)" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 1, name: "University of Islamic Sciences, Karachi" },
];

/**
 * Determine which prayer is next based on current time.
 * Returns the prayer name or null if all prayers have passed.
 */
export function getNextPrayer(
  timings: AlAdhanTimings
): string | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

  for (const prayer of prayers) {
    const timeStr = timings[prayer]; // e.g. "05:23 (EET)"
    const [h, m] = timeStr.split(/[: ]/);
    const prayerMinutes = parseInt(h) * 60 + parseInt(m);
    if (currentMinutes < prayerMinutes) {
      return prayer;
    }
  }

  return null; // All prayers passed — Fajr is next (tomorrow)
}
