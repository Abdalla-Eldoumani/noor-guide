import { Plus_Jakarta_Sans, Inter, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";

// Declared once and shared. The locale layout and the root not-found boundary
// both build the document shell, and two separate declarations of the same
// family would emit two preload links for the same file.

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar-ui",
  display: "swap",
});

// The Latin faces are dead weight on Arabic and the Arabic UI face is dead
// weight everywhere else, so each locale loads only what it renders.
export function fontClassFor(locale: string): string {
  return locale === "ar"
    ? `${amiri.variable} ${plexArabic.variable}`
    : `${plusJakarta.variable} ${inter.variable} ${amiri.variable}`;
}
