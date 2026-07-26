import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { ThemeSync } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
import { fontClassFor } from "@/lib/fonts";
import "@/styles/globals.css";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const name = t("name");
  const defaultTitle = `${name} | ${t("subtitle")}`;

  return {
    // Without this, every absolute OG and Twitter image URL resolves against
    // the build-time localhost default.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://noorguide.app"),
    title: {
      default: defaultTitle,
      // Pages supply their own bare title; the site name is appended here and
      // must not be repeated in the page metadata.
      template: `%s | ${name}`,
    },
    description: t("description"),
    keywords: tMeta.raw("keywords") as string[],
    openGraph: {
      title: defaultTitle,
      description: t("description"),
      siteName: name,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

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
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={fontClassFor(locale)}
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
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
          >
            {tCommon("skipToContent")}
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
