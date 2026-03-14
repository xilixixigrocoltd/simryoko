import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#6C63FF', dark: '#5A52E0', light: '#EEF0FF' },
        accent: '#FF6B6B',
        success: '#10B981',
        warning: '#F59E0B',
        dark: { DEFAULT: '#0F0E17', 2: '#1C1B2E' },
        bg: '#FAFBFF',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
