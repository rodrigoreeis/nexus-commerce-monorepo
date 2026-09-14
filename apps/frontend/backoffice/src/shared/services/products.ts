import { apiClient, getApiBaseUrl } from './api'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  createdAt: string
}

export interface ApiProductPayload {
  id: string
  name: string
  description?: string
  price: number | string
  image_url?: string
  imageUrl?: string
  created_at?: string
  createdAt?: string
}

export interface ApiResponse<T> {
  success?: boolean
  error?: boolean
  message?: string
  data?: T
}

/**
 * Maps raw API product payload to the standardized Product interface.
 *
 * @param item - Raw API product payload.
 * @returns Clean Product entity.
 */
export const mapApiProductToProduct = (item: ApiProductPayload): Product => {
  const numericPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
  const resolvedImageUrl = item.imageUrl ?? item.image_url ?? ''
  const resolvedCreatedAt = item.createdAt ?? item.created_at ?? ''

  return {
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: numericPrice,
    imageUrl: resolvedImageUrl,
    createdAt: resolvedCreatedAt,
  }
}

/**
 * Resolves full asset URL for product images.
 *
 * @param imageUrl - Relative or absolute image path.
 * @returns Fully qualified image URL string.
 */
export const getProductImageUrl = (imageUrl?: string): string => {
  const hasImageUrl = Boolean(imageUrl?.trim())
  if (!hasImageUrl) {
    return ''
  }

  const cleanImageUrl = imageUrl!.trim()
  const isAbsoluteUrl = cleanImageUrl.startsWith('http://') || cleanImageUrl.startsWith('https://')
  if (isAbsoluteUrl) {
    return cleanImageUrl
  }

  const baseUrl = getApiBaseUrl()
  const normalizedPath = cleanImageUrl.startsWith('/') ? cleanImageUrl : `/${cleanImageUrl}`
  return `${baseUrl}${normalizedPath}`
}

/**
 * Creates a new product on the backend API via multipart/form-data.
 *
 * @param formData - FormData with product fields and asset image.
 * @returns Newly created Product model.
 */
export const createAdminProduct = async (formData: FormData): Promise<Product> => {
  try {
    const response = await apiClient.post<ApiResponse<ApiProductPayload>>('/api/admin/products', formData)
    const apiResponse = response?.data
    const isSuccessful = Boolean(apiResponse?.success && apiResponse?.data)

    if (!isSuccessful) {
      const errorMessage = apiResponse?.message || 'Failed to create product'
      throw new Error(errorMessage)
    }

    return mapApiProductToProduct(apiResponse.data!)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }

    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to create product')
  }
}

/**
 * Fetches all products for admin management.
 *
 * @returns Array of Product models.
 */
export const fetchAdminProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ApiProductPayload[]>>('/api/admin/products')
    const apiResponse = response?.data
    const isSuccessful = Boolean(apiResponse?.success && Array.isArray(apiResponse?.data))

    if (!isSuccessful) {
      const errorMessage = apiResponse?.message || 'Failed to fetch products'
      throw new Error(errorMessage)
    }

    return apiResponse.data!.map(mapApiProductToProduct)
  } catch (error: any) {
    const hasCustomMessage = Boolean(error?.response?.data?.message)
    if (hasCustomMessage) {
      throw new Error(error.response.data.message)
    }

    const isStandardError = error instanceof Error
    throw isStandardError ? error : new Error('Failed to fetch products')
  }
}
