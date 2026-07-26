import type { Metadata } from "next";
import NotFoundView from "../not-found";

// Unmatched URLs under a locale land here so the reader gets a page in their own
// language with the site chrome around it, rather than Next's built-in English
// one. It renders the view directly instead of calling `notFound()`: that would
// resolve to the root boundary, which sits above the locale provider, and
// localizing there turns every route in the app from prerendered into
// server-rendered. A helpful localized page on a mistyped URL is not worth
// making all 50 real pages slower, so this route is `noindex` instead.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CatchAllNotFound() {
  return <NotFoundView />;
}
