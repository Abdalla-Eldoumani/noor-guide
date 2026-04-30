import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: ["node_modules", ".next", "out", ".playwright-mcp", "messages"],
    rules: {
      // React 19 ships a stricter rule that flags any setState inside useEffect.
      // The codebase has several legitimate patterns (scroll listeners, async
      // fetch states, hydration-time localStorage reads) where this is fine; a
      // dedicated hook refactor is the right place to address those, not lint.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
