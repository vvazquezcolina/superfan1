import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#0058a1",
          light: "#2d8cd6",
          dark: "#003d73",
        },
        accent: {
          DEFAULT: "#ff6b3d",
          light: "#ff8a63",
          dark: "#d64e1d",
        },
        neutral: {
          50: "#f7f9fb",
          100: "#e9eef4",
          200: "#cfd8e3",
          300: "#b1c0d1",
          600: "#50627a",
          800: "#2b394d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px -30px rgba(0, 64, 128, 0.45)",
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, rgba(0, 88, 161, 0.92), rgba(45, 140, 214, 0.88))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
