import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { routing } from "@/i18n/routing";
import { fontClassFor } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#12161f" },
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
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      // Pages give a bare title; the site name is added here.
      template: `%s | ${name}`,
    },
    description: t("description"),
    keywords: tMeta.raw("keywords") as string[],
    alternates: { canonical: "./" },
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

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={fontClassFor(locale)}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            className="sr-only font-ui text-ui focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-control focus:bg-ink focus:px-4 focus:py-2.5 focus:text-paper"
          >
            {tCommon("skipToContent")}
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
