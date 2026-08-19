/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Brand Colors ──────────────────────────────────────────────
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Dark background shades
        dark: {
          900: '#0d0f1a',
          800: '#13162b',
          700: '#1a1f3a',
          600: '#232847',
          500: '#2d3358',
        },
        surface: {
          DEFAULT: '#1a1f3a',
          light:   '#232847',
          border:  '#2d3358',
        },
      },

      // ── Typography ────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // ── Animations ────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'number-pop': {
          '0%':   { opacity: '0', transform: 'scale(0.8) translateY(-10px)' },
          '60%':  { transform: 'scale(1.05) translateY(2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.4s ease-out both',
        'scale-in':   'scale-in 0.25s ease-out both',
        'slide-up':   'slide-up 0.5s ease-out both',
        'number-pop': 'number-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },

      // ── Shadows ───────────────────────────────────────────────────
      boxShadow: {
        'glow-primary': '0 0 24px rgba(99,102,241,0.4)',
        'glow-accent':  '0 0 24px rgba(6,182,212,0.4)',
        'glow-success': '0 0 24px rgba(34,197,94,0.35)',
        'card':         '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':   '0 8px 40px rgba(0,0,0,0.55)',
      },
    },
  },
  plugins: [],
};
