"use client";

import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { roundCoordinate } from "@/lib/geolocation";
import type { NoorSettings } from "@/types/content";

const DEFAULT: NoorSettings = {
  prayerMethod: 2,
  location: null,
};

type Location = NonNullable<NoorSettings["location"]>;

const rounded = (loc: Location): Location => ({
  lat: roundCoordinate(loc.lat),
  lng: roundCoordinate(loc.lng),
});

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<NoorSettings>(STORAGE_KEYS.settings, DEFAULT);
  const stored = settings.location;

  // Versions before the rounding stored full-precision coordinates.
  useEffect(() => {
    if (stored && (stored.lat !== roundCoordinate(stored.lat) || stored.lng !== roundCoordinate(stored.lng))) {
      setSettings((prev) => ({ ...prev, location: prev.location && rounded(prev.location) }));
    }
  }, [stored, setSettings]);

  const setLocation = useCallback(
    (location: Location | null) =>
      setSettings((prev) => ({ ...prev, location: location && rounded(location) })),
    [setSettings],
  );

  const setPrayerMethod = useCallback(
    (prayerMethod: number) => setSettings((prev) => ({ ...prev, prayerMethod })),
    [setSettings],
  );

  return {
    location: stored && rounded(stored),
    prayerMethod: settings.prayerMethod,
    setLocation,
    setPrayerMethod,
  };
}
