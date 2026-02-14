/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accessible: {
          bg: '#000000',
          text: '#ffffff',
          accent: '#fbbf24', // Yellow-400
          danger: '#ef4444', // Red-500
        }
      },
      fontSize: {
        'huge': '3rem',
      }
    },
  },
  plugins: [],
}
