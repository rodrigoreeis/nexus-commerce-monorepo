import { resolveImageUrl, getStoreProducts } from '../catalog'
import { apiClient } from '../api'

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  apiClient: {
    get: jest.fn(),
  },
}))

describe('catalog service with axios', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('resolveImageUrl', () => {
    it('returns empty string when path is falsy or blank', () => {
      expect(resolveImageUrl('')).toBe('')
      expect(resolveImageUrl(null)).toBe('')
      expect(resolveImageUrl(undefined)).toBe('')
      expect(resolveImageUrl('   ')).toBe('')
    })

    it('returns absolute URL untouched', () => {
      expect(resolveImageUrl('https://example.com/image.jpg')).toBe(
        'https://example.com/image.jpg'
      )
      expect(resolveImageUrl('http://cdn.store.com/item.png')).toBe(
        'http://cdn.store.com/item.png'
      )
    })

    it('prepends API base URL to relative paths with leading slash', () => {
      const resolved = resolveImageUrl('/uploads/product-123.jpg')
      expect(resolved).toBe('http://localhost:8080/uploads/product-123.jpg')
    })

    it('prepends API base URL to relative paths without leading slash', () => {
      const resolved = resolveImageUrl('uploads/product-123.jpg')
      expect(resolved).toBe('http://localhost:8080/uploads/product-123.jpg')
    })
  })

  describe('getStoreProducts', () => {
    it('fetches and maps products correctly from API via axios', async () => {
      const mockApiResponse = {
        data: {
          success: true,
          message: 'Products retrieved successfully',
          data: [
            {
              id: 'prod-1',
              name: 'Mechanical Keyboard',
              description: 'RGB mechanical keyboard',
              price: 129.99,
              image_url: '/uploads/keyboard.jpg',
              created_at: '2026-09-13T00:00:00Z',
              updated_at: '2026-09-13T00:00:00Z',
            },
            {
              id: 'prod-2',
              name: 'Gaming Mouse',
              description: 'Wireless gaming mouse',
              price: '59.99',
              imageUrl: '/uploads/mouse.jpg',
            },
          ],
        },
      }

      ;(apiClient.get as jest.Mock).mockResolvedValueOnce(mockApiResponse)

      const products = await getStoreProducts()

      expect(apiClient.get).toHaveBeenCalledWith('/api/store/products')
      expect(products).toHaveLength(2)
      expect(products[0]).toEqual({
        id: 'prod-1',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard',
        price: 129.99,
        imageUrl: 'http://localhost:8080/uploads/keyboard.jpg',
        createdAt: '2026-09-13T00:00:00Z',
        updatedAt: '2026-09-13T00:00:00Z',
      })
      expect(products[1]).toEqual({
        id: 'prod-2',
        name: 'Gaming Mouse',
        description: 'Wireless gaming mouse',
        price: 59.99,
        imageUrl: 'http://localhost:8080/uploads/mouse.jpg',
        createdAt: undefined,
        updatedAt: undefined,
      })
    })

    it('throws an error if the HTTP response has error status', async () => {
      ;(apiClient.get as jest.Mock).mockRejectedValueOnce({
        response: {
          status: 500,
          statusText: 'Internal Server Error',
        },
      })

      await expect(getStoreProducts()).rejects.toThrow(
        'Failed to fetch products: 500 Internal Server Error'
      )
    })

    it('throws an error if API returns success: false', async () => {
      ;(apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: {
          success: false,
          message: 'Database query failed',
        },
      })

      await expect(getStoreProducts()).rejects.toThrow('Database query failed')
    })

    it('returns an empty array when data is not an array', async () => {
      ;(apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: {
          success: true,
          data: null,
        },
      })

      const products = await getStoreProducts()
      expect(products).toEqual([])
    })
  })
})
