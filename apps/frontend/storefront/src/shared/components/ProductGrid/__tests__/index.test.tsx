import { render, screen } from '@testing-library/react'
import { ProductGrid } from '../index'
import { Product } from '@/shared/services/catalog'

describe('ProductGrid component', () => {
  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Fones de Ouvido Sem Fio',
      description: 'Cancelamento de ruído e som premium.',
      price: 299.99,
      imageUrl: 'http://localhost:8080/uploads/headphones.jpg',
    },
    {
      id: 'prod-2',
      name: 'Smartwatch',
      description: 'Monitoramento fitness com tela OLED.',
      price: 199.99,
      imageUrl: 'http://localhost:8080/uploads/watch.jpg',
    },
  ]

  it('renders loading skeletons when isLoading is true', () => {
    render(<ProductGrid isLoading={true} skeletonCount={4} />)

    expect(screen.getByTestId('product-grid-loading')).toBeInTheDocument()
    const skeletons = screen.getAllByTestId('product-card-skeleton')
    expect(skeletons).toHaveLength(4)
  })

  it('renders empty state when products array is empty', () => {
    render(<ProductGrid products={[]} isLoading={false} />)

    expect(screen.getByTestId('product-grid-empty')).toBeInTheDocument()
    expect(screen.getByText('Nenhum Produto Disponível')).toBeInTheDocument()
  })

  it('renders empty state when products is undefined', () => {
    render(<ProductGrid isLoading={false} />)

    expect(screen.getByTestId('product-grid-empty')).toBeInTheDocument()
  })

  it('renders custom empty title and description', () => {
    render(
      <ProductGrid
        products={[]}
        emptyTitle="Título Vazio Customizado"
        emptyDescription="Descrição Vazia Customizada"
      />
    )

    expect(screen.getByText('Título Vazio Customizado')).toBeInTheDocument()
    expect(screen.getByText('Descrição Vazia Customizada')).toBeInTheDocument()
  })

  it('renders error state when error is provided', () => {
    render(<ProductGrid error="Falha ao conectar com o serviço backend" />)

    expect(screen.getByTestId('product-grid-error')).toBeInTheDocument()
    expect(screen.getByText(/Não foi possível carregar o catálogo/i)).toBeInTheDocument()
    expect(screen.getByText(/Falha ao conectar com o serviço backend/i)).toBeInTheDocument()
  })

  it('renders product cards when products are available with BRL formatting', () => {
    render(<ProductGrid products={mockProducts} />)

    expect(screen.getByTestId('product-grid')).toBeInTheDocument()
    expect(screen.getByText('Fones de Ouvido Sem Fio')).toBeInTheDocument()
    expect(screen.getByText('Smartwatch')).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*299,99/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*199,99/)).toBeInTheDocument()
  })
})
