/** @type {import('next').NextConfig} */

// Prayer times come from AlAdhan and the recitation audio list from AlQuran
// Cloud; the audio files themselves are served from cdn.islamic.network. Fonts
// are self-hosted by next/font and the map links are plain outbound anchors.
const API_ORIGINS = "https://api.alquran.cloud https://api.aladhan.com";
const AUDIO_ORIGIN = "https://cdn.islamic.network";

const csp = [
  "default-src 'self'",
  // Next inlines its bootstrap scripts, and a static site has no per-request
  // nonce to allow them by.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${API_ORIGINS}`,
  `media-src 'self' ${AUDIO_ORIGIN}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // next dev would otherwise write an agent instructions block into the repo.
  agentRules: false,
  turbopack: {
    root: __dirname,
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
          // The qibla and prayer-time tools ask for the reader's position.
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
    ];
  },
};

const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
