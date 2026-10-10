import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { absoluteUrl } from "@/lib/site";
import { PrayerTimesClient } from "./PrayerTimesClient";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "prayerTimes" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { canonical: absoluteUrl(locale, "/tools/prayer-times") },
  };
}

export default async function PrayerTimesPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "prayerTimes" });
  const tCrumb = await getTranslations({ locale, namespace: "breadcrumb" });

  return (
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: tCrumb("home"), href: "/" },
          { label: tCrumb("tools"), href: "/tools" },
          { label: tCrumb("prayerTimes") },
        ]}
      />
      <h1 className="mt-6 font-prose text-title-sm font-semibold text-ink sm:text-title">{t("title")}</h1>
      <p className="mt-3 max-w-prose text-body text-ink-2">{t("subtitle")}</p>
      <PrayerTimesClient />
    </PageWrapper>
  );
}
