import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C5EAD",
          light: "#4A7CC7",
          lighter: "#EEF3FB",
          dark: "#1E4080",
        },
        surface: "#FFFFFF",
        background: "#F5F7FA",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.08)",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #2C5EAD 0%, #1E4080 100%)",
        "gradient-auth": "linear-gradient(135deg, #2C5EAD 0%, #1E4080 100%)",
        "gradient-welcome": "linear-gradient(90deg, #2C5EAD 0%, #4A7CC7 100%)",
      },
    },
  },
  plugins: [],
}

export default config
