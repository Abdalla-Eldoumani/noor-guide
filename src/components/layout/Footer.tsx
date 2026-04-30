import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tSite = useTranslations("site");

  return (
    <footer className="bg-primary-600 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-heading font-semibold text-lg">
          {tSite("name")}{" "}
          <span dir="rtl" lang="ar" className="font-arabic text-accent-400">
            | نور
          </span>
        </p>
        <p className="mt-2 text-sm text-primary-200">{t("verifiedNote")}</p>
        <p className="mt-3 text-xs text-primary-300">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
