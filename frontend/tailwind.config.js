/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customRed: "#E86068",
        cardBackground: "#F57C7C",
      },
    },
  },
  plugins: [],
};
