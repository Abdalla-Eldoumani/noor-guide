import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tSite = useTranslations("site");
  const locale = useLocale();

  return (
    <footer className="mx-auto w-full max-w-book px-5 pb-28 pt-16 sm:px-8 md:pb-12">
      <div className="space-y-2 border-t border-rule pt-6 font-ui text-caption text-ink-2">
        <p className="flex items-baseline gap-2 font-prose text-small text-ink">
          {tSite("name")}
          {locale !== "ar" && (
            <span lang="ar" dir="rtl" className="font-quran text-ink-2">
              نور
            </span>
          )}
        </p>
        <p>{t("sourcesNote")}</p>
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
