import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useAddToCart, useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from '../useCart'
import * as cartActions from '@/shared/actions/cart'
import * as cartService from '@/shared/services/cart'

jest.mock('@/shared/actions/cart', () => ({
  addToCartAction: jest.fn(),
  updateCartItemQuantityAction: jest.fn(),
  removeCartItemAction: jest.fn(),
  clearCartAction: jest.fn(),
}))

jest.mock('@/shared/utils/session', () => ({
  getOrCreateSessionId: jest.fn(() => 'mock-session-1'),
}))

jest.mock('@/shared/services/cart', () => ({
  fetchCart: jest.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper
}

describe('useCart hooks', () => {
  const mockCart: cartService.Cart = {
    id: 'cart-1',
    sessionId: 'session-1',
    items: [
      {
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'prod-1',
        quantity: 1,
        subtotal: 50,
        product: {
          id: 'prod-1',
          name: 'Keyboard',
          description: '',
          price: 50,
          imageUrl: '',
        },
      },
    ],
    subtotal: 50,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches cart using useCart', async () => {
    ;(cartService.fetchCart as jest.Mock).mockResolvedValue(mockCart)

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(cartService.fetchCart).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(mockCart)
  })

  it('adds item to cart using useAddToCart', async () => {
    ;(cartActions.addToCartAction as jest.Mock).mockResolvedValue(mockCart)

    const { result } = renderHook(() => useAddToCart(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ productId: 'prod-1', quantity: 1 })

    expect(cartActions.addToCartAction).toHaveBeenCalledWith({
      sessionId: 'mock-session-1',
      productId: 'prod-1',
      quantity: 1,
    })
  })

  it('updates cart item quantity using useUpdateCartItem', async () => {
    ;(cartActions.updateCartItemQuantityAction as jest.Mock).mockResolvedValue(mockCart)

    const { result } = renderHook(() => useUpdateCartItem(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ itemId: 'item-1', quantity: 3 })

    expect(cartActions.updateCartItemQuantityAction).toHaveBeenCalledWith({
      sessionId: 'mock-session-1',
      itemId: 'item-1',
      quantity: 3,
    })
  })

  it('removes cart item using useRemoveCartItem', async () => {
    ;(cartActions.removeCartItemAction as jest.Mock).mockResolvedValue(mockCart)

    const { result } = renderHook(() => useRemoveCartItem(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('item-1')

    expect(cartActions.removeCartItemAction).toHaveBeenCalledWith({
      sessionId: 'mock-session-1',
      itemId: 'item-1',
    })
  })

  it('clears cart using useClearCart', async () => {
    ;(cartActions.clearCartAction as jest.Mock).mockResolvedValue({
      ...mockCart,
      items: [],
      subtotal: 0,
    })

    const { result } = renderHook(() => useClearCart(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync()

    expect(cartActions.clearCartAction).toHaveBeenCalledWith({
      sessionId: 'mock-session-1',
    })
  })
})
