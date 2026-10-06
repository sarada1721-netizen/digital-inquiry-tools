import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFD1DC",
          lavender: "#E0BBE4",
          blue: "#D0F4DE",
          sky: "#A9DEF9",
          butter: "#FEF9C3",
          coral: "#FEC89A",
          mint: "#D8F3DC",
        },
        brutal: {
          yellow: "#FFE600",
          pink: "#FF007F",
          cyan: "#00F0FF",
          lime: "#70FF00",
          purple: "#9D00FF",
          orange: "#FF5E00",
        },
      },
      boxShadow: {
        "brutal": "4px 4px 0px 0px #000000",
        "brutal-sm": "2px 2px 0px 0px #000000",
        "brutal-lg": "6px 6px 0px 0px #000000",
        "brutal-white": "4px 4px 0px 0px #ffffff",
        "clay": "8px 8px 16px 0 rgba(0, 0, 0, 0.08), inset -4px -4px 8px 0 rgba(0, 0, 0, 0.06), inset 4px 4px 8px 0 rgba(255, 255, 255, 0.9)",
        "clay-pressed": "inset 3px 3px 6px rgba(0, 0, 0, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
        "neu-flat": "6px 6px 12px #d1d5db, -6px -6px 12px #ffffff",
        "neu-dark": "6px 6px 12px #0f172a, -6px -6px 12px #1e293b",
      },
      fontFamily: {
        sans: ["Pretendard", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          "50%": { transform: "translate(30px, -20px) rotate(180deg) scale(1.15)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        aurora: "aurora 20s infinite ease-in-out alternate",
        "pulse-slow": "pulseSlow 4s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
