/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#F8F7F4',
        'bg-dark': '#0F0F0D',
        'text': '#1A1A18',
        'text-muted': '#6B6B67',
        'accent': '#C8B89A',
        'border': '#E2E0DA',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
