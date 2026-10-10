import { addToCartAction } from '../cart'

describe('addToCartAction', () => {
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
