import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        skillten: {
          50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE',
          300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1',
          600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81',
          950: '#1E1B4B'
        },
        navy: { DEFAULT: '#0F172A', light: '#1E293B' },
        // Bible FE-01 — Viya Design Tokens
        'viya-navy': '#0F172A',
        'viya-indigo': '#4F46E5',
        'viya-violet': '#6D28D9',
        'viya-accent': '#818CF8',
        'viya-white': '#FFFFFF',
        'viya-offwhite': '#F8FAFC',
        'viya-lgray': '#F1F5F9',
        'viya-dgray': '#374151',
        'viya-mgray': '#64748B',
        'viya-bgray': '#E2E8F0',
        'viya-success': '#059669',
        'viya-warning': '#D97706',
        'viya-error': '#DC2626',
        'viya-teal': '#0D9488',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        skillten: '12px',
      },
      animation: {
        'score-count': 'scoreCount 2s ease-out forwards',
        'reveal-up': 'revealUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        scoreCount: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
