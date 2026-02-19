import { getLearningModules } from "@/lib/content";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LearnDashboardClient } from "./LearnDashboardClient";

export const metadata = {
  title: "Your Learning Journey — Noor Guide",
  description:
    "A step-by-step learning path for new Muslims covering beliefs, prayer, Quran, and daily life.",
};

export default function LearnPage() {
  const modules = getLearningModules();

  return (
    <PageWrapper>
      <LearnDashboardClient modules={modules} />
    </PageWrapper>
  );
}
