/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Questo è il percorso più importante!
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          100: "#fdf6e3", // Light cream for backgrounds
          200: "#f3e9d2", // Slightly darker cream
        },
        stone: {
          500: "#78716c", // Muted text color
          700: "#44403c", // Darker text color
        },
        amber: {
          500: "#f59e0b", // Accent color for highlights
        },
      },
    },
  },
  plugins: [],
};
