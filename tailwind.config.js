/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary — Deep Islamic green
        primary: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#2D6A4F", // Main primary
          600: "#1B4332", // Dark primary
          700: "#14532D",
          800: "#0F3D22",
          900: "#052E16",
        },
        // Accent — Warm gold
        accent: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#D4A574", // Main accent
          500: "#C49A6C",
          600: "#B08D5B",
          700: "#92400E",
        },
        // Background
        cream: "#FEFCF3",
        surface: "#FFFFFF",
        // Text
        ink: "#1A1A2E",
        muted: "#6B7280",
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
        arabic: ['"Amiri"', '"Noto Naskh Arabic"', "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        "arabic-sm": ["1.25rem", { lineHeight: "2rem" }],
        "arabic-base": ["1.5rem", { lineHeight: "2.5rem" }],
        "arabic-lg": ["1.875rem", { lineHeight: "3rem" }],
        "arabic-xl": ["2.25rem", { lineHeight: "3.5rem" }],
        // Fluid type scale via clamp(min, base + viewport, max).
        // display: hero headlines. h1: page titles. h2: sections. h3: subsections.
        display: ["clamp(2.25rem, 1.5rem + 2.5vw, 3.75rem)", { lineHeight: "1.1" }],
        h1: ["clamp(1.875rem, 1.5rem + 1.25vw, 2.5rem)", { lineHeight: "1.2" }],
        h2: ["clamp(1.375rem, 1.125rem + 0.75vw, 1.75rem)", { lineHeight: "1.3" }],
        h3: ["clamp(1.125rem, 1rem + 0.375vw, 1.375rem)", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
};
