import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#05060a',
        ink: '#0f172a',
        accent: '#8b5cf6',
        highlight: '#38bdf8',
      },
      fontFamily: {
        display: ['"Poppins"', 'ui-sans-serif', 'system-ui'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'aurora': 'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.25), transparent 55%), radial-gradient(circle at 80% 0%, rgba(56,189,248,0.2), transparent 45%)',
      },
    },
  },
  plugins: [],
};

export default config;
