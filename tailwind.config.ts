import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        xl: '1080px',
        lg: '1025px',
        md: "769px",
        sm: "640px"
      },
    },
    extend: {
      screens: {
        '2xl': '1545px',
        lg: '1025px' ,// Custom breakpoint at 1536px
        md: "769px",
        reg:"821px",//breaking point for 820px
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
