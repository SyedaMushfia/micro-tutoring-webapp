/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",          // HTML file at root
    "./src/**/*.{js,ts,jsx,tsx}", // All JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
      },
      fontSize: {
        'heroh1': 'clamp(20px, 5.2959px + 3.4517vw, 55px)',
        'heroh3': 'clamp(18px, 15.0592px + 0.6903vw, 25px)',
        'text1': 'clamp(25px, 16px + 1.1719vw, 28px)',
        'text2': 'clamp(22px, 16.2857px + 1.7857vw, 30px)',
      }
    },
  },
  plugins: [],
}

