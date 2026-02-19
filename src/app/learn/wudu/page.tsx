import {
  getWuduData,
  getWuduSteps,
  getWuduBreakers,
  getLessonIdsForModule,
} from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { WuduClient } from "./WuduClient";

export const metadata = {
  title: "How to Perform Wudu — Noor Guide",
  description:
    "Step-by-step guide to performing wudu (ablution) before prayer, based on authentic Sunnah.",
};

export default function WuduPage() {
  const data = getWuduData();
  const steps = getWuduSteps();
  const breakers = getWuduBreakers();
  const lessonIds = getLessonIdsForModule("wudu");

  return (
    <PageWrapper>
      <WuduClient data={data} steps={steps} breakers={breakers} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
