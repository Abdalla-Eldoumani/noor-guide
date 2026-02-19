"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { getQiblaDirection } from "@/lib/qibla";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { QiblaCompass } from "@/components/tools/QiblaCompass";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function QiblaPage() {
  const { settings } = useSettings();
  const [location, setLocation] = useState(settings.location);

  const bearing = location ? getQiblaDirection(location.lat, location.lng) : null;

  const handleLocationSet = (loc: { lat: number; lng: number; name: string }) => {
    setLocation(loc);
  };

  return (
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Qibla Direction" },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          Qibla Direction
        </h1>
        <p className="mt-2 font-arabic text-arabic-sm text-muted dark:text-gray-400" dir="rtl">
          اتجاه القبلة
        </p>
        <p className="mt-3 text-muted dark:text-gray-400">
          Find the direction of the Qibla (Kaaba in Makkah) from your location.
        </p>
      </div>

      {/* Location picker if no location set */}
      {!location ? (
        <div className="mb-8">
          <p className="mb-4 text-ink dark:text-gray-100">
            To find the Qibla direction, we need to know your location.
          </p>
          <LocationPicker onLocationSet={handleLocationSet} />
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-sm text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location.name}
          </div>
          <button
            onClick={() => setLocation(null)}
            className="text-sm text-muted underline hover:text-ink dark:text-gray-400 dark:hover:text-gray-200"
          >
            Change location
          </button>
        </div>
      )}

      {/* Qibla compass */}
      {bearing !== null && (
        <div className="flex flex-col items-center py-8">
          <QiblaCompass bearing={bearing} />

          <div className="mt-8 max-w-md text-center">
            <p className="text-ink dark:text-gray-100">
              The Qibla from your location is{" "}
              <span className="font-bold text-primary-500">{bearing.toFixed(1)}&deg;</span> from
              North.
            </p>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-2 font-heading text-sm font-semibold text-ink dark:text-gray-100">
          About the Qibla
        </h3>
        <p className="text-sm text-muted dark:text-gray-400">
          The Qibla is the direction that Muslims face during prayer. It points towards the
          Kaaba in the Sacred Mosque (Al-Masjid al-Haram) in Makkah, Saudi Arabia. The direction
          shown here is calculated mathematically based on your coordinates and the position of the
          Kaaba. For best accuracy, use a physical compass to align with the bearing shown above.
        </p>
      </div>
    </PageWrapper>
  );
}
