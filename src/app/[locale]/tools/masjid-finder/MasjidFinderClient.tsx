"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/hooks/useSettings";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { LocationBar, LocationPrivacy } from "@/components/tools/LocationBar";

const TIPS = ["tip1", "tip2", "tip3", "tip4"] as const;

export function MasjidFinderClient() {
  const t = useTranslations("masjidFinder");
  const { location, setLocation } = useSettings();
  const [editing, setEditing] = useState(false);
  const showLinks = location && !editing;

  const maps = location
    ? [
        {
          key: "google",
          href: `https://www.google.com/maps/search/mosque+near+${location.lat},${location.lng}`,
        },
        {
          key: "osm",
          href: `https://www.openstreetmap.org/search?query=mosque+near+${location.lat}%2C${location.lng}`,
        },
      ]
    : [];

  return (
    <div className="mt-8 space-y-10">
      <div className="space-y-3">
        {showLinks ? (
          <LocationBar location={location} onChange={() => setEditing(true)} />
        ) : (
          <LocationPicker
            onLocationSet={(loc) => {
              setLocation(loc);
              setEditing(false);
            }}
            onCancel={location ? () => setEditing(false) : undefined}
          />
        )}
        <LocationPrivacy />
      </div>

      {showLinks && (
        <ul className="border-y border-rule">
          {maps.map((map) => (
            <li key={map.key} className="border-b border-rule last:border-b-0">
              <a
                href={map.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-3 block rounded-control px-3 py-4 transition-colors duration-150 hover:bg-wash"
              >
                <span className="block text-body text-ink group-hover:text-fajr">
                  {t(`${map.key}SearchTitle`)}
                  <span aria-hidden="true" className="ms-1.5 inline-block rtl:-scale-x-100">
                    ↗
                  </span>
                </span>
                <span className="block font-ui text-ui text-ink-2">{t(`${map.key}SearchBody`)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <section>
        <h2 className="font-prose text-section font-semibold text-ink">{t("tipsHeading")}</h2>
        <ul className="mt-4 list-disc space-y-2 ps-5 text-body text-ink marker:text-ink-2">
          {TIPS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
