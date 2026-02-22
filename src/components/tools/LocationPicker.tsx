"use client";

import { useState, useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSettings } from "@/hooks/useSettings";

interface LocationPickerProps {
  onLocationSet: (location: { lat: number; lng: number; name: string }) => void;
}

export function LocationPicker({ onLocationSet }: LocationPickerProps) {
  const { position, loading, error, requestLocation } = useGeolocation();
  const { setLocation } = useSettings();
  const [manualInput, setManualInput] = useState("");
  const [showManual, setShowManual] = useState(false);
  const handledPosition = useRef(false);

  const handleUseMyLocation = () => {
    handledPosition.current = false;
    requestLocation();
  };

  // When position arrives from geolocation, save and notify parent
  useEffect(() => {
    if (position && !loading && !handledPosition.current) {
      handledPosition.current = true;
      const loc = {
        lat: position.lat,
        lng: position.lng,
        name: `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`,
      };
      setLocation(loc);
      onLocationSet(loc);
    }
  }, [position, loading, setLocation, onLocationSet]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    // Try to parse as "lat, lng" format
    const parts = manualInput.split(",").map((s) => s.trim());
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const loc = { lat, lng, name: manualInput.trim() };
        setLocation(loc);
        onLocationSet(loc);
        return;
      }
    }

    // Use the input as a display name with no coords — prompt to use geolocation
    setShowManual(true);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-surface p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 font-heading text-lg font-semibold text-ink dark:text-gray-100">
        Set Your Location
      </h3>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          onClick={handleUseMyLocation}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Detecting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
              Use My Location
            </>
          )}
        </button>

        <span className="text-center text-sm text-muted dark:text-gray-400">or</span>

        <form onSubmit={handleManualSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter coordinates (e.g., 40.7128, -74.0060)"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="rounded-xl border border-primary-500 px-4 py-3 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-500/10"
          >
            Set
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error.code === "PERMISSION_DENIED" && (
            <p>Location permission was denied. Please enable location access in your browser settings, or enter coordinates manually.</p>
          )}
          {error.code === "POSITION_UNAVAILABLE" && (
            <p>Unable to determine your location. Please try again or enter coordinates manually.</p>
          )}
          {error.code === "TIMEOUT" && (
            <p>Location request timed out. Please try again or enter coordinates manually.</p>
          )}
          {error.code === "NOT_SUPPORTED" && (
            <p>Geolocation is not supported in your browser. Please enter coordinates manually.</p>
          )}
        </div>
      )}

      {showManual && (
        <p className="mt-3 text-sm text-muted dark:text-gray-400">
          Please enter coordinates as latitude, longitude.
        </p>
      )}
    </div>
  );
}
