/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        one: '#0A2342',
        two: '#2CA58D',
        three: '#84BC9C',
        four: '#FFFDF7',
        five: '#F46197',
      },
    },
  },
  plugins: [],
}

