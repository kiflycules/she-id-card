import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2A4A",
          50: "#EAF0F7",
          100: "#CBDBEA",
          200: "#9CBBD9",
          300: "#6D9AC8",
          400: "#3E6FA8",
          500: "#1B4F8C",
          600: "#123B6B",
          700: "#0B2A4A",
          800: "#081D33",
          900: "#05121F",
        },
        steel: "#1B4F8C",
        paper: "#F5F7FA",
        ink: "#1F2A37",
        muted: "#5B6B7F",
        amber: {
          DEFAULT: "#D98E04",
          50: "#FDF3E0",
          600: "#B87703",
        },
        ok: {
          DEFAULT: "#1E7A46",
          50: "#E6F4EC",
        },
        danger: {
          DEFAULT: "#B3261E",
          50: "#FBEAE9",
        },
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        body: ["var(--font-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(11,42,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,42,74,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      borderRadius: {
        badge: "18px",
      },
    },
  },
  plugins: [],
};
export default config;
