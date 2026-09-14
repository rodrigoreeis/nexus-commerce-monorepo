import { capitalizeText, formatCurrency, formatDate } from '../format'

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats a regular numeric amount correctly', () => {
      const result = formatCurrency(1250.5)
      expect(result).toBe('$1,250.50')
    })

    it('returns default fallback on undefined or null', () => {
      expect(formatCurrency(undefined)).toBe('$0.00')
      expect(formatCurrency(null)).toBe('$0.00')
    })
  })

  describe('capitalizeText', () => {
    it('capitalizes a standard lowercase string', () => {
      expect(capitalizeText('orders')).toBe('Orders')
    })

    it('returns empty string when input is missing', () => {
      expect(capitalizeText(undefined)).toBe('')
      expect(capitalizeText('')).toBe('')
    })
  })

  describe('formatDate', () => {
    it('formats an ISO date correctly', () => {
      const result = formatDate('2026-09-13T12:00:00Z', 'en-US')
      expect(result).toContain('2026')
      expect(result).toContain('Sep')
      expect(result).toContain('13')
    })

    it('returns fallback dash on invalid or empty date', () => {
      expect(formatDate(undefined)).toBe('—')
      expect(formatDate('')).toBe('—')
      expect(formatDate('invalid-date')).toBe('—')
    })
  })
})
