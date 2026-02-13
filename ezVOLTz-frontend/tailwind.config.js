/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      ...colors,
      ezBlack: '#1F1F1F',
      ezLightGreen: '#EBFFEB',
      ezGreen: '#228B22',
      ezLightWhite: '#F0F1F4',
      ezOrange: '#FFB800',
      ezRed: '#E70B0B',
      ezMidWhite: '#F5F5F5',
      ezLightGray: '#AEAEAE',
      ezGray: '#808080',
      ezDarkGray: '#24282D',
    },
    extend: {},
  },
  plugins: [],
};
