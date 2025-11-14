/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0d9488',
          dark: '#0f766e',
          light: '#5eead4'
        }
      }
    }
  },
  plugins: []
};

