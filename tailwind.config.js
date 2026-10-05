/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        glossy: '0 8px 30px rgba(37, 99, 235, 0.15)',
        'glossy-lg': '0 20px 60px rgba(2, 6, 23, 0.35)',
      },
      backgroundImage: {
        'glossy-sheen':
          'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 45%)',
        'hero-radial':
          'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.25), transparent 40%), linear-gradient(135deg,#0f172a 0%,#1e293b 55%,#0b1224 100%)',
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(37,99,235,0.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(37,99,235,0)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floaty: 'floatY 5s ease-in-out infinite',
        'floaty-slow': 'floatY 7s ease-in-out infinite',
        glowpulse: 'pulseGlow 2.4s ease-in-out infinite',
        spinslow: 'spinSlow 14s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
