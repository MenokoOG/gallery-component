/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A202C', // Replace with the primary color from the current website
        secondary: '#2D3748', // Replace with the secondary color from the current website
        accent: '#3182CE', // Replace with the accent color from the current website
      },
    },
  },
  plugins: [],
};
