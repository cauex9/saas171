/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#09090B',
        card: '#18181B',
        primary: '#7C3AED',
        secondary: '#2563EB',
        text: '#FAFAFA',
        muted: '#A1A1AA'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(124, 58, 237, 0.2)'
      }
    }
  },
  plugins: []
};
