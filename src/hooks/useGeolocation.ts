"use client";

import { useState, useCallback } from "react";
import { getCurrentPosition, type GeoPosition, type GeoError } from "@/lib/geolocation";

interface UseGeolocationResult {
  position: GeoPosition | null;
  loading: boolean;
  error: GeoError | null;
  requestLocation: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeoError | null>(null);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    getCurrentPosition()
      .then((pos) => {
        setPosition(pos);
      })
      .catch((err: GeoError) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { position, loading, error, requestLocation };
}
