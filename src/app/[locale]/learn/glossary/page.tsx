import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGlossaryTerms, getArabicPhrases } from "@/lib/content";
import { pickLocalized } from "@/lib/content-i18n";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GlossaryClient } from "./GlossaryClient";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "glossary" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GlossaryPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "glossary" });
  const tCrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const pick = (obj: object, field: string) => pickLocalized<string>(obj, field, locale) ?? "";

  const terms = getGlossaryTerms().map((term) => ({
    id: term.id,
    term: pick(term, "term"),
    termAr: term.term_ar,
    definition: pick(term, "definition"),
  }));
  const phrases = getArabicPhrases().map((phrase) => ({
    id: phrase.id,
    arabic: phrase.phrase_ar,
    transliteration: phrase.transliteration,
    translation: pick(phrase, "translation"),
    usage: pick(phrase, "usage"),
  }));

  return (
    <PageWrapper>
      <Breadcrumb
        items={[
          { label: tCrumb("home"), href: "/" },
          { label: tCrumb("learn"), href: "/learn" },
          { label: tCrumb("glossary") },
        ]}
      />
      <h1 className="mt-6 font-prose text-title-sm font-semibold text-ink sm:text-title">{t("title")}</h1>
      <p className="mt-3 max-w-prose text-body text-ink-2">{t("subtitle")}</p>
      <GlossaryClient terms={terms} phrases={phrases} />
    </PageWrapper>
  );
}
