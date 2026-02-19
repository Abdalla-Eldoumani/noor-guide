"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { NoorSettings } from "@/types/content";

const DEFAULT: NoorSettings = {
  theme: "light",
  language: "en",
  prayerMethod: 2,
  location: null,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<NoorSettings>(
    STORAGE_KEYS.settings,
    DEFAULT
  );

  const setTheme = useCallback(
    (theme: "light" | "dark") => {
      setSettings((prev) => ({ ...prev, theme }));
    },
    [setSettings]
  );

  const setLocation = useCallback(
    (location: NoorSettings["location"]) => {
      setSettings((prev) => ({ ...prev, location }));
    },
    [setSettings]
  );

  const setPrayerMethod = useCallback(
    (prayerMethod: number) => {
      setSettings((prev) => ({ ...prev, prayerMethod }));
    },
    [setSettings]
  );

  return {
    settings,
    setTheme,
    setLocation,
    setPrayerMethod,
  };
}
