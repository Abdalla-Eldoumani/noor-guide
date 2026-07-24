"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSettings } from "@/hooks/useSettings";
import { getQiblaDirection } from "@/lib/qibla";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { QiblaCompass } from "@/components/tools/QiblaCompass";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function QiblaPage() {
  const t = useTranslations("qibla");
  const tCrumb = useTranslations("breadcrumb");
  const tLocation = useTranslations("location");
  const locale = useLocale();
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
          { label: tCrumb("home"), href: "/" },
          { label: tCrumb("tools"), href: "/tools" },
          { label: tCrumb("qibla") },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          {t("title")}
        </h1>
        {locale !== "ar" && (
          <p
            className="mt-2 font-arabic text-arabic-sm text-muted dark:text-gray-400"
            dir="rtl"
            lang="ar"
          >
            اتجاه القبلة
          </p>
        )}
        <p className="mt-3 text-muted dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      {/* Location picker if no location set */}
      {!location ? (
        <div className="mb-8">
          <p className="mb-4 text-ink dark:text-gray-100">
            {t("promptLocation")}
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
            {tLocation("change")}
          </button>
        </div>
      )}

      {/* Qibla compass */}
      {bearing !== null && (
        <div className="flex flex-col items-center py-8">
          <QiblaCompass bearing={bearing} />

          <div className="mt-8 max-w-md text-center">
            <p className="text-ink dark:text-gray-100">
              {t("directionStatement", { bearing: bearing.toFixed(1) })}
            </p>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-2 font-heading text-sm font-semibold text-ink dark:text-gray-100">
          {t("aboutHeading")}
        </h3>
        <p className="text-sm text-muted dark:text-gray-400">
          {t("aboutBody")}
        </p>
      </div>
    </PageWrapper>
  );
}
