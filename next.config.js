/** @type {import('next').NextConfig} */

// Every origin the browser is allowed to reach at runtime. Prayer times come
// from AlAdhan, surah metadata from AlQuran Cloud, and the recitation audio the
// API hands back is served from cdn.islamic.network. Nothing else is needed:
// fonts are self-hosted by next/font, and the map links are outbound anchors
// rather than embeds.
const CONNECT = "https://api.alquran.cloud https://api.aladhan.com https://cdn.islamic.network";

const csp = [
  "default-src 'self'",
  // Next inlines its bootstrap, and the theme-flash script has to run before
  // hydration, so inline scripts cannot be excluded here.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${CONNECT}`,
  `media-src 'self' ${CONNECT}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The qibla compass and prayer times both ask for the reader's
          // position, so geolocation stays available to this origin only.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Hashed filenames, so these can never go stale.
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:all*.(svg|png|jpg|jpeg|webp|avif|ico|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
