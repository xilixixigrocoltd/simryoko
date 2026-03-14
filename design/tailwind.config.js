/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FFF5F0',
          500: '#FF6B35',
          600: '#E55A2B',
        },
        secondary: {
          100: '#E8F4F8',
          500: '#1E3A5F',
        },
        success: {
          100: '#D1FAE5',
          500: '#10B981',
        },
        warning: {
          100: '#FEF3C7',
          500: '#F59E0B',
        },
        error: {
          100: '#FEE2E2',
          500: '#EF4444',
        },
        info: {
          100: '#DBEAFE',
          500: '#3B82F6',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '62px', fontWeight: '700' }],
        'h1': ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '28px', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0,0,0,0.1)',
        'card-hover': '0 10px 15px rgba(0,0,0,0.1)',
        'modal': '0 20px 25px rgba(0,0,0,0.15)',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
};
