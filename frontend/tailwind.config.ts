import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        appbg: '#0f172a',
        panel: '#1e293b',
        border: '#334155',
        text: '#e2e8f0',
        primary: '#3b82f6',
        success: '#22c55e',
        error: '#ef4444'
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(51, 65, 85, 0.5)'
      }
    }
  },
  plugins: []
} satisfies Config;
