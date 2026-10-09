"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { Button } from "@/components/ui/Button";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";
import { PrayerPosition, type Posture } from "@/components/learn/PrayerPosition";

export interface StepRecitation {
  label?: string;
  arabic: string;
  transliteration: string;
  translation: string;
  credit?: string;
}

export interface StepData {
  id: string;
  title: string;
  instruction: string;
  position?: { posture: Posture; label: string };
  recitations?: StepRecitation[];
  notes?: string;
  source?: {
    type: "quran" | "hadith" | "scholarly_consensus";
    reference: string;
  };
}

export function StepByStep({ steps }: { steps: StepData[] }) {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const number = new Intl.NumberFormat(locale);
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Move focus to the new step after the reader changes it, never on load.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [current]);

  const goTo = (index: number) => {
    moved.current = true;
    setCurrent(index);
  };

  const finishCurrent = () => {
    setCompleted((prev) => new Set(prev).add(current));
    if (current < steps.length - 1) goTo(current + 1);
  };

  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <div className="space-y-5">
      <ol className="flex flex-wrap gap-1.5" aria-label={t("stepsLabel")}>
        {steps.map((s, index) => {
          const isCurrent = index === current;
          const isDone = completed.has(index);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={t("stepButton", { number: index + 1, title: s.title })}
                className={`flex size-11 items-center justify-center rounded-full font-ui text-ui transition-colors duration-150 ${
                  isCurrent
                    ? "border-2 border-ochre font-semibold text-ink"
                    : isDone
                      ? "border border-sage text-sage"
                      : "border border-rule text-ink-2 hover:border-ink-2"
                }`}
              >
                {isDone && !isCurrent ? (
                  <svg
                    viewBox="0 0 20 20"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                  </svg>
                ) : (
                  number.format(index + 1)
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <section className="space-y-4 rounded-panel border border-rule px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="font-ui text-caption text-ink-2">
            {t("stepIndicator", { current: current + 1, total: steps.length })}
          </p>
          {step.position && <PrayerPosition posture={step.position.posture} label={step.position.label} />}
        </div>

        <h3
          ref={headingRef}
          tabIndex={-1}
          className="font-prose text-subsection font-semibold text-ink outline-none"
        >
          {step.title}
        </h3>

        <p className="text-body text-ink">{step.instruction}</p>

        {step.recitations?.map((rec, index) => (
          <RecitationBlockquote key={index}>
            {rec.label && <p className="font-ui text-caption text-ink-2">{rec.label}</p>}
            <ArabicText
              arabic={rec.arabic}
              transliteration={rec.transliteration}
              translation={rec.translation}
              credit={rec.credit}
            />
          </RecitationBlockquote>
        ))}

        {step.notes && <p className="text-small text-ink-2">{step.notes}</p>}

        {step.source && <SourceReference type={step.source.type} reference={step.source.reference} />}
      </section>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => goTo(current - 1)}
          className={current === 0 ? "invisible" : ""}
        >
          {t("stepPrev")}
        </Button>
        <Button onClick={finishCurrent}>{isLast ? t("stepFinish") : t("stepNext")}</Button>
      </div>
    </div>
  );
}
