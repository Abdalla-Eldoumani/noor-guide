"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSettings } from "@/hooks/useSettings";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { PRAYER_METHODS } from "@/config/prayer-methods";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { PrayerTimesDisplay } from "@/components/tools/PrayerTimesDisplay";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function PrayerTimesPage() {
  const t = useTranslations("prayerTimes");
  const tCrumb = useTranslations("breadcrumb");
  const tLocation = useTranslations("location");
  const locale = useLocale();
  const { settings, setPrayerMethod } = useSettings();
  const [location, setLocation] = useState(settings.location);
  const { timings, nextPrayer, loading, error } = usePrayerTimes(
    location?.lat ?? null,
    location?.lng ?? null,
    settings.prayerMethod
  );

  const handleLocationSet = (loc: { lat: number; lng: number; name: string }) => {
    setLocation(loc);
  };

  return (
    <PageWrapper>
      {/* Prayer times come from AlAdhan as soon as a location is chosen. */}
      <link rel="preconnect" href="https://api.aladhan.com" />

      <Breadcrumb
        items={[
          { label: tCrumb("home"), href: "/" },
          { label: tCrumb("tools"), href: "/tools" },
          { label: tCrumb("prayerTimes") },
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
            أوقات الصلاة
          </p>
        )}
        <p className="mt-3 text-muted dark:text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      {/* Location picker */}
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

      {/* Calculation method selector */}
      {location && (
        <div className="mb-8">
          <label htmlFor="prayer-method" className="mb-2 block text-sm font-medium text-ink dark:text-gray-100">
            {t("calculationMethod")}
          </label>
          <select
            id="prayer-method"
            value={settings.prayerMethod}
            onChange={(e) => setPrayerMethod(Number(e.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            {PRAYER_METHODS.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <svg className="h-8 w-8 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-muted dark:text-gray-400">{t("loading")}</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-6 text-center dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {t("errorRetry")}
          </p>
        </div>
      )}

      {/* Prayer times display */}
      {timings && !loading && (
        <PrayerTimesDisplay timings={timings} nextPrayer={nextPrayer} />
      )}

      {/* Info note */}
      {timings && (
        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-sm text-muted dark:text-gray-400">
            {t("footerNote")}
          </p>
        </div>
      )}
    </PageWrapper>
  );
}
