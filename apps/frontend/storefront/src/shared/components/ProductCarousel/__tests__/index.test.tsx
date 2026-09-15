import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCarousel } from '../index'
import { Product } from '@/shared/services/catalog'

const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `prod-${index + 1}`,
    name: `Produto Teste ${index + 1}`,
    description: `Descrição do produto teste ${index + 1}`,
    price: 99.9 + index * 10,
    imageUrl: `http://localhost:8080/uploads/prod-${index + 1}.jpg`,
  }))
}

describe('ProductCarousel component', () => {
  it('renders loading skeletons when isLoading is true', () => {
    render(<ProductCarousel isLoading={true} itemsPerPage={4} />)

    expect(screen.getByTestId('product-carousel-loading')).toBeInTheDocument()
    const skeletons = screen.getAllByTestId('product-carousel-skeleton')
    expect(skeletons).toHaveLength(4)
  })

  it('renders error state when error message is provided', () => {
    render(<ProductCarousel error="Erro ao conectar ao catálogo" />)

    expect(screen.getByTestId('product-carousel-error')).toBeInTheDocument()
    expect(screen.getByText('Não foi possível carregar as ofertas')).toBeInTheDocument()
    expect(screen.getByText('Erro ao conectar ao catálogo')).toBeInTheDocument()
  })

  it('renders empty state when products array is empty', () => {
    render(<ProductCarousel products={[]} />)

    expect(screen.getByTestId('product-carousel-empty')).toBeInTheDocument()
    expect(screen.getByText('Nenhum Produto Disponível')).toBeInTheDocument()
  })

  it('renders centralized bullet points with adjacent navigation arrows', async () => {
    const user = userEvent.setup()
    const mockProducts = generateMockProducts(6)

    render(<ProductCarousel products={mockProducts} itemsPerPage={4} />)

    expect(screen.getByTestId('product-carousel-grid')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 4')).toBeInTheDocument()
    expect(screen.queryByText('Produto Teste 5')).not.toBeInTheDocument()

    // Centralized pagination with arrows and bullets
    const pagination = screen.getByTestId('product-carousel-pagination')
    expect(pagination).toBeInTheDocument()

    const prevButton = screen.getByRole('button', { name: 'Página anterior de produtos' })
    const nextButton = screen.getByRole('button', { name: 'Próxima página de produtos' })
    const bullet1 = screen.getByRole('tab', { name: 'Ir para a página 1' })
    const bullet2 = screen.getByRole('tab', { name: 'Ir para a página 2' })

    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeEnabled()
    expect(bullet1).toHaveAttribute('aria-selected', 'true')
    expect(bullet2).toHaveAttribute('aria-selected', 'false')

    // Navigate to page 2 via next arrow
    await user.click(nextButton)

    expect(prevButton).toBeEnabled()
    expect(nextButton).toBeDisabled()
    expect(bullet1).toHaveAttribute('aria-selected', 'false')
    expect(bullet2).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Produto Teste 5')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 6')).toBeInTheDocument()
    expect(screen.queryByText('Produto Teste 1')).not.toBeInTheDocument()

    // Navigate back to page 1 via bullet 1
    await user.click(bullet1)

    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeEnabled()
    expect(bullet1).toHaveAttribute('aria-selected', 'true')
    expect(bullet2).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument()

    // Navigate to page 2 via bullet 2
    await user.click(bullet2)

    expect(bullet2).toHaveAttribute('aria-selected', 'true')

    // Navigate back to page 1 via prev arrow
    await user.click(prevButton)

    expect(bullet1).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument()
  })

  it('does not render pagination controls when products fit in a single page', () => {
    const mockProducts = generateMockProducts(3)

    render(<ProductCarousel products={mockProducts} itemsPerPage={4} />)

    expect(screen.queryByTestId('product-carousel-pagination')).not.toBeInTheDocument()
  })

  it('forwards onSelectProduct callback to rendered ProductCards', async () => {
    const user = userEvent.setup()
    const handleSelect = jest.fn()
    const mockProducts = generateMockProducts(2)

    render(
      <ProductCarousel
        products={mockProducts}
        itemsPerPage={4}
        onSelectProduct={handleSelect}
      />
    )

    const card = screen.getByTestId('product-card-prod-1')
    await user.click(card)

    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith(mockProducts[0])
  })
})
