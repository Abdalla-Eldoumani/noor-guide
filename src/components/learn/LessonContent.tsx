"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useProgress } from "@/hooks/useProgress";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { StatusMark } from "@/components/ui/StatusMark";
import { MODULE_GLYPHS } from "@/components/ui/Glyphs";
import type { ModuleNav } from "@/lib/content";

interface LessonContentProps {
  nav: ModuleNav;
  title: string;
  titleAr?: string;
  // These lessons set out acts on which the schools differ in detail; say so before the reader starts.
  schoolsNote?: boolean;
  children: ReactNode;
}

export function LessonContent({ nav, title, titleAr, schoolsNote, children }: LessonContentProps) {
  const t = useTranslations("lesson");
  const tCrumb = useTranslations("breadcrumb");
  const { progress, visit, completeLessons } = useProgress();

  useEffect(() => {
    visit(nav.moduleId);
  }, [nav.moduleId, visit]);

  const done = nav.lessonIds.every((id) => progress.completedLessons.includes(id));
  const Glyph = MODULE_GLYPHS[nav.moduleId];

  return (
    <article>
      <Breadcrumb
        items={[
          { label: tCrumb("home"), href: "/" },
          { label: tCrumb("learn"), href: "/learn" },
          { label: title },
        ]}
      />

      <header className="mt-6">
        <p className="flex items-center gap-2 font-ui text-caption text-ink-2">
          {Glyph && <Glyph size={20} />}
          {t("partOf", { number: nav.number, total: nav.total })}
        </p>
        <h1 className="mt-3 text-balance font-prose text-title-sm font-semibold text-ink sm:text-title">
          {title}
        </h1>
        {titleAr && (
          <p className="mt-1">
            <span lang="ar" dir="rtl" className="font-quran text-section text-ink-2">
              {titleAr}
            </span>
          </p>
        )}
        {schoolsNote && (
          <p className="mt-6 rounded-panel border border-rule px-4 py-3 font-ui text-ui text-ink-2">
            {t("schoolsNote")}
          </p>
        )}
      </header>

      <div className="mt-10 space-y-14">{children}</div>

      <footer className="mt-16 border-t border-rule pt-8">
        {done ? (
          <p className="flex items-center gap-2 font-ui text-ui text-ink">
            <StatusMark status="done" />
            {t("alreadyComplete")}
          </p>
        ) : (
          <Button onClick={() => completeLessons(nav.lessonIds)}>{t("markComplete")}</Button>
        )}

        {(nav.prev || nav.next) && (
          <nav aria-label={t("pagerLabel")} className="mt-10 grid gap-3 sm:grid-cols-2">
            {nav.prev && (
              <Link
                href={nav.prev.href}
                className="group rounded-panel border border-rule px-4 py-3 transition-colors duration-150 hover:border-fajr"
              >
                <span className="block font-ui text-caption text-ink-2">
                  {t("partNumber", { number: nav.number - 1 })}
                </span>
                <span className="mt-1 block text-small text-ink group-hover:text-fajr">
                  <span aria-hidden="true" className="me-1 inline-block rtl:-scale-x-100">
                    ←
                  </span>
                  {nav.prev.title}
                </span>
              </Link>
            )}
            {nav.next && (
              <Link
                href={nav.next.href}
                className="group rounded-panel border border-rule px-4 py-3 text-end transition-colors duration-150 hover:border-fajr sm:col-start-2"
              >
                <span className="block font-ui text-caption text-ink-2">
                  {t("partNumber", { number: nav.number + 1 })}
                </span>
                <span className="mt-1 block text-small text-ink group-hover:text-fajr">
                  {nav.next.title}
                  <span aria-hidden="true" className="ms-1 inline-block rtl:-scale-x-100">
                    →
                  </span>
                </span>
              </Link>
            )}
          </nav>
        )}
      </footer>
    </article>
  );
}
