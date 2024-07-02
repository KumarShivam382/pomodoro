/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customRed: "#E86068",
        cardBackground1: "#F57C7C",
        cardBackground2: "#33a5c7",
        cardBackground3: "",
        customBlue: "#6495ED",
      },
    },
  },
  plugins: [],
};
