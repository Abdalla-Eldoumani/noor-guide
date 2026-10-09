"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useProgress } from "@/hooks/useProgress";
import { StatusMark, type ModuleStatus } from "@/components/ui/StatusMark";
import type { ModuleSummary } from "@/lib/content";

// The nine modules as a book's contents page: number, title, the Arabic title,
// dot leaders, and what the module asks of the reader.
export function PathContents({ rows, detail = "length" }: { rows: ModuleSummary[]; detail?: "length" | "progress" }) {
  const t = useTranslations("path");
  const locale = useLocale();
  const { progress } = useProgress();
  const number = new Intl.NumberFormat(locale);

  return (
    <ol className="border-y border-rule">
      {rows.map((row) => {
        const doneCount = row.lessons.filter((id) => progress.completedLessons.includes(id)).length;
        const status: ModuleStatus =
          doneCount === row.lessons.length
            ? "done"
            : doneCount > 0 || progress.currentLesson === row.id
              ? "current"
              : "none";
        const meta =
          detail === "progress"
            ? t("lessonsDone", { done: doneCount, total: row.lessons.length })
            : `${t("lessons", { count: row.lessons.length })} · ${t("minutes", { minutes: row.minutes })}`;

        return (
          <li key={row.id} className="border-b border-rule last:border-b-0">
            <Link
              href={`/learn/${row.id}`}
              className="group -mx-3 grid grid-cols-[1.75rem_1fr_1.25rem] items-baseline gap-x-3 rounded-control px-3 py-4 transition-colors duration-150 hover:bg-wash"
            >
              <span className="oldstyle text-body text-ink-2">{number.format(row.number)}</span>
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="basis-full text-body text-ink group-hover:text-fajr sm:basis-auto">
                  {row.title}
                </span>
                {locale !== "ar" && (
                  <span lang="ar" dir="rtl" className="font-quran text-arabic text-ink-2">
                    {row.titleAr}
                  </span>
                )}
                {/* Leader and length wrap together, so a long title pushes both
                    to the next line and the dots still end at the numbers. */}
                <span className="contents sm:flex sm:min-w-40 sm:flex-1 sm:items-baseline sm:gap-x-3">
                  <span aria-hidden="true" className="leader hidden sm:block" />
                  <span className="font-ui text-caption whitespace-nowrap text-ink-2">{meta}</span>
                </span>
              </span>
              <span className="self-center">
                <StatusMark
                  status={status}
                  label={status === "done" ? t("statusDone") : t("statusCurrent")}
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
