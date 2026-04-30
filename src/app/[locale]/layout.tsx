import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { ThemeSync } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
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

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar-ui",
  display: "swap",
});

const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem('noor-settings'));if(s&&s.theme==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    default: "Noor Guide | Learn Islam Step by Step",
    template: "%s | Noor Guide",
  },
  description:
    "A free, step-by-step guide for new Muslims. Learn the basics of Islam: beliefs, prayer, Quran, and daily supplications, backed by authentic sources.",
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
    title: "Noor Guide | Learn Islam Step by Step",
    description:
      "A free, step-by-step guide for new Muslims. Learn beliefs, prayer, Quran, and daily supplications backed by authentic sources.",
    siteName: "Noor Guide",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noor Guide | Learn Islam Step by Step",
    description:
      "A free, step-by-step guide for new Muslims. Learn beliefs, prayer, Quran, and daily supplications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${plusJakarta.variable} ${inter.variable} ${amiri.variable} ${plexArabic.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`bg-cream text-ink min-h-screen flex flex-col ${
          isArabic ? "font-ar-ui" : "font-body"
        }`}
      >
        <script>{themeInitScript}</script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeSync />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
