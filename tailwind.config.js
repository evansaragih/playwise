/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#020202',
        surface: '#0E0E0E',
        card: '#20201F',
        elevated: '#1E1E1E',
        border: '#2A2A2A',
        primary: '#00FF41',
        'primary-muted': '#9CFF93',
        'primary-dark': '#006413',
        secondary: '#068F4B',
        tertiary: '#0EEAFD',
        warning: '#FFB800',
        'warning-dark': '#715200',
        neutral: '#9E9E9E',
        'neutral-dark': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        slideUp: 'slideUp 0.4s ease-out forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
