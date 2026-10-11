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

