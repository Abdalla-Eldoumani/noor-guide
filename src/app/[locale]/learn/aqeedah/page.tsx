import { getAqeedahData, getAqeedahPillars, getLessonIdsForModule } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { lessonJsonLd } from "@/components/seo/lessonJsonLd";
import { AqeedahClient } from "./AqeedahClient";

export const metadata = {
  title: "The Six Pillars of Iman | Noor Guide",
  description:
    "Learn the six foundational beliefs of Islam: belief in Allah, His angels, His books, His messengers, the Last Day, and Divine Decree.",
};

export default function AqeedahPage() {
  const data = getAqeedahData();
  const pillars = getAqeedahPillars();
  const lessonIds = getLessonIdsForModule("aqeedah");

  return (
    <PageWrapper>
      <JsonLd
        data={lessonJsonLd({
          id: "aqeedah",
          title: "The Six Pillars of Iman",
          description: metadata.description,
        })}
      />
      <AqeedahClient data={data} pillars={pillars} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
