import {
  addToCartAction,
  clearCartAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
} from '../cart'

describe('Cart Server Actions', () => {
  const originalFetch = global.fetch
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    global.fetch = originalFetch
    process.env = originalEnv
    jest.clearAllMocks()
  })

  const mockCartApiResponse = {
    id: 'cart-123',
    session_id: 'session-456',
    items: [
      {
        id: 'item-1',
        cart_id: 'cart-123',
        product_id: 'prod-789',
        quantity: 2,
        subtotal: 100,
        product: {
          id: 'prod-789',
          name: 'Mechanical Keyboard',
          description: 'Tactile switch keyboard',
          price: 50,
          image_url: 'https://example.com/keyboard.jpg',
        },
      },
    ],
    subtotal: 100,
  }

  describe('addToCartAction', () => {
    it('adds item to cart successfully and returns mapped Cart entity', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockCartApiResponse,
        }),
      })

      const result = await addToCartAction({
        sessionId: 'session-456',
        productId: 'prod-789',
        quantity: 2,
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/store/cart/items',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Session-ID': 'session-456',
          },
          body: JSON.stringify({
            product_id: 'prod-789',
            quantity: 2,
          }),
          cache: 'no-store',
        }
      )

      expect(result.id).toBe('cart-123')
      expect(result.sessionId).toBe('session-456')
      expect(result.items).toHaveLength(1)
      expect(result.items[0].productId).toBe('prod-789')
      expect(result.items[0].quantity).toBe(2)
      expect(result.subtotal).toBe(100)
    })

    it('uses default quantity of 1 when quantity is omitted', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockCartApiResponse,
        }),
      })

      await addToCartAction({
        sessionId: 'session-456',
        productId: 'prod-789',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            product_id: 'prod-789',
            quantity: 1,
          }),
        })
      )
    })

    it('uses INTERNAL_API_URL when set in environment', async () => {
      process.env.INTERNAL_API_URL = 'http://internal-backend:8080/'

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockCartApiResponse,
        }),
      })

      await addToCartAction({
        sessionId: 'session-456',
        productId: 'prod-789',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://internal-backend:8080/api/store/cart/items',
        expect.any(Object)
      )
    })

    it('throws an error if sessionId is empty or missing', async () => {
      await expect(
        addToCartAction({
          sessionId: '',
          productId: 'prod-789',
        })
      ).rejects.toThrow('Session ID is required to add an item to the cart')
    })

    it('throws an error if productId is empty or missing', async () => {
      await expect(
        addToCartAction({
          sessionId: 'session-456',
          productId: '   ',
        })
      ).rejects.toThrow('Product ID is required to add an item to the cart')
    })

    it('throws error when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Product out of stock',
        }),
      })

      await expect(
        addToCartAction({
          sessionId: 'session-456',
          productId: 'prod-789',
        })
      ).rejects.toThrow('Product out of stock')
    })

    it('throws error when api returns success false or missing data', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          message: 'Item could not be added',
          data: null,
        }),
      })

      await expect(
        addToCartAction({
          sessionId: 'session-456',
          productId: 'prod-789',
        })
      ).rejects.toThrow('Item could not be added')
    })
  })

  describe('updateCartItemQuantityAction', () => {
    it('updates quantity of an item via PATCH /api/store/cart/items/:id', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            ...mockCartApiResponse,
            items: [
              {
                ...mockCartApiResponse.items[0],
                quantity: 4,
                subtotal: 200,
              },
            ],
            subtotal: 200,
          },
        }),
      })

      const result = await updateCartItemQuantityAction({
        sessionId: 'session-456',
        itemId: 'item-1',
        quantity: 4,
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/store/cart/items/item-1',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Session-ID': 'session-456',
          },
          body: JSON.stringify({
            quantity: 4,
          }),
          cache: 'no-store',
        }
      )

      expect(result.items[0].quantity).toBe(4)
      expect(result.subtotal).toBe(200)
    })

    it('throws error if sessionId or itemId is missing', async () => {
      await expect(
        updateCartItemQuantityAction({
          sessionId: '',
          itemId: 'item-1',
          quantity: 2,
        })
      ).rejects.toThrow('Session ID is required to update cart item')

      await expect(
        updateCartItemQuantityAction({
          sessionId: 'session-456',
          itemId: '  ',
          quantity: 2,
        })
      ).rejects.toThrow('Item ID is required to update cart item')
    })

    it('throws error if quantity is invalid', async () => {
      await expect(
        updateCartItemQuantityAction({
          sessionId: 'session-456',
          itemId: 'item-1',
          quantity: 0,
        })
      ).rejects.toThrow('Quantity must be greater than or equal to 1')
    })

    it('throws error when update fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Item not found',
        }),
      })

      await expect(
        updateCartItemQuantityAction({
          sessionId: 'session-456',
          itemId: 'item-1',
          quantity: 2,
        })
      ).rejects.toThrow('Item not found')
    })
  })

  describe('removeCartItemAction', () => {
    it('removes item via DELETE /api/store/cart/items/:id', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            ...mockCartApiResponse,
            items: [],
            subtotal: 0,
          },
        }),
      })

      const result = await removeCartItemAction({
        sessionId: 'session-456',
        itemId: 'item-1',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/store/cart/items/item-1',
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'X-Session-ID': 'session-456',
          },
          cache: 'no-store',
        }
      )

      expect(result.items).toHaveLength(0)
      expect(result.subtotal).toBe(0)
    })

    it('throws error if sessionId or itemId is missing', async () => {
      await expect(
        removeCartItemAction({
          sessionId: '',
          itemId: 'item-1',
        })
      ).rejects.toThrow('Session ID is required to remove cart item')

      await expect(
        removeCartItemAction({
          sessionId: 'session-456',
          itemId: '  ',
        })
      ).rejects.toThrow('Item ID is required to remove cart item')
    })

    it('throws error when remove fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Could not remove item',
        }),
      })

      await expect(
        removeCartItemAction({
          sessionId: 'session-456',
          itemId: 'item-1',
        })
      ).rejects.toThrow('Could not remove item')
    })
  })

  describe('clearCartAction', () => {
    it('clears active cart via DELETE /api/store/cart', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            ...mockCartApiResponse,
            items: [],
            subtotal: 0,
          },
        }),
      })

      const result = await clearCartAction({
        sessionId: 'session-456',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/store/cart',
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'X-Session-ID': 'session-456',
          },
          cache: 'no-store',
        }
      )

      expect(result.items).toHaveLength(0)
      expect(result.subtotal).toBe(0)
    })

    it('throws error if sessionId is missing', async () => {
      await expect(
        clearCartAction({
          sessionId: '',
        })
      ).rejects.toThrow('Session ID is required to clear the cart')
    })

    it('throws error when clear cart fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Failed to clear',
        }),
      })

      await expect(
        clearCartAction({
          sessionId: 'session-456',
        })
      ).rejects.toThrow('Failed to clear')
    })
  })
})
