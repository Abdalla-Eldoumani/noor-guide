import Link from "next/link";
import { Home, BookOpen, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Geometric pattern */}
        <div className="mx-auto mb-8 w-32 h-32 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
          <div className="absolute inset-3 rounded-full border-4 border-primary-200" />
          <div className="absolute inset-6 rounded-full border-4 border-primary-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-4xl font-bold text-primary-500">
              404
            </span>
          </div>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ink dark:text-gray-100">
          Page Not Found
        </h1>

        <p
          dir="rtl"
          lang="ar"
          className="mt-2 font-arabic text-arabic-sm text-primary-500 opacity-70"
        >
          الصفحة غير موجودة
        </p>

        <p className="mt-4 text-muted dark:text-gray-400 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Let us guide you back to your journey.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-heading font-semibold hover:bg-primary-600 transition-colors"
          >
            <Home size={18} />
            Go Home
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 px-6 py-3 rounded-xl font-heading font-semibold hover:bg-primary-50 transition-colors dark:hover:bg-primary-900/20"
          >
            <BookOpen size={18} />
            Continue Learning
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
