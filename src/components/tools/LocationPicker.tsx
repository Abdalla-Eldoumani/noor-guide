"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { useGeolocation } from "@/hooks/useGeolocation";
import { parseCoordinates, type GeoErrorCode, type GeoPosition } from "@/lib/geolocation";
import { Button } from "@/components/ui/Button";

const ERROR_KEYS: Record<GeoErrorCode, string> = {
  PERMISSION_DENIED: "errorPermissionDenied",
  POSITION_UNAVAILABLE: "errorUnavailable",
  TIMEOUT: "errorTimeout",
  NOT_SUPPORTED: "errorUnsupported",
};

interface LocationPickerProps {
  onLocationSet: (location: GeoPosition) => void;
  // Offered when a location is already saved and the reader is changing it.
  onCancel?: () => void;
}

export function LocationPicker({ onLocationSet, onCancel }: LocationPickerProps) {
  const t = useTranslations("location");
  const { loading, error, requestLocation } = useGeolocation(onLocationSet);
  const [manual, setManual] = useState("");
  const [invalid, setInvalid] = useState(false);
  const inputId = useId();
  const helpId = useId();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = parseCoordinates(manual);
    setInvalid(!parsed);
    if (parsed) onLocationSet(parsed);
  };

  return (
    <div className="space-y-5 rounded-panel border border-rule px-5 py-5 sm:px-6">
      <h2 className="font-prose text-subsection font-semibold text-ink">{t("setHeading")}</h2>

      <div className="space-y-2">
        <Button onClick={requestLocation} disabled={loading}>
          {loading ? t("detecting") : t("useMyLocation")}
        </Button>
        {error && (
          <p role="alert" className="font-ui text-ui text-clay">
            {t(ERROR_KEYS[error])}
          </p>
        )}
      </div>

      <form onSubmit={submit} className="space-y-2" noValidate>
        <label htmlFor={inputId} className="block font-ui text-ui text-ink">
          {t("manualLabel")}
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            aria-invalid={invalid}
            aria-describedby={helpId}
            className="min-h-11 min-w-0 flex-1 rounded-control border border-ink-2 bg-paper px-3 font-ui text-ui text-ink placeholder:text-ink-2"
          />
          <Button type="submit" variant="outline">
            {t("set")}
          </Button>
        </div>
        <p id={helpId} className={`font-ui text-caption ${invalid ? "text-clay" : "text-ink-2"}`}>
          {invalid ? t("manualInvalid") : t("manualHelp")}
        </p>
      </form>

      {onCancel && (
        <Button variant="quiet" onClick={onCancel} className="-ms-4">
          {t("cancel")}
        </Button>
      )}
    </div>
  );
}
