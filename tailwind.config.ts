import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // imp
    "**/pages/**/*.{html,js}",
    "**/components/**/*.{html,js}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        brand: "#10b981",
        primary: "#047857",
        secondary: "#475569",
      },
      animation: {
        "spin-x-slow": "spin .2s linear infinite",
        "spin-slow": "spin 1.5s linear infinite",
        "spin-fast": "spin .75s linear infinite",
        "spin-x-fast": "spin .5s linear infinite",
        "spin-xx-fast": "spin .25s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
