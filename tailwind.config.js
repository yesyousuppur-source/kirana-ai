/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#D1FAE5",
        },
      },
      fontFamily: {
        hindi: ["'Noto Sans Devanagari'", "sans-serif"],
        sans: ["'Roboto'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
