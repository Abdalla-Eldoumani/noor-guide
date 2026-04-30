import { getPillarsData, getIslamPillars, getLessonIdsForModule } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { PillarsClient } from "./PillarsClient";

export const metadata = {
  title: "The Five Pillars of Islam | Noor Guide",
  description:
    "Learn the five essential practices of Islam: Shahada, Salah, Zakat, Sawm, and Hajj.",
};

export default function PillarsPage() {
  const data = getPillarsData();
  const pillars = getIslamPillars();
  const lessonIds = getLessonIdsForModule("pillars");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "pillars",
          title: "The Five Pillars of Islam",
          description: metadata.description,
        })}
      />
      <PillarsClient data={data} pillars={pillars} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
