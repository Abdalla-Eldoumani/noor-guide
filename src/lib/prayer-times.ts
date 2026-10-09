import type { AlAdhanResponse, AlAdhanTimings } from "@/types/api";
import { getItem, setItem } from "./storage";
import { roundCoordinate } from "./geolocation";

const API_BASE = "https://api.aladhan.com/v1";
const CACHE_KEY = "noor-prayer-times-cache";

export interface PrayerDay {
  // DD-MM-YYYY, the day these times are for.
  date: string;
  // IANA zone of the location; the times are local to it.
  timezone?: string;
  timings: AlAdhanTimings;
  // The service could not be reached, so an earlier day's times are shown.
  stale: boolean;
}

interface CachedPrayerTimes {
  date: string;
  lat: number;
  lng: number;
  method: number;
  timezone?: string;
  timings: AlAdhanTimings;
}

export class PrayerTimesError extends Error {
  constructor(public kind: "network" | "service") {
    super(kind);
  }
}

function todayDateString(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: number,
): Promise<PrayerDay> {
  const lat = roundCoordinate(latitude);
  const lng = roundCoordinate(longitude);
  const today = todayDateString();

  const cached = getItem<CachedPrayerTimes | null>(CACHE_KEY, null);
  const samePlace = cached && cached.lat === lat && cached.lng === lng && cached.method === method;
  const fromCache = (stale: boolean): PrayerDay => ({
    date: cached!.date,
    timezone: cached!.timezone,
    timings: cached!.timings,
    stale,
  });

  if (samePlace && cached.date === today) return fromCache(false);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/timings/${today}?latitude=${lat}&longitude=${lng}&method=${method}`);
  } catch {
    if (samePlace) return fromCache(true);
    throw new PrayerTimesError("network");
  }
  if (!res.ok) {
    if (samePlace) return fromCache(true);
    throw new PrayerTimesError("service");
  }

  const json: AlAdhanResponse = await res.json();
  const entry: CachedPrayerTimes = {
    date: today,
    lat,
    lng,
    method,
    timezone: json.data.meta?.timezone,
    timings: json.data.timings,
  };
  setItem(CACHE_KEY, entry);
  return { date: entry.date, timezone: entry.timezone, timings: entry.timings, stale: false };
}

// Minutes past midnight in the location's own zone, so coordinates typed in
// for another city still mark the right prayer as next.
function minutesAt(now: Date, timeZone?: string): number {
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
      }).formatToParts(now);
      const hour = Number(parts.find((p) => p.type === "hour")?.value);
      const minute = Number(parts.find((p) => p.type === "minute")?.value);
      if (Number.isFinite(hour) && Number.isFinite(minute)) return hour * 60 + minute;
    } catch {
      // An unknown zone falls back to the device clock.
    }
  }
  return now.getHours() * 60 + now.getMinutes();
}

export const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

// Null once Isha has passed: the next prayer is tomorrow's Fajr.
export function getNextPrayer(timings: AlAdhanTimings, now: Date, timeZone?: string): string | null {
  const current = minutesAt(now, timeZone);
  for (const prayer of PRAYER_KEYS) {
    const [h, m] = timings[prayer].split(/[: ]/);
    if (current < Number(h) * 60 + Number(m)) return prayer;
  }
  return null;
}
