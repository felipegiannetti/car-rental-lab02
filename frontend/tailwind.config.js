/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Sidebar – deep forest green */
        sidebar:         '#012910',
        'sidebar-hover': '#033d18',
        'sidebar-active':'#78de1f',   /* lime — used as active item bg */

        /* Brand – lime / green scale (Meoo-inspired) */
        brand: {
          50:  '#f2fde0',
          100: '#e3fac0',
          200: '#c9f485',
          300: '#a8e64e',
          400: '#8fd828',
          500: '#78de1f',  /* PRIMARY lime */
          600: '#62b818',
          700: '#4b8d12',
          800: '#01602a',  /* teal forest */
          900: '#004521',  /* deep forest */
        },

        /* Semantic */
        success: '#018444',
        warning: '#ffcf33',
        danger:  '#d92020',

        /* Neutral surface */
        surface: '#f2f2f2',
      },
      fontFamily: {
        sans:    ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Racing Sans One"', 'sans-serif'],
      },
      boxShadow: {
        card:      '0 2px 4px 1px rgba(15,23,42,0.08)',
        'card-md': '0 4px 16px 2px rgba(15,23,42,0.10)',
        brand:     '0 4px 16px rgba(120,222,31,0.35)',
        'brand-lg':'0 8px 28px rgba(120,222,31,0.40)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        pill:  '400px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
