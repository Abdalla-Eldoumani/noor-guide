"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/hooks/useSettings";
import { getQiblaDirection } from "@/lib/qibla";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { LocationBar, LocationPrivacy } from "@/components/tools/LocationBar";
import { QiblaCompass } from "@/components/tools/QiblaCompass";

export function QiblaClient() {
  const t = useTranslations("qibla");
  const { location, setLocation } = useSettings();
  const [editing, setEditing] = useState(false);
  const showCompass = location && !editing;

  return (
    <div className="mt-8 space-y-10">
      <div className="space-y-3">
        {showCompass ? (
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

      {showCompass && (
        <section className="space-y-6">
          <QiblaCompass bearing={getQiblaDirection(location.lat, location.lng)} />
          <p className="mx-auto max-w-md text-center text-small text-ink-2">{t("trueNorthNote")}</p>
        </section>
      )}

      <section>
        <h2 className="font-prose text-section font-semibold text-ink">{t("aboutHeading")}</h2>
        <p className="mt-3 text-body text-ink">{t("aboutBody")}</p>
      </section>
    </div>
  );
}
