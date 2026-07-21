/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        voltiq: {
          bg: '#081A3A',
          surface: '#10264F',
          surfaceLight: '#18346B',
          cyan: '#26D7E7',
          teal: '#2FAEAE',
          highlight: '#6EE7F7',
          text: '#F8FAFC',
          textSecondary: '#CBD5E1',
          muted: '#94A3B8',
          success: '#31C48D',
          warning: '#FBBF24',
          error: '#EF4444',
        },
        graphite: {
          950: '#081A3A',
          900: '#10264F',
          850: '#18346B',
          800: '#1F3E7C',
          700: '#2A4E96',
        },
        charcoal: {
          900: '#10264F',
          800: '#18346B',
          700: '#204388',
          600: '#2A55A6',
          500: '#3568C4',
        },
        teal: {
          glow: '#6EE7F7',
          DEFAULT: '#26D7E7',
          400: '#6EE7F7',
          500: '#26D7E7',
          600: '#2FAEAE',
        },
        amber: {
          glow: '#FBBF24',
          DEFAULT: '#FBBF24',
          400: '#FDE047',
          600: '#D97706',
        },
        rust: {
          glow: '#EF4444',
          DEFAULT: '#EF4444',
          600: '#DC2626',
        },
        emerald: {
          glow: '#31C48D',
          DEFAULT: '#31C48D',
          400: '#34D399',
        },
        offwhite: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'battery-pulse': 'batteryPulse 3s ease-in-out infinite',
        'glow-cyan': 'glowCyan 3s ease-in-out infinite alternate',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        batteryPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'brightness(1.0)', boxShadow: '0 0 15px rgba(38, 215, 231, 0.2)' },
          '50%': { opacity: '1.0', filter: 'brightness(1.4)', boxShadow: '0 0 35px rgba(38, 215, 231, 0.6)' },
        },
        glowCyan: {
          '0%': { boxShadow: '0 0 10px rgba(38, 215, 231, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(38, 215, 231, 0.6)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(38, 215, 231, 0.08) 1px, transparent 0)",
        'cyber-grid': "linear-gradient(to right, rgba(38, 215, 231, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(38, 215, 231, 0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
