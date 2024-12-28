
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberpunk: {
          bg: '#0B0B2C',
          text: '#FFE566',
          button: '#FF4D4D',
          buttonHover: '#FF7676',
          accent: '#4F1F7A',
          border: '#4F1F7A'
        }
      }
    },
  },
  plugins: [],
}
