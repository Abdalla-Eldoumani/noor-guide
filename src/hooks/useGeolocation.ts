"use client";

import { useState, useCallback } from "react";
import { getCurrentPosition, type GeoPosition, type GeoErrorCode } from "@/lib/geolocation";

export function useGeolocation(onPosition: (position: GeoPosition) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeoErrorCode | null>(null);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    getCurrentPosition()
      .then(onPosition)
      .catch((code: GeoErrorCode) => setError(code))
      .finally(() => setLoading(false));
  }, [onPosition]);

  return { loading, error, requestLocation };
}
