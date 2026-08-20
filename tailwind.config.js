/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Brand Colors (Refined Modern Light Theme) ─────────────────────────
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
          950: '#1e1b4b',
        },
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Light Theme Surfaces
        surface: {
          DEFAULT: '#ffffff',
          soft:    '#f8fafc', // slate-50
          muted:   '#f1f5f9', // slate-100
          border:  '#e2e8f0', // slate-200
          hover:   '#f8fafc',
        },
      },

      // ── Typography ────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // ── Animations ────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'number-pop': {
          '0%':   { opacity: '0', transform: 'scale(0.85) translateY(-6px)' },
          '60%':  { transform: 'scale(1.04) translateY(1px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.35s ease-out both',
        'scale-in':   'scale-in 0.25s ease-out both',
        'slide-up':   'slide-up 0.45s ease-out both',
        'number-pop': 'number-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },

      // ── Shadows ───────────────────────────────────────────────────
      boxShadow: {
        'glow-primary': '0 4px 20px rgba(79,70,229,0.18)',
        'glow-accent':  '0 4px 20px rgba(8,145,178,0.18)',
        'glow-success': '0 4px 20px rgba(22,163,74,0.16)',
        'card':         '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-elevated': '0 4px 20px -2px rgba(15, 23, 42, 0.07), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card-hover':   '0 14px 28px -4px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
};
