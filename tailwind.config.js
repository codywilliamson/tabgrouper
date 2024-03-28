const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./**/*.tsx",
    "node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        cyan: colors.green
      }
    }
  }
}
