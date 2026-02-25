import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        racing: {
          dark: "#0a0a0f",
          darker: "#06060a",
          card: "#12121a",
          border: "#1e1e2e",
          accent: "#f97316",
          "accent-dim": "#c2410c",
          muted: "#71717a",
          surface: "#18182a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
