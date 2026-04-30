// Hand-drawn marginalia-style glyphs used in place of generic icons for the
// six learning modules. Each glyph is a 24x24 stroke composition that inherits
// currentColor and the size of its container.

type GlyphProps = {
  className?: string;
  size?: number;
};

const baseSvgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

// Aqeedah: a stylized heart with a quiet inner mark.
export function GlyphHeart({ className = "", size = 24 }: GlyphProps) {
  return (
    <svg {...baseSvgProps} width={size} height={size} className={className}>
      <path d="M12 20.5s-6.5-4-6.5-10a3.5 3.5 0 0 1 6.5-2 3.5 3.5 0 0 1 6.5 2c0 6-6.5 10-6.5 10z" />
      <circle cx="12" cy="10.5" r="1.4" />
    </svg>
  );
}

// Pillars: a pointed Islamic arch with a smaller mihrab opening.
export function GlyphArch({ className = "", size = 24 }: GlyphProps) {
  return (
    <svg {...baseSvgProps} width={size} height={size} className={className}>
      <path d="M3 21h18" />
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    </svg>
  );
}

// Wudu: a water droplet with a small highlight curve.
export function GlyphDroplet({ className = "", size = 24 }: GlyphProps) {
  return (
    <svg {...baseSvgProps} width={size} height={size} className={className}>
      <path d="M12 3.5c-3 4-6 7-6 10.5a6 6 0 0 0 12 0c0-3.5-3-6.5-6-10.5z" />
      <path d="M8.5 14a3.5 3.5 0 0 0 1 3" />
    </svg>
  );
}

// Salah: a mihrab niche silhouette with a hanging lamp.
export function GlyphMihrab({ className = "", size = 24 }: GlyphProps) {
  return (
    <svg {...baseSvgProps} width={size} height={size} className={className}>
      <path d="M5 21V12a7 7 0 0 1 14 0v9" />
      <path d="M4 21h16" />
      <path d="M12 8v3" />
      <circle cx="12" cy="13.5" r="1.4" />
    </svg>
  );
}

// Surahs: an open book outline with a center binding line.
export function GlyphBook({ className = "", size = 24 }: GlyphProps) {
  return (
    <svg {...baseSvgProps} width={size} height={size} className={className}>
      <path d="M4 5.5l8 2 8-2v13l-8 2-8-2v-13z" />
      <path d="M12 7.5v13" />
    </svg>
  );
}

// Duas: two cupped hands raised in supplication, abstracted as upward curves.
export function GlyphCuppedHands({ className = "", size = 24 }: GlyphProps) {
  return (
    <svg {...baseSvgProps} width={size} height={size} className={className}>
      <path d="M6 21v-7c0-2.5 1.5-4.5 3.5-4.5v9" />
      <path d="M18 21v-7c0-2.5-1.5-4.5-3.5-4.5v9" />
      <path d="M11 9.5h2" />
    </svg>
  );
}

// Map of module-icon ids to glyph components. The id strings match the values
// in src/data/content/learning-path.json so the dashboard and home page can
// look up the right glyph by id.
export const MODULE_GLYPHS: Record<string, (props: GlyphProps) => JSX.Element> = {
  heart: GlyphHeart,
  building: GlyphArch,
  droplets: GlyphDroplet,
  moon: GlyphMihrab,
  "book-open": GlyphBook,
  hands: GlyphCuppedHands,
};
