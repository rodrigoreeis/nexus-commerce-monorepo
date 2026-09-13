export const colors = {
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
