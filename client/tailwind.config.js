/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7fc',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#005BAC',
          600: '#004e93',
          700: '#003f77',
          900: '#002c54',
        },
        railway: {
          blue: '#005BAC',
          red: '#D32F2F',
          gold: '#FFC107',
          navy: '#0a1128',
          dark: '#001c3d',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float-soft 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
