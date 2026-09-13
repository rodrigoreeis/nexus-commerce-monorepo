import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        store: {
          background: '#0b0f19',
          surface: '#111827',
          elevated: '#1f2937',
          border: '#374151',
        },
        content: {
          primary: '#f9fafb',
          secondary: '#9ca3af',
          muted: '#6b7280',
          inverse: '#111827',
        },
        accent: {
          emerald: '#10b981',
          'emerald-hover': '#059669',
          gold: '#f59e0b',
          'gold-hover': '#d97706',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      maxWidth: {
        store: '80rem',
      },
    },
  },
  plugins: [],
}

export default config
