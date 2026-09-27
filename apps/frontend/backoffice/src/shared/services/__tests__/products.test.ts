import '@testing-library/jest-dom'
import { apiClient } from '../api'
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  getProductImageUrl,
  mapApiProductToProduct,
  updateAdminProduct,
} from '../products'

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('products service with axios', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('mapApiProductToProduct', () => {
    it('maps snake_case fields correctly to camelCase', () => {
      const apiItem = {
        id: 'p-1',
        name: 'Gaming Mouse',
        description: 'RGB wireless',
        price: '49.99',
        image_url: '/uploads/mouse.png',
        created_at: '2026-09-13T20:00:00Z',
      }

      const product = mapApiProductToProduct(apiItem)

      expect(product).toEqual({
        id: 'p-1',
        name: 'Gaming Mouse',
        description: 'RGB wireless',
        price: 49.99,
        imageUrl: '/uploads/mouse.png',
        createdAt: '2026-09-13T20:00:00Z',
      })
    })

    it('handles camelCase and fallback fields', () => {
      const apiItem = {
        id: 'p-2',
        name: 'Mechanical Keyboard',
        price: 120,
        imageUrl: 'http://cdn.example.com/keyboard.png',
        createdAt: '2026-09-13T21:00:00Z',
      }

      const product = mapApiProductToProduct(apiItem)

      expect(product.description).toBe('')
      expect(product.imageUrl).toBe('http://cdn.example.com/keyboard.png')
    })
  })

  describe('getProductImageUrl', () => {
    it('returns empty string when url is empty or undefined', () => {
      expect(getProductImageUrl('')).toBe('')
      expect(getProductImageUrl(undefined)).toBe('')
    })

    it('returns absolute external URLs unmodified', () => {
      const url = 'https://images.unsplash.com/photo-123'
      expect(getProductImageUrl(url)).toBe(url)
    })

    it('resolves relative upload paths to base url', () => {
      expect(getProductImageUrl('/uploads/img.png')).toBe('http://localhost:8080/uploads/img.png')
      expect(getProductImageUrl('uploads/img.png')).toBe('http://localhost:8080/uploads/img.png')
    })
  })

  describe('fetchAdminProducts', () => {
    it('fetches products successfully via axios', async () => {
      const mockApiResponse = {
        data: {
          success: true,
          data: [
            {
              id: 'prod-1',
              name: 'Headphones',
              description: 'Noise cancelling',
              price: 199.99,
              image_url: '/uploads/headphones.jpg',
              created_at: '2026-09-13T10:00:00Z',
            },
          ],
        },
      }

      ;(apiClient.get as jest.Mock).mockResolvedValueOnce(mockApiResponse)

      const products = await fetchAdminProducts()

      expect(apiClient.get).toHaveBeenCalledWith('/api/admin/products')
      expect(products).toHaveLength(1)
      expect(products[0].name).toBe('Headphones')
      expect(products[0].imageUrl).toBe('/uploads/headphones.jpg')
    })

    it('throws error when api returns unsuccessful payload', async () => {
      ;(apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: {
          success: false,
          message: 'Internal server error',
        },
      })

      await expect(fetchAdminProducts()).rejects.toThrow('Internal server error')
    })
  })

  describe('createAdminProduct', () => {
    it('posts FormData via axios and returns created product', async () => {
      const mockCreated = {
        data: {
          success: true,
          data: {
            id: 'prod-99',
            name: 'Monitor 4K',
            description: '32 inch OLED',
            price: 799.9,
            image_url: '/uploads/monitor.jpg',
            created_at: '2026-09-13T12:00:00Z',
          },
        },
      }

      ;(apiClient.post as jest.Mock).mockResolvedValueOnce(mockCreated)

      const formData = new FormData()
      formData.append('name', 'Monitor 4K')
      formData.append('price', '799.90')

      const result = await createAdminProduct(formData)

      expect(apiClient.post).toHaveBeenCalledWith('/api/admin/products', formData)
      expect(result.id).toBe('prod-99')
      expect(result.name).toBe('Monitor 4K')
      expect(result.imageUrl).toBe('/uploads/monitor.jpg')
    })

    it('throws error with message from api when creation fails', async () => {
      ;(apiClient.post as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            message: 'Product image is required',
          },
        },
      })

      const formData = new FormData()
      await expect(createAdminProduct(formData)).rejects.toThrow('Product image is required')
    })
  })

  describe('deleteAdminProduct', () => {
    it('deletes product successfully via axios DELETE', async () => {
      ;(apiClient.delete as jest.Mock).mockResolvedValueOnce({
        data: {
          success: true,
          message: 'Product deleted successfully',
        },
      })

      await deleteAdminProduct('prod-123')

      expect(apiClient.delete).toHaveBeenCalledWith('/api/admin/products/prod-123')
    })

    it('throws error when api returns error in payload', async () => {
      ;(apiClient.delete as jest.Mock).mockResolvedValueOnce({
        data: {
          error: true,
          message: 'Product not found',
        },
      })

      await expect(deleteAdminProduct('prod-999')).rejects.toThrow('Product not found')
    })

    it('throws error with message from error response when request fails', async () => {
      ;(apiClient.delete as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            message: 'Invalid product ID format',
          },
        },
      })

      await expect(deleteAdminProduct('invalid-id')).rejects.toThrow('Invalid product ID format')
    })
  })

  describe('updateAdminProduct', () => {
    it('updates product successfully via axios PUT and returns updated product', async () => {
      const mockUpdated = {
        data: {
          success: true,
          data: {
            id: 'prod-456',
            name: 'Updated Headset',
            description: 'Wireless 7.1',
            price: 249.9,
            image_url: '/uploads/headset.jpg',
            created_at: '2026-09-13T10:00:00Z',
          },
        },
      }

      ;(apiClient.put as jest.Mock).mockResolvedValueOnce(mockUpdated)

      const formData = new FormData()
      formData.append('name', 'Updated Headset')

      const result = await updateAdminProduct({ id: 'prod-456', formData })

      expect(apiClient.put).toHaveBeenCalledWith('/api/admin/products/prod-456', formData)
      expect(result.id).toBe('prod-456')
      expect(result.name).toBe('Updated Headset')
      expect(result.price).toBe(249.9)
    })

    it('throws error when api returns unsuccessful payload on update', async () => {
      ;(apiClient.put as jest.Mock).mockResolvedValueOnce({
        data: {
          success: false,
          message: 'Product not found',
        },
      })

      const formData = new FormData()
      await expect(updateAdminProduct({ id: 'prod-missing', formData })).rejects.toThrow('Product not found')
    })

    it('throws error with message from error response when update request fails', async () => {
      ;(apiClient.put as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            message: 'Product name is required',
          },
        },
      })

      const formData = new FormData()
      await expect(updateAdminProduct({ id: 'prod-1', formData })).rejects.toThrow('Product name is required')
    })
  })
})

