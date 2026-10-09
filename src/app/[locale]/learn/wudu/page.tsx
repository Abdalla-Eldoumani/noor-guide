import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getWuduData,
  getWuduSteps,
  getWuduBreakers,
  getWuduObligations,
  getWuduSunan,
  getModuleById,
  getModuleNav,
  type ModuleNav,
} from "@/lib/content";
import { pickLocalized, useTranslationCredit } from "@/lib/content-i18n";
import { moduleMetadata } from "@/lib/module-metadata";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { LessonContent } from "@/components/learn/LessonContent";
import { HadithBlock } from "@/components/learn/HadithBlock";
import { RulingList } from "@/components/learn/RulingList";
import { StepByStep, type StepData } from "@/components/learn/StepByStep";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  return moduleMetadata("wudu", locale);
}

export default async function WuduPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const moduleData = getModuleById("wudu");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "wudu",
          title: pickLocalized<string>(moduleData, "title", locale) ?? "",
          description: pickLocalized<string>(moduleData, "description", locale) ?? "",
          locale,
          courseName: tLearn("dashboardTitle"),
        })}
      />
      <WuduLesson nav={getModuleNav("wudu", locale)} />
    </PageWrapper>
  );
}

function WuduLesson({ nav }: { nav: ModuleNav }) {
  const locale = useLocale();
  const t = useTranslations("wudu");
  const credit = useTranslationCredit();
  const data = getWuduData();
  const pick = <T = string,>(obj: object | undefined, field: string) => pickLocalized<T>(obj, field, locale);

  const steps: StepData[] = getWuduSteps().map((step) => {
    const notes = pick(step, "notes");
    const repeat = step.repetitions ? t("repeat", { count: step.repetitions }) : undefined;
    const translation = step.content ? pick(step.content, "translation") : undefined;
    return {
      id: step.id,
      title: pick(step, "title") ?? step.title_en,
      instruction: pick(step, "instruction") ?? step.instruction_en,
      recitations:
        step.content && translation
          ? [
              {
                arabic: step.content.arabic,
                transliteration: step.content.transliteration,
                translation,
                credit: credit(step.content.translation_provenance),
              },
            ]
          : undefined,
      notes: [notes, repeat].filter(Boolean).join(" ") || undefined,
      source: step.source && { type: step.source.type, reference: step.source.reference },
    };
  });

  return (
    <LessonContent
      nav={nav}
      title={pick(data, "title") ?? data.title_en}
      titleAr={locale === "ar" ? undefined : data.title_ar}
      schoolsNote
    >
      <section className="space-y-6">
        <p className="text-body text-ink">{pick(data.introduction, "content")}</p>
        <HadithBlock
          text={pick(data.introduction.source, "text") ?? data.introduction.source.text_en}
          reference={data.introduction.source.reference}
          grade={data.introduction.source.grade}
          provenance={data.introduction.source.translation_provenance}
        />
      </section>

      <section>
        <h2 className="font-prose text-section font-semibold text-ink">{t("prereqHeading")}</h2>
        <ul className="mt-4 list-disc space-y-2 ps-5 text-body text-ink marker:text-ink-2">
          {(pick<string[]>(data, "prerequisites") ?? data.prerequisites).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-5 font-prose text-section font-semibold text-ink">{t("stepsHeading")}</h2>
        <StepByStep steps={steps} />
      </section>

      {data.dua_after_wudu.verified && (
        <section>
          <h2 className="mb-5 font-prose text-section font-semibold text-ink">{t("duaHeading")}</h2>
          <RecitationBlockquote>
            <ArabicText
              arabic={data.dua_after_wudu.arabic}
              transliteration={data.dua_after_wudu.transliteration}
              translation={pick(data.dua_after_wudu, "translation") ?? data.dua_after_wudu.translation}
              credit={credit(data.dua_after_wudu.translation_provenance)}
            />
            <SourceReference
              type={data.dua_after_wudu.source.type}
              reference={data.dua_after_wudu.source.reference}
            />
          </RecitationBlockquote>
        </section>
      )}

      <RulingList heading={pick(data, "obligations_heading") ?? data.obligations_heading} items={getWuduObligations()} />
      <RulingList heading={pick(data, "sunan_heading") ?? data.sunan_heading} items={getWuduSunan()} />

      <p className="rounded-panel border border-rule px-4 py-3 font-ui text-ui text-ink-2">
        {pick(data, "madhab_note") ?? data.madhab_note}
      </p>

      <section>
        <h2 className="font-prose text-section font-semibold text-ink">{t("breakersHeading")}</h2>
        <ul className="mt-5 list-disc space-y-5 ps-5 marker:text-ink-2">
          {getWuduBreakers().map((breaker) => {
            const notes = pick(breaker, "notes");
            return (
              <li key={breaker.id} className="space-y-1.5">
                <p className="text-body text-ink">{pick(breaker, "description") ?? breaker.description}</p>
                {notes && <p className="text-small text-ink-2">{notes}</p>}
                {breaker.source && <SourceReference type="hadith" reference={breaker.source} />}
              </li>
            );
          })}
        </ul>
      </section>
    </LessonContent>
  );
}
