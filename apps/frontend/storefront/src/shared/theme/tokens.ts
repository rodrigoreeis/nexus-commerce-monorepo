export const colors = {
  store: {
    background: '#f8fafc',
    surface: '#ffffff',
    elevated: '#f1f5f9',
    border: '#e2e8f0',
  },
  content: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#94a3b8',
    inverse: '#ffffff',
  },
  accent: {
    blue: '#2563eb',
    blueHover: '#1d4ed8',
    emerald: '#10b981',
    emeraldHover: '#059669',
    gold: '#f59e0b',
    goldHover: '#d97706',
  },
} as const

export const spacing = {
  container: '80rem',
  gutter: '1.5rem',
} as const

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: '"Cabinet Grotesk", ui-sans-serif, system-ui, sans-serif',
  },
} as const

export const borders = {
  radius: {
    card: '0.75rem',
    pill: '9999px',
    button: '0.5rem',
  },
} as const

export const tokens = {
  colors,
  spacing,
  typography,
  borders,
} as const
