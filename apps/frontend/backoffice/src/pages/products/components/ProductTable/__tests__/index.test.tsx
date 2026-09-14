import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Product } from '@/shared/services/products'
import { ProductTable } from '../index'

describe('ProductTable component', () => {
  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Wireless Mechanical Keyboard',
      description: 'Gateron brown switches',
      price: 129.99,
      imageUrl: '/uploads/keyboard.jpg',
      createdAt: '2026-09-13T10:00:00Z',
    },
    {
      id: 'prod-2',
      name: 'Pro Gaming Mouse',
      description: 'Ultra lightweight 58g',
      price: 79.5,
      imageUrl: 'http://cdn.example.com/mouse.png',
      createdAt: '2026-09-12T15:30:00Z',
    },
  ]

  it('renders loading indicator when isLoading is true', () => {
    render(
      <AppProvider>
        <ProductTable products={[]} isLoading={true} />
      </AppProvider>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading products…')).toBeInTheDocument()
  })

  it('renders error state with retry button when errorMessage is provided', () => {
    const onRetryMock = jest.fn()

    render(
      <AppProvider>
        <ProductTable
          products={[]}
          isLoading={false}
          errorMessage="Failed to fetch products from backend"
          onRetry={onRetryMock}
        />
      </AppProvider>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Failed to load catalog products')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch products from backend')).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /Try Again/i })
    fireEvent.click(retryBtn)

    expect(onRetryMock).toHaveBeenCalledTimes(1)
  })

  it('renders empty state when products list is empty', () => {
    render(
      <AppProvider>
        <ProductTable products={[]} isLoading={false} />
      </AppProvider>
    )

    expect(screen.getByText('No products found')).toBeInTheDocument()
    expect(screen.getByText(/Your catalog is currently empty/i)).toBeInTheDocument()
  })

  it('renders product rows with images, formatted prices and dates', () => {
    render(
      <AppProvider>
        <ProductTable products={mockProducts} isLoading={false} />
      </AppProvider>
    )

    expect(screen.getByText('Wireless Mechanical Keyboard')).toBeInTheDocument()
    expect(screen.getByText('Pro Gaming Mouse')).toBeInTheDocument()
    expect(screen.getByText('Gateron brown switches')).toBeInTheDocument()
    expect(screen.getByText('$129.99')).toBeInTheDocument()
    expect(screen.getByText('$79.50')).toBeInTheDocument()

    const keyboardImage = screen.getByAltText('Wireless Mechanical Keyboard') as HTMLImageElement
    expect(keyboardImage).toBeInTheDocument()
    expect(keyboardImage.src).toBe('http://localhost:8080/uploads/keyboard.jpg')

    const mouseImage = screen.getByAltText('Pro Gaming Mouse') as HTMLImageElement
    expect(mouseImage).toBeInTheDocument()
    expect(mouseImage.src).toBe('http://cdn.example.com/mouse.png')
  })
})
