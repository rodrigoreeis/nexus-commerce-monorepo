import { render, screen } from '@testing-library/react'
import { ProductGrid } from '../index'
import { Product } from '@/shared/services/catalog'

describe('ProductGrid component', () => {
  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Wireless Headphones',
      description: 'Noise cancelling premium sound.',
      price: 299.99,
      imageUrl: 'http://localhost:8080/uploads/headphones.jpg',
    },
    {
      id: 'prod-2',
      name: 'Smart Watch',
      description: 'Fitness tracking with OLED screen.',
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
    expect(screen.getByText('No Products Available')).toBeInTheDocument()
  })

  it('renders empty state when products is undefined', () => {
    render(<ProductGrid isLoading={false} />)

    expect(screen.getByTestId('product-grid-empty')).toBeInTheDocument()
  })

  it('renders custom empty title and description', () => {
    render(
      <ProductGrid
        products={[]}
        emptyTitle="Custom Empty Title"
        emptyDescription="Custom Empty Description"
      />
    )

    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Empty Description')).toBeInTheDocument()
  })

  it('renders error state when error is provided', () => {
    render(<ProductGrid error="Failed to connect to backend service" />)

    expect(screen.getByTestId('product-grid-error')).toBeInTheDocument()
    expect(screen.getByText(/Failed to connect to backend service/i)).toBeInTheDocument()
  })

  it('renders product cards when products are available', () => {
    render(<ProductGrid products={mockProducts} />)

    expect(screen.getByTestId('product-grid')).toBeInTheDocument()
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('Smart Watch')).toBeInTheDocument()
    expect(screen.getByText('$299.99')).toBeInTheDocument()
    expect(screen.getByText('$199.99')).toBeInTheDocument()
  })
})
