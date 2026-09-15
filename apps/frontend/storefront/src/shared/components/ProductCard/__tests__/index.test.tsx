import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '../index'
import { Product } from '@/shared/services/catalog'

describe('ProductCard component', () => {
  const mockProduct: Product = {
    id: 'prod-101',
    name: 'Teclado Mecânico Pro',
    description: 'Switches mecânicos customizados com baixíssima latência e conexão sem fio.',
    price: 149.99,
    imageUrl: 'http://localhost:8080/uploads/keyboard.jpg',
  }

  it('renders product details correctly with BRL price and without description in card', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Teclado Mecânico Pro' })).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*149,99/)).toBeInTheDocument()
    expect(screen.queryByText(/Switches mecânicos customizados/i)).not.toBeInTheDocument()
  })

  it('renders image when imageUrl is present and handles onError with fallback', () => {
    render(<ProductCard product={mockProduct} />)

    const img = screen.getByRole('img', { name: 'Teclado Mecânico Pro' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'http://localhost:8080/uploads/keyboard.jpg')

    // Simulate image error
    fireEvent.error(img)

    expect(screen.queryByRole('img', { name: 'Teclado Mecânico Pro' })).not.toBeInTheDocument()
    expect(screen.getByTestId('product-image-fallback')).toBeInTheDocument()
    expect(screen.getByText('Sem imagem')).toBeInTheDocument()
  })

  it('renders fallback placeholder directly when imageUrl is empty', () => {
    const productWithoutImage: Product = {
      ...mockProduct,
      imageUrl: '',
    }

    render(<ProductCard product={productWithoutImage} />)

    expect(screen.getByTestId('product-image-fallback')).toBeInTheDocument()
    expect(screen.getByText('Sem imagem')).toBeInTheDocument()
  })

  it('renders disabled full-width action button without icon as preview for Release 2', () => {
    render(<ProductCard product={mockProduct} />)

    const button = screen.getByRole('button', { name: /Adicionar ao Carrinho/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Adicionar ao Carrinho')
  })

  it('supports custom actionLabel prop', () => {
    render(<ProductCard product={mockProduct} actionLabel="Ver Detalhes" />)

    const button = screen.getByRole('button', { name: /Ver Detalhes/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Ver Detalhes')
  })

  it('triggers onSelect when card is clicked', async () => {
    const handleSelect = jest.fn()
    render(<ProductCard product={mockProduct} onSelect={handleSelect} />)

    const card = screen.getByTestId(`product-card-${mockProduct.id}`)
    fireEvent.click(card)

    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith(mockProduct)
  })

  it('triggers onSelect when Enter or Space key is pressed on focused card', () => {
    const handleSelect = jest.fn()
    render(<ProductCard product={mockProduct} onSelect={handleSelect} />)

    const card = screen.getByTestId(`product-card-${mockProduct.id}`)
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
    expect(handleSelect).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(card, { key: ' ', code: 'Space' })
    expect(handleSelect).toHaveBeenCalledTimes(2)
  })
})
