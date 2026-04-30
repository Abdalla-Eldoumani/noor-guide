import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Heart,
  ArrowRight,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getLearningModules } from "@/lib/content";
import { MODULE_GLYPHS, GlyphBook } from "@/components/ui/Glyphs";
import { pickLocalized } from "@/lib/content-i18n";

export default async function HomePage() {
  const modules = getLearningModules();
  const locale = await getLocale();
  const tHome = await getTranslations("home");

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary-50/60 to-cream dark:from-gray-900 dark:to-gray-950"
          aria-hidden="true"
        />
        <svg
          className="absolute inset-0 h-full w-full text-primary-500/[0.07] dark:text-primary-300/[0.06]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-girih"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <g transform="translate(28 28)" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="-11" y="-11" width="22" height="22" />
                <rect x="-11" y="-11" width="22" height="22" transform="rotate(45)" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-girih)" />
        </svg>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-display font-heading font-bold text-ink dark:text-gray-100">
            {tHome("heroLine1")}{" "}
            <span className="text-primary-500 dark:text-primary-300">
              {tHome("heroHighlight")}
            </span>
          </h1>
          <p
            dir="rtl"
            lang="ar"
            className="mt-4 font-arabic text-arabic-lg text-primary-500 dark:text-primary-300 opacity-80"
          >
            نور
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-7 py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors"
            >
              {tHome("ctaShahada")}
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
            <Link
              href="/learn/aqeedah"
              className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 dark:border-primary-400 dark:text-primary-300 px-7 py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
            >
              {tHome("ctaExploring")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-500 dark:bg-primary-500/10 dark:text-primary-300 mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-heading font-semibold text-ink dark:text-gray-100">
              {tHome("featureStepByStepTitle")}
            </h3>
            <p className="mt-1 text-sm text-muted dark:text-gray-400">
              {tHome("featureStepByStepBody")}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-500 dark:bg-primary-500/10 dark:text-primary-300 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading font-semibold text-ink dark:text-gray-100">
              {tHome("featureSourcesTitle")}
            </h3>
            <p className="mt-1 text-sm text-muted dark:text-gray-400">
              {tHome("featureSourcesBody")}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-500 dark:bg-primary-500/10 dark:text-primary-300 mb-4">
              <Heart size={24} />
            </div>
            <h3 className="font-heading font-semibold text-ink dark:text-gray-100">
              {tHome("featureFreeTitle")}
            </h3>
            <p className="mt-1 text-sm text-muted dark:text-gray-400">
              {tHome("featureFreeBody")}
            </p>
          </div>
        </div>
      </section>

      {/* Learning Modules */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-h1 font-heading font-bold text-ink dark:text-gray-100 text-center">
          {tHome("modulesHeading")}
        </h2>
        <p className="mt-3 text-muted dark:text-gray-400 text-center max-w-xl mx-auto">
          {tHome("modulesSubheading")}
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Glyph = MODULE_GLYPHS[mod.icon] ?? GlyphBook;
            const moduleTitle =
              pickLocalized<string>(mod, "title", locale) ?? mod.title_en;
            const moduleDescription =
              pickLocalized<string>(mod, "description", locale) ?? mod.description_en;
            return (
              <Link
                key={mod.id}
                href={`/learn/${mod.id}`}
                className="card group block"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-500/10 dark:text-primary-300 shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                    <Glyph size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-ink dark:text-gray-100 group-hover:text-primary-500 dark:group-hover:text-primary-300 transition-colors">
                      {moduleTitle}
                    </h3>
                    {locale !== "ar" && (
                      <p
                        dir="rtl"
                        lang="ar"
                        className="font-arabic text-sm text-muted dark:text-gray-400 mt-0.5"
                      >
                        {mod.title_ar}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted dark:text-gray-400 line-clamp-2">
                  {moduleDescription}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted dark:text-gray-500">
                  <Clock size={14} />
                  <span>
                    {tHome("estimatedMinutes", { minutes: mod.estimatedMinutes })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-3xl p-10 sm:p-14 text-white">
          <h2 className="text-h1 font-heading font-bold">
            {tHome("ctaBeginTitle")}
          </h2>
          <p className="mt-3 text-primary-100 max-w-md mx-auto">
            {tHome("ctaBeginBody")}
          </p>
          <Link
            href="/learn"
            className="mt-8 inline-flex items-center gap-2 bg-white text-primary-600 px-7 py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-primary-50 transition-colors"
          >
            {tHome("ctaBeginButton")}
            <ArrowRight size={20} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </>
  );
}
