import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: 'var(--accent)',
          black: 'var(--color-charcoal-black)',
          gray: 'var(--color-cool-gray)',
          navy: 'var(--color-navy-blue)',
          white: 'var(--color-white)',
        },
        accent: 'var(--accent)',
        secondary: 'var(--color-cool-gray)',
      },
      backgroundColor: {
        base: 'var(--background)',
        card: 'var(--card-bg)',
        input: 'var(--input-bg)',
      },
      textColor: {
        base: 'var(--foreground)',
        secondary: 'var(--secondary)',
      },
      borderColor: {
        base: 'var(--border)',
        input: 'var(--input-border)',
      },
    },
  },
  plugins: [],
};

export default config;
