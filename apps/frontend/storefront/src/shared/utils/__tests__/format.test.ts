import { formatStorePrice, truncateDescription } from '../format'

describe('Storefront format utils', () => {
  describe('formatStorePrice', () => {
    it('formats valid price correctly', () => {
      expect(formatStorePrice(249.99)).toBe('$249.99')
    })

    it('handles undefined or null amounts safely', () => {
      expect(formatStorePrice(undefined)).toBe('$0.00')
      expect(formatStorePrice(null)).toBe('$0.00')
    })
  })

  describe('truncateDescription', () => {
    it('returns original string when within limit', () => {
      expect(truncateDescription('Nexus Mechanical Keyboard', 50)).toBe(
        'Nexus Mechanical Keyboard'
      )
    })

    it('truncates text exceeding limit and appends ellipsis', () => {
      const longText = 'High quality precision engineered aluminum chassis with hot-swappable switches'
      const truncated = truncateDescription(longText, 25)
      expect(truncated).toBe('High quality precision en…')
    })

    it('handles falsy input safely', () => {
      expect(truncateDescription(undefined)).toBe('')
      expect(truncateDescription('')).toBe('')
    })
  })
})
