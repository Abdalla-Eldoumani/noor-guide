import Link from "next/link";
import {
  Heart,
  Building,
  Droplets,
  Moon,
  BookOpen,
  HandMetal,
  ArrowRight,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getLearningModules } from "@/lib/content";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  building: Building,
  droplets: Droplets,
  moon: Moon,
  "book-open": BookOpen,
  hands: HandMetal,
};

export default function HomePage() {
  const modules = getLearningModules();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 to-cream" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-ink leading-tight">
            Welcome to Your{" "}
            <span className="text-primary-500">Journey of Light</span>
          </h1>
          <p
            dir="rtl"
            lang="ar"
            className="mt-4 font-arabic text-arabic-lg text-primary-500 opacity-80"
          >
            نور
          </p>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            A gentle, step-by-step guide for new Muslims — learn at your own pace,
            backed by authentic sources.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-7 py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-primary-600 transition-colors"
            >
              I just took my Shahada — Start Learning
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/learn/aqeedah"
              className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 px-7 py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-primary-50 transition-colors"
            >
              I&apos;m exploring Islam
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-500 mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-heading font-semibold text-ink">Step by Step</h3>
            <p className="mt-1 text-sm text-muted">
              Learn gradually, at your own pace. No overwhelm.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-500 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading font-semibold text-ink">Authentic Sources</h3>
            <p className="mt-1 text-sm text-muted">
              Every teaching backed by the Quran and verified Hadith.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-500 mb-4">
              <Heart size={24} />
            </div>
            <h3 className="font-heading font-semibold text-ink">Free Forever</h3>
            <p className="mt-1 text-sm text-muted">
              No accounts, no fees, no ads. Just guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Modules */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-heading font-bold text-ink text-center">
          Your Learning Journey
        </h2>
        <p className="mt-3 text-muted text-center max-w-xl mx-auto">
          Six carefully structured modules to guide you from the foundations of belief
          to daily practice.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = iconMap[mod.icon] || BookOpen;
            return (
              <Link
                key={mod.id}
                href={`/learn/${mod.id}`}
                className="card group block"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-500 shrink-0 group-hover:bg-primary-100 transition-colors">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-ink group-hover:text-primary-500 transition-colors">
                      {mod.title_en}
                    </h3>
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-sm text-muted mt-0.5"
                    >
                      {mod.title_ar}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted line-clamp-2">
                  {mod.description_en}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                  <Clock size={14} />
                  <span>{mod.estimatedMinutes} min</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-3xl p-10 sm:p-14 text-white">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">
            Begin Your Journey
          </h2>
          <p className="mt-3 text-primary-100 max-w-md mx-auto">
            Take the first step on a path of knowledge, peace, and purpose.
          </p>
          <Link
            href="/learn"
            className="mt-8 inline-flex items-center gap-2 bg-white text-primary-600 px-7 py-3.5 rounded-xl font-heading font-semibold text-lg hover:bg-primary-50 transition-colors"
          >
            Start Learning
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </>
  );
}
