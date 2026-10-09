import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getModuleSummaries } from "@/lib/content";
import { PathContents } from "@/components/learn/PathContents";
import { ToolRows } from "@/components/tools/ToolRows";

const DOORS = [
  { href: "/learn", key: "shahada" },
  { href: "/learn/aqeedah", key: "exploring" },
] as const;

// Taking the locale from `params` rather than request state is what lets this
// page prerender.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const rows = getModuleSummaries(locale);

  return (
    <div className="mx-auto w-full max-w-book px-5 sm:px-8">
      <section className="pt-12 sm:pt-20">
        <h1 className="text-balance font-prose text-display-sm font-medium text-ink sm:text-display">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-prose text-body text-ink-2">{t("subline")}</p>
      </section>

      <section aria-label={t("doorsLabel")} className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
        {DOORS.map((door) => (
          <Link
            key={door.key}
            href={door.href}
            className="group flex flex-col rounded-panel border border-rule px-5 py-5 transition-colors duration-150 hover:border-fajr sm:px-6 sm:py-6"
          >
            <span className="font-prose text-subsection font-semibold text-ink group-hover:text-fajr">
              {t(`${door.key}Title`)}
            </span>
            <span className="mt-2 text-small text-ink-2">{t(`${door.key}Body`)}</span>
            <span aria-hidden="true" className="mt-4 font-ui text-ui text-fajr">
              {t(`${door.key}Action`)}
              <span className="ms-1.5 inline-block rtl:-scale-x-100">→</span>
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="path-heading" className="mt-16 sm:mt-20">
        <h2 id="path-heading" className="font-prose text-section font-semibold text-ink">
          {t("pathHeading")}
        </h2>
        <p className="mt-2 text-small text-ink-2">{t("pathIntro")}</p>
        <div className="mt-6">
          <PathContents rows={rows} />
        </div>
      </section>

      <section aria-labelledby="tools-heading" className="mt-16 sm:mt-20">
        <h2 id="tools-heading" className="font-prose text-section font-semibold text-ink">
          {t("toolsHeading")}
        </h2>
        <div className="mt-6">
          <ToolRows />
        </div>
      </section>

      <section aria-labelledby="sources-heading" className="mt-16 sm:mt-20">
        <GirihBand />
        <h2 id="sources-heading" className="mt-10 font-prose text-section font-semibold text-ink">
          {t("sourcesHeading")}
        </h2>
        <div className="mt-4 max-w-prose space-y-4 text-body text-ink">
          <p>{t("sourcesQuran")}</p>
          <p>{t("sourcesHadith")}</p>
          <p>{t("sourcesReview")}</p>
        </div>
      </section>
    </div>
  );
}

// The site's one ornament: a strip of the eight-pointed girih tile.
function GirihBand() {
  return (
    <svg
      aria-hidden="true"
      className="block h-8 w-full text-rule"
      // Whole tiles only where round() is supported, so the band never ends on half a star.
      style={{ width: "round(down, 100%, 32px)" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="girih-band" width="32" height="32" patternUnits="userSpaceOnUse">
          <g transform="translate(16 16)" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="-10" y="-10" width="20" height="20" />
            <rect x="-10" y="-10" width="20" height="20" transform="rotate(45)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girih-band)" />
    </svg>
  );
}
