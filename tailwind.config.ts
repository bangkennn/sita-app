import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: "#6366f1",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          orange: "#f97316",
        },
        surface: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        "gradient-hero": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%)",
        "gradient-cyan": "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        "gradient-emerald": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-amber": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        "gradient-indigo": "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 10px 25px -5px rgb(0 0 0 / 0.08), 0 4px 10px -4px rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
}

export default config
