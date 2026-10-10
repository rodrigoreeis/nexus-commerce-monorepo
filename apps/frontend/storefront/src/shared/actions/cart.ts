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

  const baseUrl = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')

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
