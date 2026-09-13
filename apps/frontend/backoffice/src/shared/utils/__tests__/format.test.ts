import { capitalizeText, formatCurrency } from '../format'

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
})
