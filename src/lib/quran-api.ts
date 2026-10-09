import type { QuranSurahResponse } from "@/types/api";
import { getItem, setItem } from "./storage";

const API_BASE = "https://api.alquran.cloud/v1";
const CACHE_PREFIX = "noor-quran-audio-";

interface CachedAudio {
  surahNumber: number;
  audioUrls: string[];
}

// Per-verse recitation by Mishary Alafasy. The list is cached, so the API is
// asked once per surah; the files themselves come from cdn.islamic.network.
export async function fetchSurahAudio(surahNumber: number): Promise<string[]> {
  const cacheKey = `${CACHE_PREFIX}${surahNumber}`;
  const cached = getItem<CachedAudio | null>(cacheKey, null);
  if (cached && cached.audioUrls.length > 0) return cached.audioUrls;

  const res = await fetch(`${API_BASE}/surah/${surahNumber}/ar.alafasy`);
  if (!res.ok) throw new Error(`Quran API error: ${res.status}`);

  const json: QuranSurahResponse = await res.json();
  const audioUrls = json.data.ayahs.map((a) => a.audio).filter((u): u is string => !!u);
  setItem(cacheKey, { surahNumber, audioUrls } satisfies CachedAudio);
  return audioUrls;
}
