import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Clock, Compass, MapPin } from "lucide-react";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  return { title: t("title"), description: t("subtitle") };
}

const TOOLS = [
  { href: "/tools/prayer-times", key: "prayerTimes", icon: Clock },
  { href: "/tools/qibla", key: "qibla", icon: Compass },
  { href: "/tools/masjid-finder", key: "masjidFinder", icon: MapPin },
] as const;

export default async function ToolsPage({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  const tCrumb = await getTranslations({ locale, namespace: "breadcrumb" });

  return (
    <PageWrapper>
      <Breadcrumb
        items={[{ label: tCrumb("home"), href: "/" }, { label: tCrumb("tools") }]}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted dark:text-gray-400">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-2xl border border-gray-200 bg-surface p-6 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-100 dark:bg-primary-900/30 dark:group-hover:bg-primary-900/50">
                <Icon size={24} />
              </div>
              <h2 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
                {t(`${tool.key}Title`)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted dark:text-gray-400">
                {t(`${tool.key}Body`)}
              </p>
            </Link>
          );
        })}
      </div>
    </PageWrapper>
  );
}
