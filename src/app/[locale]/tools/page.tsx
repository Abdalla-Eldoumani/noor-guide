import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Clock, Compass, MapPin } from "lucide-react";

export const metadata = {
  title: "Tools | Noor Guide",
  description:
    "Practical tools for your daily worship: prayer times, Qibla direction, and mosque finder.",
};

const tools = [
  {
    href: "/tools/prayer-times",
    title: "Prayer Times",
    titleAr: "أوقات الصلاة",
    description: "Get accurate prayer times for your location based on trusted calculation methods.",
    icon: Clock,
  },
  {
    href: "/tools/qibla",
    title: "Qibla Direction",
    titleAr: "اتجاه القبلة",
    description: "Find the direction of the Kaaba in Makkah from anywhere in the world.",
    icon: Compass,
  },
  {
    href: "/tools/masjid-finder",
    title: "Find a Mosque",
    titleAr: "ابحث عن مسجد",
    description: "Locate mosques near you for congregational prayers and community.",
    icon: MapPin,
  },
];

export default function ToolsPage() {
  return (
    <PageWrapper>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink dark:text-gray-100 sm:text-4xl">
          Practical Tools
        </h1>
        <p className="mt-3 text-muted dark:text-gray-400">
          Tools to help you in your daily worship and practice.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-2xl border border-gray-200 bg-surface p-6 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-100 dark:bg-primary-900/30 dark:group-hover:bg-primary-900/50">
                <Icon size={24} />
              </div>
              <h2 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
                {tool.title}
              </h2>
              <p className="mt-0.5 font-arabic text-sm text-primary-500" dir="rtl">
                {tool.titleAr}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted dark:text-gray-400">
                {tool.description}
              </p>
            </Link>
          );
        })}
      </div>
    </PageWrapper>
  );
}
