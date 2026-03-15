import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4361ee',
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a4bcfd',
          400: '#7c9cfb',
          500: '#5b7bf5',
          600: '#4361ee',
          700: '#3549d4',
          800: '#2d3dab',
          900: '#2a3887',
          950: '#1a2252',
          dark: '#3549d4',
        },
        accent: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
export default config