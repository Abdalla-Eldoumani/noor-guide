"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function MasjidFinderPage() {
  const { settings } = useSettings();
  const [location, setLocation] = useState(settings.location);

  const handleLocationSet = (loc: { lat: number; lng: number; name: string }) => {
    setLocation(loc);
  };

  const googleMapsUrl = location
    ? `https://www.google.com/maps/search/mosque+near+${location.lat},${location.lng}`
    : null;

  const osmUrl = location
    ? `https://www.openstreetmap.org/search?query=mosque+near+${location.lat}%2C${location.lng}`
    : null;

  return (
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Find a Mosque" },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          Find a Mosque Near You
        </h1>
        <p className="mt-2 font-arabic text-arabic-sm text-muted dark:text-gray-400" dir="rtl">
          ابحث عن مسجد
        </p>
        <p className="mt-3 text-muted dark:text-gray-400">
          Locate mosques in your area for congregational prayers and community support.
        </p>
      </div>

      {/* Location picker */}
      {!location ? (
        <div className="mb-8">
          <p className="mb-4 text-ink dark:text-gray-100">
            Set your location to find mosques nearby.
          </p>
          <LocationPicker onLocationSet={handleLocationSet} />
        </div>
      ) : (
        <>
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

          {/* Search actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Google Maps */}
            <a
              href={googleMapsUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-surface p-8 text-center shadow-sm transition-all hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-100 dark:bg-primary-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
                  Search on Google Maps
                </h3>
                <p className="mt-1 text-sm text-muted dark:text-gray-400">
                  Find mosques with reviews, directions, and prayer times
                </p>
              </div>
            </a>

            {/* OpenStreetMap */}
            <a
              href={osmUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-surface p-8 text-center shadow-sm transition-all hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-500 transition-colors group-hover:bg-accent-100 dark:bg-accent-400/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
                  Search on OpenStreetMap
                </h3>
                <p className="mt-1 text-sm text-muted dark:text-gray-400">
                  Free, community-driven map of mosques worldwide
                </p>
              </div>
            </a>
          </div>
        </>
      )}

      {/* Info section */}
      <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-3 font-heading text-sm font-semibold text-ink dark:text-gray-100">
          Tips for Finding Your Local Mosque
        </h3>
        <ul className="space-y-2 text-sm text-muted dark:text-gray-400">
          <li className="flex gap-2">
            <span className="mt-1 text-primary-500">&#8226;</span>
            <span>
              Search for &quot;mosque&quot;, &quot;masjid&quot;, or &quot;Islamic center&quot; in your area
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 text-primary-500">&#8226;</span>
            <span>
              Many mosques welcome new Muslims and have programs specifically for reverts
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 text-primary-500">&#8226;</span>
            <span>
              Don&apos;t be shy to visit during prayer times. The community will be happy to help you
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 text-primary-500">&#8226;</span>
            <span>
              Friday (Jumu&apos;ah) prayer is a great time for your first visit. Arrive early to meet people
            </span>
          </li>
        </ul>
      </div>
    </PageWrapper>
  );
}
