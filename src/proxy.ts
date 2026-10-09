import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleEntry = createMiddleware(routing);

// A link inside the site already names its locale, so the client router's
// fetches skip the cookie redirect and only page loads are redirected.
// Otherwise a prefetch that lands just after a language switch caches /learn as
// the Arabic page, and the English links lead there for minutes afterwards.
// Next hides its RSC headers from the proxy, so the fetch is recognised by
// Sec-Fetch-Dest; a browser that sends none keeps the old behaviour.
const handleInApp = createMiddleware({ ...routing, localeDetection: false });

export default function proxy(request: NextRequest) {
  const dest = request.headers.get("sec-fetch-dest");
  return dest && dest !== "document" ? handleInApp(request) : handleEntry(request);
}

export const config = {
  // Every path except API routes, Next internals, static files, and the Open
  // Graph cards: metadata points at /en/opengraph-image, and redirecting that
  // to the unprefixed path loses the card on crawlers that do not follow redirects.
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};
