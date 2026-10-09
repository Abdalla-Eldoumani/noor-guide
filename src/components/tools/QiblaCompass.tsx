"use client";

import { useLocale, useTranslations } from "next-intl";

const C = 120;

const point = (degrees: number, radius: number) => {
  const r = (degrees * Math.PI) / 180;
  return { x: C + radius * Math.sin(r), y: C - radius * Math.cos(r) };
};

// Drawn from coordinates rather than rotated with CSS. SVG geometry does not
// mirror under `dir="rtl"`, so east stays on the right on `/ar` as well.
export function QiblaCompass({ bearing }: { bearing: number }) {
  const t = useTranslations("qibla");
  const tCompass = useTranslations("compass");
  const locale = useLocale();
  const shown = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(bearing);

  const tip = point(bearing, 86);
  const arcEnd = point(bearing, 58);
  const largeArc = bearing > 180 ? 1 : 0;
  const cardinals = [
    { key: "north", deg: 0 },
    { key: "east", deg: 90 },
    { key: "south", deg: 180 },
    { key: "west", deg: 270 },
  ] as const;

  return (
    <figure className="flex flex-col items-center gap-5">
      <svg
        viewBox="0 0 240 240"
        role="img"
        aria-label={t("directionStatement", { bearing: shown })}
        className="size-60 sm:size-72"
      >
        <circle cx={C} cy={C} r={108} fill="none" stroke="var(--color-rule)" strokeWidth={1.5} />
        {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
          const major = deg % 90 === 0;
          const a = point(deg, 108);
          const b = point(deg, major ? 98 : 103);
          return (
            <line
              key={deg}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--color-ink-2)"
              strokeWidth={major ? 1.5 : 1}
              strokeOpacity={major ? 1 : 0.5}
            />
          );
        })}
        {cardinals.map(({ key, deg }) => {
          const p = point(deg, 84);
          return (
            <text
              key={key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="font-ui"
              fontSize={15}
              fontWeight={key === "north" ? 600 : 400}
              fill={key === "north" ? "var(--color-fajr)" : "var(--color-ink-2)"}
            >
              {tCompass(key)}
            </text>
          );
        })}
        {bearing > 0.5 && (
          <path
            d={`M ${C} ${C - 58} A 58 58 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`}
            fill="none"
            stroke="var(--color-ochre)"
            strokeWidth={2}
          />
        )}
        <line x1={C} y1={C} x2={tip.x} y2={tip.y} stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" />
        <rect
          x={tip.x - 6}
          y={tip.y - 6}
          width={12}
          height={12}
          fill="var(--color-ink)"
          transform={`rotate(${bearing} ${tip.x} ${tip.y})`}
        />
        <circle cx={C} cy={C} r={4} fill="var(--color-ink)" />
      </svg>
      <figcaption className="text-center">
        <span className="block font-prose text-title-sm font-semibold text-ink">
          <span dir="ltr">{shown}°</span>
        </span>
        <span className="mt-1 block font-ui text-ui text-ink-2">{t("fromNorth")}</span>
      </figcaption>
    </figure>
  );
}
