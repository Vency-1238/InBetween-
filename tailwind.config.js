/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          100: '#F6F1EB',
          200: '#EFE8DF',
        },
        beige: {
          200: '#E9DCCF',
          300: '#DDCEBE',
          400: '#CBB7A0',
        },
        sand: {
          300: '#D8C4A8',
        },
        bark: {
          300: '#A58872',
          400: '#8B6F5A',
          500: '#765B49',
          600: '#644B3D',
          700: '#543F34',
          800: '#4A3A30',
          900: '#3E3128',
        },
        coffee: '#4A3A30',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(62, 40, 22, 0.08)',
        'soft-lg': '0 20px 45px rgba(62, 40, 22, 0.16)',
      },
      backgroundImage: {
        'site-gradient':
          'radial-gradient(circle at 20% 10%, #F6F1EB, #F1E8DC 45%, #E9DCCF 75%, #E4D3C0)',
      },
    },
  },
  plugins: [],
}

