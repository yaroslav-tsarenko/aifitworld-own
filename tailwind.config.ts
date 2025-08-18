import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0E10",
        foreground: "#F4F4F5",
        muted: "#9CA3AF",
        accent: "#FFD60A",
        card: "#141418",
        cardBorder: "#1F1F24"
      }
    }
  },
  plugins: []
} satisfies Config;
