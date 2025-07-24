/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forestech: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce4cb',
          300: '#8cd0a7',
          400: '#56b37c',
          500: '#329958',
          600: '#2d5016', // Color principal Forestech
          700: '#1b4332',
          800: '#1a3e2e',
          900: '#163427',
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-react-aria-components')
  ],
}