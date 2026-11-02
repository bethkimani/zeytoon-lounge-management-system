export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        night: '#090909',
        charcoal: '#171717',
        raised: '#1F1F1F',
        edge: '#2A2A2A',
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E4C766',
          deep: '#8C7425',
        },
        fg: '#F5F5F4',
        muted: '#A8A8A8',
        subtle: '#757575',
        ok: '#5FBF8A',
        warn: '#E0B341',
        danger: '#E06C5A',
        info: '#7AA6D6',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
};
