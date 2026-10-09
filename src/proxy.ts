import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Every path except API routes, Next internals, static files, and the Open
  // Graph cards: metadata points at /en/opengraph-image, and redirecting that
  // to the unprefixed path loses the card on crawlers that do not follow redirects.
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};
