import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      colors: {
        "top": "#EC6683",
        // //
        "primary": "#696CFF",
        "secondaries": "#0D9394",
        "tertiary": "#FFAB1D",
        "quaternary": "#EB3D63",
        "quinary": "#2092EC",
        // "": "#EC9720",
        // "": "#884fff",
        "secondary": "#2092EC",
        "success": "#2092EC",
        "info": "#2092EC",
        "warning": "#2092EC",
        "danger": "#2092EC",
        "light": "#2092EC",
        "dark": "#2092EC",
        "gray": "#2092EC",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;