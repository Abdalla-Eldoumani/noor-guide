// Plain reads and writes for caches that no component subscribes to. State
// that components render goes through `useLocalStorage` instead.
export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : (JSON.parse(raw) as T);
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is unavailable or full; the cache is only an optimisation.
  }
}

export const STORAGE_KEYS = {
  settings: "noor-settings",
  progress: "noor-progress",
  bookmarks: "noor-bookmarks",
} as const;
