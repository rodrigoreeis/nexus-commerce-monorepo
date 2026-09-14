import { render, screen } from '@testing-library/react'
import HomePage, { getServerSideProps } from '@/pages/index'
import * as catalogHook from '@/shared/hooks/useStoreProducts'
import * as catalogService from '@/shared/services/catalog'

jest.mock('@/shared/services/catalog', () => ({
  getStoreProducts: jest.fn(),
}))

jest.mock('@/shared/hooks/useStoreProducts', () => ({
  useStoreProducts: jest.fn(),
}))

describe('Storefront HomePage (Pages Router with initialData SSR)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getServerSideProps', () => {
    it('fetches catalog products directly and returns them as props', async () => {
      const mockProducts = [
        {
          id: 'prod-1',
          name: 'Gaming Headset Pro',
          description: 'Immersive sound with noise cancellation.',
          price: 199.99,
          imageUrl: 'http://localhost:8080/uploads/headset.jpg',
        },
      ]

      ;(catalogService.getStoreProducts as jest.Mock).mockResolvedValue(mockProducts)

      const response = await getServerSideProps({} as any)

      expect(catalogService.getStoreProducts).toHaveBeenCalledTimes(1)
      expect(response).toEqual({
        props: {
          products: mockProducts,
        },
      })
    })
  })

  describe('HomePage Component', () => {
    it('renders the storefront page with products passed via initialData and Portuguese UI', () => {
      const mockProducts = [
        {
          id: 'prod-1',
          name: 'Gaming Headset Pro',
          description: 'Immersive sound with noise cancellation.',
          price: 199.99,
          imageUrl: 'http://localhost:8080/uploads/headset.jpg',
        },
      ]

      ;(catalogHook.useStoreProducts as jest.Mock).mockReturnValue({
        data: mockProducts,
        isLoading: false,
        error: null,
      })

      render(<HomePage products={mockProducts} />)

      expect(catalogHook.useStoreProducts).toHaveBeenCalledWith(mockProducts)
      expect(
        screen.getByRole('heading', { level: 1, name: /Bem-vindo ao Nexus Commerce/i })
      ).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: /Produtos em Destaque/i })).toBeInTheDocument()
      expect(screen.getByText('Gaming Headset Pro')).toBeInTheDocument()
      expect(screen.getByText(/R\$\s*199,99/)).toBeInTheDocument()
    })
  })
})
