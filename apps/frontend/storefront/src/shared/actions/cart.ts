'use server'

import {
  type Cart,
  type ApiCartResponse,
  mapApiCartToCart,
} from '@/shared/services/cart'
import type { ApiResponse } from '@/shared/services/catalog'

export interface AddToCartActionPayload {
  sessionId: string
  productId: string
  quantity?: number
}

export interface UpdateCartItemQuantityActionPayload {
  sessionId: string
  itemId: string
  quantity: number
}

export interface RemoveCartItemActionPayload {
  sessionId: string
  itemId: string
}

export interface ClearCartActionPayload {
  sessionId: string
}

const getBaseUrl = (): string => {
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')
}

export async function addToCartAction(payload: AddToCartActionPayload): Promise<Cart> {
  const sessionId = payload?.sessionId?.trim()
  const productId = payload?.productId?.trim()
  const quantity = payload?.quantity ?? 1

  if (!sessionId) {
    throw new Error('Session ID is required to add an item to the cart')
  }

  if (!productId) {
    throw new Error('Product ID is required to add an item to the cart')
  }

  const baseUrl = getBaseUrl()

  const response = await fetch(`${baseUrl}/api/store/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Session-ID': sessionId,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
    cache: 'no-store',
  })

  const data: ApiResponse<ApiCartResponse> = await response.json()

  if (!response.ok || data?.success === false || !data?.data) {
    const errorMsg = data?.message || 'Falha ao adicionar item ao carrinho'
    throw new Error(errorMsg)
  }

  return mapApiCartToCart(data.data)
}

export async function updateCartItemQuantityAction(payload: UpdateCartItemQuantityActionPayload): Promise<Cart> {
  const sessionId = payload?.sessionId?.trim()
  const itemId = payload?.itemId?.trim()
  const quantity = payload?.quantity

  if (!sessionId) {
    throw new Error('Session ID is required to update cart item')
  }

  if (!itemId) {
    throw new Error('Item ID is required to update cart item')
  }

  if (typeof quantity !== 'number' || quantity < 1) {
    throw new Error('Quantity must be greater than or equal to 1')
  }

  const baseUrl = getBaseUrl()

  const response = await fetch(`${baseUrl}/api/store/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Session-ID': sessionId,
    },
    body: JSON.stringify({
      quantity,
    }),
    cache: 'no-store',
  })

  const data: ApiResponse<ApiCartResponse> = await response.json()

  if (!response.ok || data?.success === false || !data?.data) {
    const errorMsg = data?.message || 'Falha ao atualizar quantidade do item'
    throw new Error(errorMsg)
  }

  return mapApiCartToCart(data.data)
}

export async function removeCartItemAction(payload: RemoveCartItemActionPayload): Promise<Cart> {
  const sessionId = payload?.sessionId?.trim()
  const itemId = payload?.itemId?.trim()

  if (!sessionId) {
    throw new Error('Session ID is required to remove cart item')
  }

  if (!itemId) {
    throw new Error('Item ID is required to remove cart item')
  }

  const baseUrl = getBaseUrl()

  const response = await fetch(`${baseUrl}/api/store/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'X-Session-ID': sessionId,
    },
    cache: 'no-store',
  })

  const data: ApiResponse<ApiCartResponse> = await response.json()

  if (!response.ok || data?.success === false || !data?.data) {
    const errorMsg = data?.message || 'Falha ao remover item do carrinho'
    throw new Error(errorMsg)
  }

  return mapApiCartToCart(data.data)
}

export async function clearCartAction(payload: ClearCartActionPayload): Promise<Cart> {
  const sessionId = payload?.sessionId?.trim()

  if (!sessionId) {
    throw new Error('Session ID is required to clear the cart')
  }

  const baseUrl = getBaseUrl()

  const response = await fetch(`${baseUrl}/api/store/cart`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'X-Session-ID': sessionId,
    },
    cache: 'no-store',
  })

  const data: ApiResponse<ApiCartResponse> = await response.json()

  if (!response.ok || data?.success === false || !data?.data) {
    const errorMsg = data?.message || 'Falha ao limpar carrinho'
    throw new Error(errorMsg)
  }

  return mapApiCartToCart(data.data)
}
