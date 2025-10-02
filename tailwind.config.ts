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
        background: "#0f172a",
        surface: "#1e293b",
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        "card-red": "#dc2626",
        "card-black": "#1f2937",
        "card-back": "#4b5563",
        "text-primary": "#f1f5f9",
        "text-secondary": "#94a3b8",
        "text-muted": "#64748b",
      },
    },
  },
  plugins: [],
};
export default config;
