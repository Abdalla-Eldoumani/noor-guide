// Hand-drawn, marginalia-style glyphs used instead of stock icons. Each is a
// 24x24 stroke drawing that takes currentColor.

import type { ReactElement } from "react";

type GlyphProps = {
  className?: string;
  size?: number;
};

type Glyph = (props: GlyphProps) => ReactElement;

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

function glyph(paths: ReactElement): Glyph {
  function Drawn({ className = "", size = 24 }: GlyphProps) {
    return (
      <svg {...svgProps} width={size} height={size} className={className}>
        {paths}
      </svg>
    );
  }
  return Drawn;
}

// A heart with a quiet inner mark.
const GlyphHeart = glyph(
  <>
    <path d="M12 20.5s-6.5-4-6.5-10a3.5 3.5 0 0 1 6.5-2 3.5 3.5 0 0 1 6.5 2c0 6-6.5 10-6.5 10z" />
    <circle cx="12" cy="10.5" r="1.4" />
  </>,
);

// A pointed arch with a smaller mihrab opening.
const GlyphArch = glyph(
  <>
    <path d="M3 21h18" />
    <path d="M5 21V11a7 7 0 0 1 14 0v10" />
    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
  </>,
);

// A water droplet with a highlight curve.
const GlyphDroplet = glyph(
  <>
    <path d="M12 3.5c-3 4-6 7-6 10.5a6 6 0 0 0 12 0c0-3.5-3-6.5-6-10.5z" />
    <path d="M8.5 14a3.5 3.5 0 0 0 1 3" />
  </>,
);

// A mihrab niche with a hanging lamp.
const GlyphMihrab = glyph(
  <>
    <path d="M5 21V12a7 7 0 0 1 14 0v9" />
    <path d="M4 21h16" />
    <path d="M12 8v3" />
    <circle cx="12" cy="13.5" r="1.4" />
  </>,
);

// An open book with its binding.
const GlyphBook = glyph(
  <>
    <path d="M4 5.5l8 2 8-2v13l-8 2-8-2v-13z" />
    <path d="M12 7.5v13" />
  </>,
);

// Two hands raised in supplication.
const GlyphCuppedHands = glyph(
  <>
    <path d="M6 21v-7c0-2.5 1.5-4.5 3.5-4.5v9" />
    <path d="M18 21v-7c0-2.5-1.5-4.5-3.5-4.5v9" />
    <path d="M11 9.5h2" />
  </>,
);

// An ewer, the jug kept for washing.
const GlyphEwer = glyph(
  <>
    <path d="M9.5 3.5h5" />
    <path d="M10.5 3.5v2.8C8 7.4 6.5 9.8 6.5 12.8c0 3.6 2.4 6.7 5.5 6.7s5.5-3.1 5.5-6.7c0-3-1.5-5.4-4-6.5V3.5" />
    <path d="M17.2 10.5c1.6-.2 2.6-1.4 2.8-3.2" />
    <path d="M8.5 20.5h7" />
  </>,
);

// A prayer mat with its arch.
const GlyphPrayerMat = glyph(
  <>
    <path d="M6.5 3.5h11v17h-11z" />
    <path d="M9.5 11.5V9.8a2.5 2.5 0 0 1 5 0v1.7z" />
    <path d="M9 15.5h6" />
    <path d="M9 18h6" />
  </>,
);

// A crescent moon.
const GlyphCrescent = glyph(
  <path d="M15.2 4.2a8 8 0 1 0 4.6 12.6A6.6 6.6 0 1 1 15.2 4.2z" />,
);

// The sun at the horizon, for prayer times.
const GlyphDawn = glyph(
  <>
    <path d="M3 17.5h18" />
    <path d="M7 17.5a5 5 0 0 1 10 0" />
    <path d="M12 6.5v3" />
    <path d="M5.4 9.9l2 2" />
    <path d="M18.6 9.9l-2 2" />
    <path d="M8 20.5h8" />
  </>,
);

// A compass needle pointing to a small square, for the qibla.
const GlyphQibla = glyph(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 12l3.6-3.6" />
    <path d="M15.1 6.4h2.5v2.5h-2.5z" />
    <circle cx="12" cy="12" r="0.9" />
  </>,
);

// A domed mosque with its door.
const GlyphMosque = glyph(
  <>
    <path d="M3.5 20.5h17" />
    <path d="M6 20.5V14h12v6.5" />
    <path d="M6.5 14a5.5 5.5 0 0 1 11 0" />
    <path d="M12 8.5V6" />
    <path d="M10.5 20.5v-3a1.5 1.5 0 0 1 3 0v3" />
  </>,
);

export const MODULE_GLYPHS: Record<string, Glyph> = {
  aqeedah: GlyphHeart,
  pillars: GlyphArch,
  wudu: GlyphDroplet,
  salah: GlyphMihrab,
  surahs: GlyphBook,
  duas: GlyphCuppedHands,
  taharah: GlyphEwer,
  "prayer-practice": GlyphPrayerMat,
  janazah: GlyphCrescent,
};

export const TOOL_GLYPHS: Record<string, Glyph> = {
  prayerTimes: GlyphDawn,
  qibla: GlyphQibla,
  masjidFinder: GlyphMosque,
};
