import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        surface: "#f9fafb",
        "surface-card": "#ffffff",
        "surface-elevated": "#f4f4f5",
        border: "#e4e4e7",
        "border-dark": "#09090b",
        foreground: "#09090b",
        "foreground-muted": "#71717a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-plus-jakarta)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "var(--font-inter)", "-apple-system", "sans-serif"],
        outfit: ["var(--font-plus-jakarta)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scan: "scan 4s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
