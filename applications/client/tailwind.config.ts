import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "main": "#EC6683",
        // //
        "indigoOfficial": "#696CFF",
        "tealOfficial": "#0D9394",
        "amberOfficial": "#FFAB1D",
        "raspberryOfficial": "#EB3D63",
        "azureOfficial": "#2092EC",
        // "": "#EC9720",
        // "": "#884fff",
        "secondaryOfficial": "#8592A3",
        "successOfficial": "#71DD37",
        "infoOfficial": "#03C3EC",
        "warningOfficial": "#FFAB00",
        "dangerOfficial": "#FF3E1D",
        "lightOfficial": "#DBDEE0",
        "darkOfficial": "#2B2C40",
        "grayOfficial": "#91979F",
        // //
        "indigoSpecial": "#696CFF",
        "tealSpecial": "#0D9394",
        "amberSpecial": "#FFAB1D",
        "raspberrySpecial": "#EB3D63",
        "azureSpecial": "#2092EC",
        // //
        "secondarySpecial": "#8592A3",
        "successSpecial": "#71DD37",
        "infoSpecial": "#03C3EC",
        "warningSpecial": "#FFAB00",
        "dangerSpecial": "#FF3E1D",
        "lightSpecial": "#DBDEE0",
        "darkSpecial": "#2B2C40",
        "graySpecial": "#91979F",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;