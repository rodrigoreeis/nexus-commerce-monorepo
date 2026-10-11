import { fetchCart } from '../cart'
import { apiClient } from '../api'

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  apiClient: {
    get: jest.fn(),
  },
}))

describe('cart service with axios', () => {
  const mockCartData = {
    id: 'cart-1',
    session_id: 'test-session',
    items: [
      {
        id: 'item-1',
        cart_id: 'cart-1',
        product_id: 'prod-1',
        quantity: 2,
        subtotal: 199.98,
        product: {
          id: 'prod-1',
          name: 'Mechanical Keyboard',
          description: 'RGB switches',
          price: 99.99,
          image_url: '/uploads/keyboard.jpg',
        },
      },
    ],
    subtotal: 199.98,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches cart successfully via GET /api/store/cart', async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockCartData,
      },
    })

    const cart = await fetchCart()

    expect(apiClient.get).toHaveBeenCalledWith('/api/store/cart')
    expect(cart.id).toBe('cart-1')
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].product.name).toBe('Mechanical Keyboard')
    expect(cart.subtotal).toBe(199.98)
  })

  it('throws error when API returns success false or missing data', async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        success: false,
        message: 'Cart not found',
      },
    })

    await expect(fetchCart()).rejects.toThrow('Cart not found')
  })

  it('handles axios error with response message', async () => {
    ;(apiClient.get as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          message: 'Server error',
        },
      },
    })

    await expect(fetchCart()).rejects.toThrow('Server error')
  })
})
