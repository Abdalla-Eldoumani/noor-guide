import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ToolRows } from "@/components/tools/ToolRows";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ToolsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools" });
  const tCrumb = await getTranslations({ locale, namespace: "breadcrumb" });

  return (
    <PageWrapper>
      <Breadcrumb items={[{ label: tCrumb("home"), href: "/" }, { label: tCrumb("tools") }]} />
      <h1 className="mt-6 font-prose text-title-sm font-semibold text-ink sm:text-title">{t("title")}</h1>
      <p className="mt-3 max-w-prose text-body text-ink-2">{t("subtitle")}</p>
      <div className="mt-8">
        <ToolRows />
      </div>
    </PageWrapper>
  );
}
