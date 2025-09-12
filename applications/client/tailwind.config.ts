const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map the "professional" color tokens to the CSS variables declared in globals.css
        // This creates classes like bg-professional-yellow, text-professional-yellow, etc.
        professional: {
          main: "var(--professional-main)",
          sub: "var(--professional-sub)",

          // primary variants
          "primary-1": "var(--professional-primary-1)",
          "primary-2": "var(--professional-primary-2)",
          "primary-3": "var(--professional-primary-3)",
          "primary-4": "var(--professional-primary-4)",
          "primary-5": "var(--professional-primary-5)",

          // alt primary variants
          "primary-alt-1": "var(--professional-primary-alt-1)",
          "primary-alt-2": "var(--professional-primary-alt-2)",
          "primary-alt-3": "var(--professional-primary-alt-3)",
          "primary-alt-4": "var(--professional-primary-alt-4)",
          "primary-alt-5": "var(--professional-primary-alt-5)",

          secondary: "var(--professional-secondary)",
          success: "var(--professional-success)",
          info: "var(--professional-info)",
          warning: "var(--professional-warning)",
          danger: "var(--professional-danger)",

          light: "var(--professional-light)",
          dark: "var(--professional-dark)",
          gray: "var(--professional-gray)",

          blue: "var(--professional-blue)",
          indigo: "var(--professional-indigo)",
          purple: "var(--professional-purple)",
          pink: "var(--professional-pink)",
          red: "var(--professional-red)",
          orange: "var(--professional-orange)",
          yellow: "var(--professional-yellow)",
          green: "var(--professional-green)",
          teal: "var(--professional-teal)",
          cyan: "var(--professional-cyan)",
          black: "var(--professional-black)",
          white: "var(--professional-white)",
          "gray-dark": "var(--professional-gray-dark)",
        },
      },
    },
  },
  // Safelist dynamic class patterns so runtime-constructed classes like
  // `bg-professional-yellow/24` are preserved by the JIT/purge process.
  safelist: [
    {
      // Keep bg-, text- and border- professional classes with optional opacity suffix (e.g. /24)
      pattern: /^(?:bg|text|border)-professional-(?:main|sub|blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan|black|white|gray|"gray-dark"|primary-1|primary-2|primary-3|primary-4|primary-5|primary-alt-1|primary-alt-2|primary-alt-3|primary-alt-4|primary-alt-5|secondary|success|info|warning|danger|light|dark|"gray-dark")(?:\/\d+)?$/,
    },
  ],
  plugins: [],
};

export default config;