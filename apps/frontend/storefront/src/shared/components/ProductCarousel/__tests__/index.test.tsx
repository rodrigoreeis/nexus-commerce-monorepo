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

  it('renders exactly up to 4 items on page 1 and allows navigating to page 2', async () => {
    const user = userEvent.setup()
    const mockProducts = generateMockProducts(6)

    render(<ProductCarousel products={mockProducts} itemsPerPage={4} />)

    expect(screen.getByTestId('product-carousel-grid')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 2')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 3')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 4')).toBeInTheDocument()
    expect(screen.queryByText('Produto Teste 5')).not.toBeInTheDocument()

    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()

    const prevButton = screen.getByRole('button', { name: 'Página anterior de produtos' })
    const nextButton = screen.getByRole('button', { name: 'Próxima página de produtos' })

    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeEnabled()

    await user.click(nextButton)

    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 5')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 6')).toBeInTheDocument()
    expect(screen.queryByText('Produto Teste 1')).not.toBeInTheDocument()

    expect(prevButton).toBeEnabled()
    expect(nextButton).toBeDisabled()

    await user.click(prevButton)

    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument()
  })

  it('does not render pagination controls when products fit in a single page', () => {
    const mockProducts = generateMockProducts(3)

    render(<ProductCarousel products={mockProducts} itemsPerPage={4} />)

    expect(screen.queryByText(/Página 1 de/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Página anterior de produtos/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Próxima página de produtos/i })).not.toBeInTheDocument()
  })
})
