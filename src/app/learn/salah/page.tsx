import { getSalahData, getSalahSteps, getLessonIdsForModule } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SalahClient } from "./SalahClient";

export const metadata = {
  title: "How to Pray Salah — Noor Guide",
  description:
    "Complete step-by-step guide to performing salah (Islamic prayer) as taught by the Prophet Muhammad ﷺ.",
};

export default function SalahPage() {
  const data = getSalahData();
  const steps = getSalahSteps();
  const lessonIds = getLessonIdsForModule("salah");

  return (
    <PageWrapper>
      <SalahClient data={data} steps={steps} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
