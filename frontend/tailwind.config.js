/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0F1A", // near-black background, dark mode
          light: "#F5F7FA", // off-white background, light mode
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          hover: "var(--color-border-hover)",
        },
        accent: {
          blue: "#3B82F6",
          violet: "#8B5CF6",
          emerald: "#10B981",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backdropBlur: {
        glass: "20px",
      },
      keyframes: {
        "pulse-cell": {
          "0%, 100%": { opacity: 0.15 },
          "50%": { opacity: 0.55 },
        },
      },
      animation: {
        "pulse-cell": "pulse-cell 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
