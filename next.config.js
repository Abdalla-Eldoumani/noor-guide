/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  // Enable gzip compression
  compress: true,
  // Strict React mode for catching bugs early
  reactStrictMode: true,
};

module.exports = nextConfig;
