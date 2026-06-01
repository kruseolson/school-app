import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff5a1f",
          dark: "#cc4419",
          light: "#ff7a47",
        },
      },
    },
  },
  plugins: [],
};
export default config;
