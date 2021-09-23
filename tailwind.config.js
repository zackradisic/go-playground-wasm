const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['**/*.tsx'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        coolGray: colors.coolGray,
        blueGray: colors.blueGray
      }
    },
    fontFamily: {
      sans: ['Fira code', 'Fira Mono', 'monospace']
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
}
