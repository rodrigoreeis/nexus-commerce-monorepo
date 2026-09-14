import {
  capitalizeText,
  formatCurrency,
  formatCurrencyInput,
  formatDate,
  parseCurrencyToRaw,
} from '../format'

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats a regular numeric amount into Brazilian Reais (R$)', () => {
      const result = formatCurrency(1250.5).replace(/\u00a0/g, ' ')
      expect(result).toBe('R$ 1.250,50')
    })

    it('returns default fallback on undefined or null in R$', () => {
      expect(formatCurrency(undefined).replace(/\u00a0/g, ' ')).toBe('R$ 0,00')
      expect(formatCurrency(null).replace(/\u00a0/g, ' ')).toBe('R$ 0,00')
    })
  })

  describe('formatCurrencyInput', () => {
    it('formats typed digits progressively into BRL currency format', () => {
      expect(formatCurrencyInput('5').replace(/\u00a0/g, ' ')).toBe('R$ 0,05')
      expect(formatCurrencyInput('150').replace(/\u00a0/g, ' ')).toBe('R$ 1,50')
      expect(formatCurrencyInput('14990').replace(/\u00a0/g, ' ')).toBe('R$ 149,90')
    })

    it('returns empty string when no digits are present', () => {
      expect(formatCurrencyInput('')).toBe('')
      expect(formatCurrencyInput('abc')).toBe('')
    })
  })

  describe('parseCurrencyToRaw', () => {
    it('extracts raw numeric float from masked currency string', () => {
      expect(parseCurrencyToRaw('R$ 149,90')).toBe(149.9)
      expect(parseCurrencyToRaw('R$ 0,05')).toBe(0.05)
      expect(parseCurrencyToRaw('89.99')).toBe(89.99)
    })

    it('returns 0 on empty or invalid currency strings', () => {
      expect(parseCurrencyToRaw('')).toBe(0)
      expect(parseCurrencyToRaw('abc')).toBe(0)
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
    it('formats an ISO date correctly in pt-BR', () => {
      const result = formatDate('2026-09-13T12:00:00Z')
      expect(result).toContain('2026')
      expect(result).toContain('13')
    })

    it('returns fallback dash on invalid or empty date', () => {
      expect(formatDate(undefined)).toBe('—')
      expect(formatDate('')).toBe('—')
      expect(formatDate('invalid-date')).toBe('—')
    })
  })
})
