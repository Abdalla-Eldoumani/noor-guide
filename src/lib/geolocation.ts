export interface GeoPosition {
  lat: number;
  lng: number;
}

export type GeoErrorCode = "PERMISSION_DENIED" | "POSITION_UNAVAILABLE" | "TIMEOUT" | "NOT_SUPPORTED";

// Two decimals is about a kilometre: enough for prayer times and the qibla,
// and no more precise than either needs.
export function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatCoordinates({ lat, lng }: GeoPosition): string {
  return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
}

// "51.05, -114.07" or "51.05 -114.07"; anything out of range is rejected.
export function parseCoordinates(input: string): GeoPosition | null {
  const parts = input.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length !== 2) return null;
  const [lat, lng] = parts.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat: roundCoordinate(lat), lng: roundCoordinate(lng) };
}

export function getCurrentPosition(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject("NOT_SUPPORTED" satisfies GeoErrorCode);
      return;
    }
    const codes: Record<number, GeoErrorCode> = {
      1: "PERMISSION_DENIED",
      2: "POSITION_UNAVAILABLE",
      3: "TIMEOUT",
    };
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ lat: roundCoordinate(coords.latitude), lng: roundCoordinate(coords.longitude) }),
      (error) => reject(codes[error.code] ?? "POSITION_UNAVAILABLE"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  });
}
