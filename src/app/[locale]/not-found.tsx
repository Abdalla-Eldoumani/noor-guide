import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarOctagram } from "@/components/ui/StarOctagram";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="mx-auto w-full max-w-book px-5 pt-16 sm:px-8 sm:pt-24">
      <StarOctagram size={56} className="text-ochre" />
      <h1 className="mt-6 font-prose text-title-sm font-semibold text-ink sm:text-title">{t("title")}</h1>
      <p className="mt-3 max-w-prose text-body text-ink-2">{t("body")}</p>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-ui text-ui">
        <li>
          <Link href="/" className="text-link inline-flex min-h-11 items-center">
            {t("home")}
          </Link>
        </li>
        <li>
          <Link href="/learn" className="text-link inline-flex min-h-11 items-center">
            {t("learn")}
          </Link>
        </li>
      </ul>
    </div>
  );
}
