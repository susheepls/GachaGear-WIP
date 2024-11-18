/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#03045E',
        secondary: '#0077B6',
        skyblue: '#00B4D8',
        lighterskyblue: '#90E0EF',
        whiteblue: '#CAF0F8',
      },
    },
  },
  plugins: [],
}

