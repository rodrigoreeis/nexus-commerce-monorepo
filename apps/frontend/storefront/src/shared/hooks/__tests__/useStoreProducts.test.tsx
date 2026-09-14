import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useStoreProducts } from '../useStoreProducts'
import * as catalogService from '@/shared/services/catalog'

jest.mock('@/shared/services/catalog', () => ({
  getStoreProducts: jest.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper
}

describe('useStoreProducts Hook', () => {
  const mockProducts: catalogService.Product[] = [
    {
      id: 'prod-1',
      name: 'Wireless Controller',
      description: 'Low-latency Bluetooth gaming controller.',
      price: 69.99,
      imageUrl: 'http://localhost:8080/uploads/controller.jpg',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(catalogService.getStoreProducts as jest.Mock).mockResolvedValue(mockProducts)
  })

  it('uses initialData immediately without fetching if provided', () => {
    const { result } = renderHook(() => useStoreProducts(mockProducts), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(mockProducts)
    expect(result.current.isLoading).toBe(false)
  })

  it('fetches store products from service when initialData is not provided', async () => {
    ;(catalogService.getStoreProducts as jest.Mock).mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useStoreProducts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(catalogService.getStoreProducts).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(mockProducts)
  })
})
