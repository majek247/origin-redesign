/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#06183A', navy: '#0B2A5B', blue: '#1B4F96', sky: '#4A78B0',
        mint: '#7DF5D6', teal: '#3E9C95', lime: '#C7EF90', amber: '#F6A53A', mist: '#EAF2F7',
      },
      fontFamily: { sans: ['"DM Sans"', 'system-ui', 'sans-serif'], hand: ['Caveat', 'cursive'] },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0) rotate(var(--r,0deg))' }, '50%': { transform: 'translateY(-14px) rotate(var(--r,0deg))' } },
        dot: { '0%,80%,100%': { opacity: '.25' }, '40%': { opacity: '1' } },
        rise: { from: { opacity: '0', transform: 'translateY(28px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { float: 'float 7s ease-in-out infinite', dot: 'dot 1.2s infinite', rise: 'rise .8s cubic-bezier(.2,.7,.2,1) both' },
    },
  },
  plugins: [],
}
