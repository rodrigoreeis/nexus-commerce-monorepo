import { addToCart, clearCart, fetchCart, removeCartItem, updateCartItemQuantity } from '../cart'
import { apiClient } from '../api'

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
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

  it('adds item to cart successfully via POST /api/store/cart/items', async () => {
    ;(apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockCartData,
      },
    })

    const cart = await addToCart({ productId: 'prod-1', quantity: 2 })

    expect(apiClient.post).toHaveBeenCalledWith('/api/store/cart/items', {
      product_id: 'prod-1',
      quantity: 2,
    })
    expect(cart.items).toHaveLength(1)
  })

  it('updates cart item quantity via PATCH /api/store/cart/items/:id', async () => {
    ;(apiClient.patch as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockCartData,
      },
    })

    const cart = await updateCartItemQuantity('item-1', 3)

    expect(apiClient.patch).toHaveBeenCalledWith('/api/store/cart/items/item-1', {
      quantity: 3,
    })
    expect(cart.id).toBe('cart-1')
  })

  it('removes cart item via DELETE /api/store/cart/items/:id', async () => {
    ;(apiClient.delete as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          ...mockCartData,
          items: [],
          subtotal: 0,
        },
      },
    })

    const cart = await removeCartItem('item-1')

    expect(apiClient.delete).toHaveBeenCalledWith('/api/store/cart/items/item-1')
    expect(cart.items).toHaveLength(0)
    expect(cart.subtotal).toBe(0)
  })

  it('clears active cart via DELETE /api/store/cart', async () => {
    ;(apiClient.delete as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          ...mockCartData,
          items: [],
          subtotal: 0,
        },
      },
    })

    const cart = await clearCart()

    expect(apiClient.delete).toHaveBeenCalledWith('/api/store/cart')
    expect(cart.items).toHaveLength(0)
    expect(cart.subtotal).toBe(0)
  })
})
