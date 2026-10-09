import { Literata, IBM_Plex_Sans, Amiri, Noto_Naskh_Arabic } from "next/font/google";

// Literata sets headings and lesson prose, with its real italic for
// transliteration. Plex sets labels and controls. Amiri sets the Qur'an and
// Arabic display text, and Noto Naskh Arabic sets the Arabic interface.

export const literata = Literata({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-literata",
  display: "swap",
});

// Only transliteration is italic, and only lessons have it, so the italic is
// fetched when a page uses it rather than preloaded everywhere.
export const literataItalic = Literata({
  subsets: ["latin"],
  style: "italic",
  axes: ["opsz"],
  variable: "--font-literata-italic",
  display: "swap",
  preload: false,
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

export const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-amiri",
  display: "swap",
});

// Preloading it would make every English and French page download it too.
export const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
  preload: false,
});

export function fontClassFor(locale: string): string {
  return locale === "ar"
    ? `${naskh.variable} ${amiri.variable}`
    : `${literata.variable} ${literataItalic.variable} ${plexSans.variable} ${amiri.variable}`;
}
