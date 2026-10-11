import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addToCartAction,
  clearCartAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
} from '@/shared/actions/cart'
import { fetchCart, type AddToCartPayload } from '@/shared/services/cart'
import { getOrCreateSessionId } from '@/shared/utils/session'

export const CART_QUERY_KEY = ['store-cart']

/**
 * Hook to fetch the active cart for the current session.
 */
export const useCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    staleTime: 1000 * 30,
    retry: 1,
  })
}

/**
 * Hook to add an item to the cart and invalidate cart cache.
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      addToCartAction({
        sessionId: getOrCreateSessionId(),
        productId: payload.productId,
        quantity: payload.quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}

/**
 * Hook to update cart item quantity and invalidate cart cache.
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemQuantityAction({
        sessionId: getOrCreateSessionId(),
        itemId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}

/**
 * Hook to remove an item from the cart and invalidate cart cache.
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) =>
      removeCartItemAction({
        sessionId: getOrCreateSessionId(),
        itemId,
      }),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart)
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}

/**
 * Hook to clear all items from the cart and invalidate cart cache.
 */
export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      clearCartAction({
        sessionId: getOrCreateSessionId(),
      }),
    onSuccess: (clearedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, clearedCart)
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}
