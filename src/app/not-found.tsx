import { useLocale } from "next-intl";
import NotFoundView from "./[locale]/not-found";

// `notFound()` raised anywhere under [locale] resolves to this root boundary
// rather than to [locale]/not-found.tsx, so the localized view renders here.
//
// Next wraps this boundary in its own <html id="__next_error__"> shell and
// discards any document element returned from it, so `lang` and `dir` go on a
// wrapper. Without that an Arabic 404 lays out left to right.
//
// Keep this synchronous. Awaiting `getLocale()` here defers the subtree past
// the point the error shell flushes, and the page ships with an empty body.
export default function RootNotFound() {
  const locale = useLocale();

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <NotFoundView />
    </div>
  );
}
