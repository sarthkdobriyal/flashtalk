/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1360px',
      }
    },
    extend: {
      fontFamily: {
          'baloo' : ['Baloo Bhaijaan 2', 'cursive'],
          'bungeeHairline' : ['Bungee Hairline', 'cursive'],
          'bungeeInline' : ['Bungee Inline', 'cursive'],
          'freckleFace' : ['Freckle Face', 'cursive']     
      },
      colors: {
        'primary': '#00FFFF',
        'secondary': '#FF00FF',
        'accent': '#00FF00',
      },
      backgroundImage: {
        'bgcolor': 'radial-gradient(#6600FF, #9933FF)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
