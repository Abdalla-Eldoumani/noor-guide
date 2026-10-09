"use client";

import { useId, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useSettings } from "@/hooks/useSettings";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { PRAYER_METHODS } from "@/config/prayer-methods";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { LocationBar, LocationPrivacy } from "@/components/tools/LocationBar";
import { PrayerTimesDisplay } from "@/components/tools/PrayerTimesDisplay";

// "DD-MM-YYYY" as AlAdhan writes it.
function parseDay(value: string): Date {
  const [dd, mm, yyyy] = value.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export function PrayerTimesClient() {
  const t = useTranslations("prayerTimes");
  const tMethods = useTranslations("prayerMethods");
  const format = useFormatter();
  const methodId = useId();
  const { location, prayerMethod, setLocation, setPrayerMethod } = useSettings();
  const [editing, setEditing] = useState(false);
  const { day, nextPrayer, loading, error } = usePrayerTimes(
    location?.lat ?? null,
    location?.lng ?? null,
    prayerMethod,
  );

  const showTimes = location && !editing;

  return (
    <div className="mt-8 space-y-8">
      <div className="space-y-3">
        {showTimes ? (
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

      {showTimes && (
        <>
          <div className="space-y-2">
            <label htmlFor={methodId} className="block font-ui text-ui text-ink">
              {t("calculationMethod")}
            </label>
            <select
              id={methodId}
              value={prayerMethod}
              onChange={(e) => setPrayerMethod(Number(e.target.value))}
              className="min-h-11 w-full max-w-md truncate rounded-control border border-ink-2 bg-paper px-3 font-ui text-ui text-ink"
            >
              {PRAYER_METHODS.map((method) => (
                <option key={method.id} value={method.id}>
                  {tMethods(method.key)}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <p role="status" className="font-ui text-ui text-ink-2">
              {t("loading")}
            </p>
          )}

          {error && !loading && (
            <div role="alert" className="space-y-1 rounded-panel border border-clay px-4 py-3 font-ui text-ui">
              <p className="text-clay">{t(error === "network" ? "errorNetwork" : "errorService")}</p>
              <p className="text-ink-2">{t("errorRetry")}</p>
            </div>
          )}

          {day && !loading && !error && (
            <section className="space-y-4">
              {day.stale && (
                <p className="rounded-panel border border-rule px-4 py-3 font-ui text-ui text-ink-2">
                  {t("staleNote", { date: format.dateTime(parseDay(day.date), { dateStyle: "long" }) })}
                </p>
              )}
              <PrayerTimesDisplay timings={day.timings} nextPrayer={day.stale ? null : nextPrayer} />
              {day.timezone && (
                <p className="font-ui text-caption text-ink-2">
                  {t.rich("timezoneNote", {
                    timezone: day.timezone,
                    zone: (chunks) => (
                      <span dir="ltr" lang="en">
                        {chunks}
                      </span>
                    ),
                  })}
                </p>
              )}
              <p className="text-small text-ink-2">{t("footerNote")}</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
