/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      goldman: "'Goldman', 'Arial', 'sans-serif'",
      inter: "'Inter', 'Arial', 'sans-serif'"
    }
  },
  plugins: []
}

module.exports = tailwindConfig
