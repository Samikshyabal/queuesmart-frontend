/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Healthcare Design System — CityCare Hospital ───────────────────────
      colors: {
        // Primary action — blue (#2563EB and scale)
        primary: {
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
          950: '#172554',
        },
        // Healthcare accent — teal (#0F766E and scale)
        accent: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Success / available — green (#16A34A and scale)
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        // Warning / moderate — amber (#F59E0B and scale)
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Critical / busy / danger — red (#DC2626 and scale)
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
        },
        // Surface / background tokens
        surface: {
          DEFAULT: '#ffffff',
          soft:    '#f8fafc',   // bg-surface-soft — main page background
          muted:   '#f1f5f9',   // bg-surface-muted — input backgrounds
          border:  '#e2e8f0',   // border-surface-border
          hover:   '#f8fafc',
        },
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // ── Animations ─────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'number-pop': {
          '0%':   { opacity: '0', transform: 'scale(0.88) translateY(-4px)' },
          '60%':  { transform: 'scale(1.03) translateY(1px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.3s ease-out both',
        'scale-in':   'scale-in 0.22s ease-out both',
        'slide-up':   'slide-up 0.4s ease-out both',
        'number-pop': 'number-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },

      // ── Shadows — calmer, flatter than marketing SaaS ───────────────────────
      boxShadow: {
        'glow-primary': '0 0 0 3px rgba(37,99,235,0.12)',
        'glow-accent':  '0 0 0 3px rgba(15,118,110,0.12)',
        'glow-success': '0 0 0 3px rgba(22,163,74,0.12)',
        // Card shadows — subtle, clinical
        'card':         '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-elevated':'0 4px 12px -2px rgba(15,23,42,0.06), 0 2px 4px -1px rgba(15,23,42,0.04)',
        'card-hover':   '0 8px 20px -4px rgba(15,23,42,0.09), 0 4px 8px -2px rgba(15,23,42,0.05)',
      },
    },
  },
  plugins: [],
};
