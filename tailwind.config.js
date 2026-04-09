/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Lexend = default UI font (body, labels, chips, nav, sub-text)
        sans:    ['Lexend', 'sans-serif'],
        ui:      ['Lexend', 'sans-serif'],
        // Space Grotesk = headings, titles, big numbers, sport tile labels
        heading: ['"Space Grotesk"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        background:      '#020202',
        surface:         '#0E0E0E',
        card:            '#20201F',
        elevated:        '#1E1E1E',
        border:          '#2A2A2A',
        primary:         '#00FF41',
        'primary-muted': '#9CFF93',
        'primary-dark':  '#006413',
        secondary:       '#068F4B',
        tertiary:        '#0EEAFD',
        warning:         '#FFB800',
        'warning-dark':  '#715200',
        neutral:         '#ADAAAA',
        'neutral-dark':  '#1A1A1A',
        monthly:         '#00677F',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}
