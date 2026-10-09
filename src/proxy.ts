import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleEntry = createMiddleware(routing);

// A link inside the site already names its locale, so client navigations and
// prefetches (sent with the RSC header) skip the cookie redirect. Otherwise a
// prefetch that lands just after a language switch caches /learn as the Arabic
// page, and the English links lead there for minutes afterwards.
const handleInApp = createMiddleware({ ...routing, localeDetection: false });

export default function proxy(request: NextRequest) {
  return request.headers.get("rsc") === "1" ? handleInApp(request) : handleEntry(request);
}

export const config = {
  // Every path except API routes, Next internals, static files, and the Open
  // Graph cards: metadata points at /en/opengraph-image, and redirecting that
  // to the unprefixed path loses the card on crawlers that do not follow redirects.
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};
