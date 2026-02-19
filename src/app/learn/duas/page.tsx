import { getDuasData, getDuaCategories, getLessonIdsForModule } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { DuasClient } from "./DuasClient";

export const metadata = {
  title: "Daily Supplications (Duas) — Noor Guide",
  description:
    "Authentic daily duas (supplications) for everyday moments, sourced from Quran and Sunnah.",
};

export default function DuasPage() {
  const data = getDuasData();
  const categories = getDuaCategories();
  const lessonIds = getLessonIdsForModule("duas");

  return (
    <PageWrapper>
      <DuasClient data={data} categories={categories} lessonIds={lessonIds} />
    </PageWrapper>
  );
}
