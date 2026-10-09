"use client";

import { useTranslations } from "next-intl";
import { formatCoordinates, type GeoPosition } from "@/lib/geolocation";

export function LocationBar({ location, onChange }: { location: GeoPosition; onChange: () => void }) {
  const t = useTranslations("location");
  return (
    <div className="flex flex-wrap items-center gap-x-4 font-ui text-ui">
      <p className="text-ink">
        {t("current")}{" "}
        <span dir="ltr" className="tabular-nums">
          {formatCoordinates(location)}
        </span>
      </p>
      <button
        type="button"
        onClick={onChange}
        className="min-h-11 text-fajr underline decoration-1 underline-offset-4 hover:decoration-2"
      >
        {t("change")}
      </button>
    </div>
  );
}

// Where the location goes, on every page that asks for it.
export function LocationPrivacy() {
  const t = useTranslations("location");
  return (
    <p className="font-ui text-caption text-ink-2">
      {t.rich("privacy", {
        host: (chunks) => (
          <span dir="ltr" lang="en">
            {chunks}
          </span>
        ),
      })}
    </p>
  );
}
