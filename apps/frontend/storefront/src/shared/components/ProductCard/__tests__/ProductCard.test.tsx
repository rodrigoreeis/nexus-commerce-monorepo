import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '../ProductCard'
import { Product } from '@/shared/services/catalog'

describe('ProductCard component', () => {
  const mockProduct: Product = {
    id: 'prod-101',
    name: 'Pro Wireless Keyboard',
    description: 'Custom mechanical switches with ultra-low latency wireless connectivity.',
    price: 149.99,
    imageUrl: 'http://localhost:8080/uploads/keyboard.jpg',
  }

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Pro Wireless Keyboard' })).toBeInTheDocument()
    expect(screen.getByText(/Custom mechanical switches/i)).toBeInTheDocument()
    expect(screen.getByText('$149.99')).toBeInTheDocument()
  })

  it('renders image when imageUrl is present and handles onError with fallback', () => {
    render(<ProductCard product={mockProduct} />)

    const img = screen.getByRole('img', { name: 'Pro Wireless Keyboard' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'http://localhost:8080/uploads/keyboard.jpg')

    // Simulate image error
    fireEvent.error(img)

    expect(screen.queryByRole('img', { name: 'Pro Wireless Keyboard' })).not.toBeInTheDocument()
    expect(screen.getByTestId('product-image-fallback')).toBeInTheDocument()
  })

  it('renders fallback placeholder directly when imageUrl is empty', () => {
    const productWithoutImage: Product = {
      ...mockProduct,
      imageUrl: '',
    }

    render(<ProductCard product={productWithoutImage} />)

    expect(screen.getByTestId('product-image-fallback')).toBeInTheDocument()
  })

  it('renders disabled action button as preview for Release 2', () => {
    render(<ProductCard product={mockProduct} />)

    const button = screen.getByRole('button', { name: /Add to Cart/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('supports custom actionLabel prop', () => {
    render(<ProductCard product={mockProduct} actionLabel="View Details" />)

    const button = screen.getByRole('button', { name: /View Details/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('View Details')
  })
})
