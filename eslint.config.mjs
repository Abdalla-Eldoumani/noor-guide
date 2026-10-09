import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: ["node_modules", ".next", "out", ".playwright-mcp", "messages"],
  },
];

export default config;
