import { getSurahsData, getSurahs, getLessonIdsForModule } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SurahsClient } from "./SurahsClient";

export const metadata = {
  title: "Essential Surahs for Prayer — Noor Guide",
  description:
    "Learn the essential short surahs from the Quran needed for your daily prayers, starting with Al-Fatiha.",
};

export default function SurahsPage() {
  const data = getSurahsData();
  const surahs = getSurahs();
  const lessonIds = getLessonIdsForModule("surahs");

  return (
    <PageWrapper>
      <SurahsClient data={data} surahs={surahs} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
