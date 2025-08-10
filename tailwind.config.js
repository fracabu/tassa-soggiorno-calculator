/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      maxWidth: {
        'screen': '100vw',
      },
      width: {
        'screen': '100vw',
      }
    },
  },
  plugins: [],
}