import { apiClient } from './api'
import {
  mapApiProductToProduct,
  type ApiProductResponse,
  type ApiResponse,
  type Product,
} from './catalog'

export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: Product
  subtotal: number
  createdAt?: string
  updatedAt?: string
}

export interface Cart {
  id: string
  sessionId: string
  items: CartItem[]
  subtotal: number
  createdAt?: string
  updatedAt?: string
}

export interface AddToCartPayload {
  productId: string
  quantity?: number
}

export interface ApiCartItemResponse {
  id: string
  cart_id?: string
  cartId?: string
  product_id?: string
  productId?: string
  quantity: number
  product: ApiProductResponse
  subtotal?: number | string
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

export interface ApiCartResponse {
  id?: string
  session_id?: string
  sessionId?: string
  items?: ApiCartItemResponse[]
  subtotal?: number | string
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

/**
 * Maps raw API cart item response to domain CartItem entity.
 *
 * @param item - Raw API cart item.
 * @returns Clean CartItem domain model.
 */
export const mapApiCartItemToCartItem = (item: ApiCartItemResponse): CartItem => {
  const rawSubtotal = item?.subtotal
  const parsedSubtotal = typeof rawSubtotal === 'number' ? rawSubtotal : Number(rawSubtotal) || 0

  return {
    id: String(item?.id ?? ''),
    cartId: String(item?.cart_id ?? item?.cartId ?? ''),
    productId: String(item?.product_id ?? item?.productId ?? ''),
    quantity: Number(item?.quantity) || 1,
    product: mapApiProductToProduct(item?.product ?? {}),
    subtotal: parsedSubtotal,
    createdAt: item?.created_at ? String(item.created_at) : undefined,
    updatedAt: item?.updated_at ? String(item.updated_at) : undefined,
  }
}

/**
 * Maps raw API cart response to domain Cart entity.
 *
 * @param apiCart - Raw API cart response.
 * @returns Clean Cart domain model.
 */
export const mapApiCartToCart = (apiCart: ApiCartResponse): Cart => {
  const rawSubtotal = apiCart?.subtotal
  const parsedSubtotal = typeof rawSubtotal === 'number' ? rawSubtotal : Number(rawSubtotal) || 0
  const rawItems = Array.isArray(apiCart?.items) ? apiCart.items : []

  return {
    id: String(apiCart?.id ?? ''),
    sessionId: String(apiCart?.session_id ?? apiCart?.sessionId ?? ''),
    items: rawItems.map(mapApiCartItemToCartItem),
    subtotal: parsedSubtotal,
    createdAt: apiCart?.created_at ? String(apiCart.created_at) : undefined,
    updatedAt: apiCart?.updated_at ? String(apiCart.updated_at) : undefined,
  }
}

/**
 * Fetches the active anonymous cart for the current session.
 *
 * @returns Promise resolving to domain Cart.
 */
export const fetchCart = async (): Promise<Cart> => {
  try {
    const response = await apiClient.get<ApiResponse<ApiCartResponse>>('/api/store/cart')
    const apiResponse = response?.data
    const isSuccess = Boolean(apiResponse?.success !== false && apiResponse?.data)

    if (!isSuccess) {
      const errorMessage = apiResponse?.message || 'Failed to fetch cart'
      throw new Error(errorMessage)
    }

    return mapApiCartToCart(apiResponse!.data!)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }
    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to fetch cart')
  }
}

/**
 * Adds an item to the cart or increments quantity.
 *
 * @param payload - Product ID and optional quantity.
 * @returns Promise resolving to updated Cart.
 */
export const addToCart = async (payload: AddToCartPayload): Promise<Cart> => {
  try {
    const response = await apiClient.post<ApiResponse<ApiCartResponse>>('/api/store/cart/items', {
      product_id: payload.productId,
      quantity: payload.quantity ?? 1,
    })
    const apiResponse = response?.data
    const isSuccess = Boolean(apiResponse?.success !== false && apiResponse?.data)

    if (!isSuccess) {
      const errorMessage = apiResponse?.message || 'Failed to add item to cart'
      throw new Error(errorMessage)
    }

    return mapApiCartToCart(apiResponse!.data!)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }
    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to add item to cart')
  }
}

/**
 * Updates the quantity of an existing item in the cart.
 *
 * @param itemId - Unique UUID of the cart item.
 * @param quantity - Desired new quantity.
 * @returns Promise resolving to updated Cart.
 */
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<Cart> => {
  try {
    const response = await apiClient.patch<ApiResponse<ApiCartResponse>>(`/api/store/cart/items/${itemId}`, {
      quantity,
    })
    const apiResponse = response?.data
    const isSuccess = Boolean(apiResponse?.success !== false && apiResponse?.data)

    if (!isSuccess) {
      const errorMessage = apiResponse?.message || 'Failed to update cart item quantity'
      throw new Error(errorMessage)
    }

    return mapApiCartToCart(apiResponse!.data!)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }
    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to update cart item quantity')
  }
}

/**
 * Removes an item from the cart.
 *
 * @param itemId - Unique UUID of the cart item.
 * @returns Promise resolving to updated Cart.
 */
export const removeCartItem = async (itemId: string): Promise<Cart> => {
  try {
    const response = await apiClient.delete<ApiResponse<ApiCartResponse>>(`/api/store/cart/items/${itemId}`)
    const apiResponse = response?.data
    const isSuccess = Boolean(apiResponse?.success !== false && apiResponse?.data)

    if (!isSuccess) {
      const errorMessage = apiResponse?.message || 'Failed to remove item from cart'
      throw new Error(errorMessage)
    }

    return mapApiCartToCart(apiResponse!.data!)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }
    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to remove item from cart')
  }
}

/**
 * Clears all items from the active cart.
 *
 * @returns Promise resolving to the cleared empty Cart.
 */
export const clearCart = async (): Promise<Cart> => {
  try {
    const response = await apiClient.delete<ApiResponse<ApiCartResponse>>('/api/store/cart')
    const apiResponse = response?.data
    const isSuccess = Boolean(apiResponse?.success !== false && apiResponse?.data)

    if (!isSuccess) {
      const errorMessage = apiResponse?.message || 'Failed to clear cart'
      throw new Error(errorMessage)
    }

    return mapApiCartToCart(apiResponse!.data!)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }
    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to clear cart')
  }
}

