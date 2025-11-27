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
        'text3': 'clamp(0.875rem, 0.7313rem + 0.2985vw, 1rem)',
        'text4': 'clamp(14px, 8.3396px + 1.5094vw, 18px);',
        'text5': 'clamp(13px, 9.5618px + 0.4471vw, 16px)'
      }
    },
  },
  plugins: [],
}

