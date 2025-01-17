import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'S-Green': '#1DB954',
        'S-DarkGrey': '#212121',
        'S-Black': '#121212',
        'S-Grey': '#535353',
        'S-LightGrey': '#B3B3B3',
      },
    },
  },
  plugins: [],
} satisfies Config;
