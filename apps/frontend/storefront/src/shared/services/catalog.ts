import { apiClient, getApiBaseUrl } from './api'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiProductResponse {
  id?: string
  name?: string
  description?: string
  price?: number | string
  image_url?: string
  imageUrl?: string
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  success?: boolean
  message?: string
  data?: T
}

/**
 * Resolves a local or remote product image path to a full URL.
 *
 * @param path - Relative or absolute image path.
 * @returns Fully qualified image URL string.
 */
export const resolveImageUrl = (path?: string | null): string => {
  const hasPath = Boolean(path?.trim())
  if (!hasPath) {
    return ''
  }

  const cleanPath = path!.trim()
  const isAbsoluteUrl = cleanPath.startsWith('http://') || cleanPath.startsWith('https://')
  if (isAbsoluteUrl) {
    return cleanPath
  }

  const baseUrl = getApiBaseUrl()
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  return `${baseUrl}${normalizedPath}`
}

/**
 * Maps an API product response object to the domain Product model.
 *
 * @param item - Raw API product item.
 * @returns Standardized Product domain model.
 */
export const mapApiProductToProduct = (item: ApiProductResponse): Product => {
  const rawImage = item?.imageUrl || item?.image_url || ''
  const rawPrice = item?.price
  const parsedPrice = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice) || 0

  return {
    id: String(item?.id ?? ''),
    name: String(item?.name ?? ''),
    description: String(item?.description ?? ''),
    price: parsedPrice,
    imageUrl: resolveImageUrl(rawImage),
    createdAt: item?.created_at ? String(item.created_at) : undefined,
    updatedAt: item?.updated_at ? String(item.updated_at) : undefined,
  }
}

/**
 * Fetches the active product catalog from the Go backend using Axios.
 *
 * @returns Promise resolving to an array of Products.
 */
export const getStoreProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ApiProductResponse[]>>('/api/store/products')
    const apiResponse = response?.data
    const isSuccess = apiResponse?.success !== false

    if (!isSuccess) {
      const errorMessage = apiResponse?.message || 'Failed to fetch products from catalog'
      throw new Error(errorMessage)
    }

    const rawProducts = Array.isArray(apiResponse?.data) ? apiResponse.data : []
    return rawProducts.map(mapApiProductToProduct)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }

    const hasHttpStatus = Boolean(error?.response?.status)
    if (hasHttpStatus) {
      const statusText = error.response?.statusText ? ` ${error.response.statusText}` : ''
      throw new Error(`Failed to fetch products: ${error.response.status}${statusText}`.trim())
    }

    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to fetch products')
  }
}
