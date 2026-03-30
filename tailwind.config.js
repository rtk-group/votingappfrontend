/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#222831',
        surface: '#393E46',
        accent: '#948979',
        cream: '#DFD0B8',
      },
      boxShadow: {
        premium: '0 20px 60px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        xl: '1rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

