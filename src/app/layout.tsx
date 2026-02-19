import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Amiri } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FEFCF3" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Noor Guide — Your Journey of Light",
    template: "%s — Noor Guide",
  },
  description:
    "A free, gentle, step-by-step guide for new Muslims. Learn the basics of Islam — beliefs, prayer, Quran, and daily supplications — backed by authentic sources.",
  keywords: [
    "new Muslim",
    "revert",
    "Islam guide",
    "how to pray",
    "Shahada",
    "learn Islam",
    "Quran for beginners",
    "wudu",
    "salah",
    "Islamic prayer",
  ],
  openGraph: {
    title: "Noor Guide — Your Journey of Light",
    description:
      "A free, step-by-step guide for new Muslims. Learn beliefs, prayer, Quran, and daily supplications backed by authentic sources.",
    siteName: "Noor Guide",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noor Guide — Your Journey of Light",
    description:
      "A free, step-by-step guide for new Muslims. Learn beliefs, prayer, Quran, and daily supplications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${plusJakarta.variable} ${inter.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-cream text-ink font-body min-h-screen flex flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
