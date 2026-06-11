import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050816',
        panel: 'rgba(9, 14, 34, 0.72)',
        border: 'rgba(120, 176, 255, 0.16)',
        cyan: '#00e5ff',
        purple: '#7c5cff',
        emerald: '#1effa8',
        gold: '#f5c96d'
      },
      boxShadow: {
        glow: '0 0 32px rgba(0, 229, 255, 0.22)',
        glowStrong: '0 0 80px rgba(124, 92, 255, 0.30)'
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at top, rgba(0,229,255,0.12), transparent 36%), linear-gradient(160deg, #050816 0%, #0a1230 100%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.75', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
