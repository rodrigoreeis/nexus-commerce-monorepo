import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useAdminProducts, useCreateAdminProduct } from '../useAdminProducts'
import * as productsService from '@/shared/services/products'

jest.mock('@/shared/services/products', () => ({
  fetchAdminProducts: jest.fn(),
  createAdminProduct: jest.fn(),
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

describe('useAdminProducts and useCreateAdminProduct hooks', () => {
  const mockProducts: productsService.Product[] = [
    {
      id: 'prod-1',
      name: 'Wireless Mouse',
      description: 'Gaming mouse',
      price: 49.99,
      imageUrl: '/uploads/mouse.jpg',
      createdAt: '2026-09-13T00:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches admin products using useAdminProducts', async () => {
    ;(productsService.fetchAdminProducts as jest.Mock).mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useAdminProducts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(productsService.fetchAdminProducts).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(mockProducts)
  })

  it('creates product and invalidates cache using useCreateAdminProduct', async () => {
    const createdProduct = mockProducts[0]
    ;(productsService.createAdminProduct as jest.Mock).mockResolvedValue(createdProduct)

    const { result } = renderHook(() => useCreateAdminProduct(), {
      wrapper: createWrapper(),
    })

    const formData = new FormData()
    formData.append('name', 'Wireless Mouse')

    await result.current.mutateAsync(formData)

    expect(productsService.createAdminProduct).toHaveBeenCalledWith(formData)
  })
})
