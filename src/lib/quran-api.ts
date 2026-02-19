// Al Quran Cloud API wrapper — audio URLs with localStorage caching

import type { QuranSurahResponse } from "@/types/api";
import { getItem, setItem } from "./storage";

const API_BASE = "https://api.alquran.cloud/v1";
const CACHE_PREFIX = "noor-quran-audio-";

interface CachedAudio {
  surahNumber: number;
  audioUrls: string[];
}

/**
 * Fetch audio URLs for a surah from Al Quran Cloud API (Mishary Alafasy edition).
 * Caches in localStorage for offline fallback.
 */
export async function fetchSurahAudio(
  surahNumber: number
): Promise<string[]> {
  const cacheKey = `${CACHE_PREFIX}${surahNumber}`;

  // Check cache
  const cached = getItem<CachedAudio | null>(cacheKey, null);
  if (cached && cached.audioUrls.length > 0) {
    return cached.audioUrls;
  }

  // Fetch from API
  const url = `${API_BASE}/surah/${surahNumber}/ar.alafasy`;
  const res = await fetch(url);

  if (!res.ok) {
    if (cached) return cached.audioUrls;
    throw new Error(`Quran API error: ${res.status}`);
  }

  const json: QuranSurahResponse = await res.json();
  const audioUrls = json.data.ayahs
    .map((a) => a.audio)
    .filter((u): u is string => !!u);

  // Cache
  setItem(cacheKey, { surahNumber, audioUrls } satisfies CachedAudio);

  return audioUrls;
}
