// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FFFFFF', // White
          lighter: '#FFFFFF', // Light blue (very soft)
          primary: '#FFFFFF', // Blue (soft)
          dark: '#90CAF9', // Blue (slightly darker)
        },
      },
      fontFamily: {
        poppins: ['"Quicksand"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
