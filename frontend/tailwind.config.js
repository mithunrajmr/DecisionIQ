/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          soft:    '#1a1a1a',
          muted:   '#3d3d3d',
        },
      },
      boxShadow: {
        // Neo-brutalist hard offset shadows
        'neo':       '3px 3px 0 0 #0a0a0a',
        'neo-md':    '4px 4px 0 0 #0a0a0a',
        'neo-lg':    '6px 6px 0 0 #0a0a0a',
        'neo-blue':  '3px 3px 0 0 #2563eb',
        'neo-green': '3px 3px 0 0 #16a34a',
        // Soft shadows kept for secondary use
        'card':      '0 2px 12px rgba(0,0,0,0.07)',
        'card-hover':'0 8px 28px rgba(37,99,235,0.13)',
      },
      borderWidth: {
        '1.5': '1.5px',
        '3': '3px',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.35s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
