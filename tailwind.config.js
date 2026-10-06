/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'grass-dark': '#0d1117',
        'grass-darker': '#0a0e14',
        'grass-panel': '#161b22',
        'grass-panel2': '#1c2330',
        'grass-emerald': '#10b981',
        'grass-emerald-dark': '#059669',
        'grass-emerald-light': '#34d399',
        'grass-gold': '#fbbf24',
        'grass-gold-dark': '#d97706',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"JetBrains Mono"', 'monospace'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float-leaf': 'float-leaf 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pixel-float': 'pixel-float 6s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)' },
        },
        'float-leaf': {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.7' },
          '100%': { transform: 'translateY(-100vh) translateX(50px) rotate(360deg)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pixel-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};
