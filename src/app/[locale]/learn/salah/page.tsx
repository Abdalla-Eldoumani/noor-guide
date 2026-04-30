import { getSalahData, getSalahSteps, getLessonIdsForModule } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { SalahClient } from "./SalahClient";

export const metadata = {
  title: "How to Pray Salah | Noor Guide",
  description:
    "Complete step-by-step guide to performing salah (Islamic prayer) as taught by the Prophet Muhammad ﷺ.",
};

export default function SalahPage() {
  const data = getSalahData();
  const steps = getSalahSteps();
  const lessonIds = getLessonIdsForModule("salah");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "salah",
          title: "How to Pray Salah",
          description: metadata.description,
        })}
      />
      <SalahClient data={data} steps={steps} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
