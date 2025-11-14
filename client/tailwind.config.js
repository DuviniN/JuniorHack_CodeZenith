/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5EDC1F',
          dark: '#4AB816',
          light: '#5eead4'
        }
      }
    }
  },
  plugins: []
};

