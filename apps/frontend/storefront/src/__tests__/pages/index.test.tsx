import { render, screen, fireEvent, within } from '@testing-library/react'
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
    it('renders the storefront page with products passed via initialData, HeroCarousel, and HighlightCards', () => {
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

      // Page Heading & Hero Carousel Image Banner
      expect(
        screen.getByRole('heading', { level: 1, name: /Nexus Commerce - Loja Oficial/i })
      ).toBeInTheDocument()
      expect(
        screen.getByAltText(/Banner Promocional: Tecnologia e Equipamentos/i)
      ).toBeInTheDocument()

      // Highlight Cards
      expect(screen.getByText('Frete Grátis Brasil')).toBeInTheDocument()
      expect(screen.getByText('5% OFF no Pix')).toBeInTheDocument()

      // Product Carousel
      expect(screen.getByRole('heading', { level: 2, name: /Ofertas em Destaque/i })).toBeInTheDocument()
      expect(screen.getByText('Gaming Headset Pro')).toBeInTheDocument()
      expect(screen.getByText(/R\$\s*199,99/)).toBeInTheDocument()
    })

    it('opens ProductPreviewModal when a product is clicked and closes on close button click', async () => {
      const mockProducts = [
        {
          id: 'prod-1',
          name: 'Gaming Headset Pro',
          description: 'Immersive sound with noise cancellation and ultra-durable braided cable.',
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

      // Ensure modal is initially not present
      expect(screen.queryByTestId('product-preview-modal')).not.toBeInTheDocument()

      // Click on product card to open preview modal
      const card = screen.getByTestId('product-card-prod-1')
      fireEvent.click(card)

      // Modal should now be open displaying full description and details
      const modal = screen.getByTestId('product-preview-modal')
      expect(modal).toBeInTheDocument()
      expect(within(modal).getByText('Immersive sound with noise cancellation and ultra-durable braided cable.')).toBeInTheDocument()

      // Close modal using close button
      const closeButton = within(modal).getByRole('button', { name: /Fechar prévia do produto/i })
      fireEvent.click(closeButton)

      expect(screen.queryByTestId('product-preview-modal')).not.toBeInTheDocument()
    })
  })
})
