import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '../index'
import { Product } from '@/shared/services/catalog'
import * as cartHook from '@/shared/hooks/useCart'
import * as cartContext from '@/shared/contexts/CartContext'

jest.mock('@/shared/hooks/useCart', () => ({
  useAddToCart: jest.fn(),
}))

jest.mock('@/shared/contexts/CartContext', () => ({
  useCartUI: jest.fn(),
}))

describe('ProductCard component', () => {
  const mockProduct: Product = {
    id: 'prod-101',
    name: 'Teclado Mecânico Pro',
    description: 'Switches mecânicos customizados com baixíssima latência e conexão sem fio.',
    price: 149.99,
    imageUrl: 'http://localhost:8080/uploads/keyboard.jpg',
  }

  const mockAddToCart = jest.fn()
  const mockOpenCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(cartHook.useAddToCart as jest.Mock).mockReturnValue({
      mutate: mockAddToCart,
      isPending: false,
    })
    ;(cartContext.useCartUI as jest.Mock).mockReturnValue({
      isCartOpen: false,
      openCart: mockOpenCart,
      closeCart: jest.fn(),
      toggleCart: jest.fn(),
    })
  })

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

  it('renders enabled action button and triggers addToCart on click without triggering onSelect', async () => {
    const user = userEvent.setup()
    const handleSelect = jest.fn()
    render(<ProductCard product={mockProduct} onSelect={handleSelect} />)

    const button = screen.getByRole('button', { name: /Adicionar ao Carrinho/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
    expect(button).toHaveTextContent('Adicionar ao Carrinho')

    await user.click(button)

    expect(mockAddToCart).toHaveBeenCalledWith(
      { productId: 'prod-101', quantity: 1 },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
    expect(handleSelect).not.toHaveBeenCalled()
  })

  it('opens cart drawer on addToCart success', async () => {
    const user = userEvent.setup()
    mockAddToCart.mockImplementation((_payload, options) => {
      options?.onSuccess?.()
    })

    render(<ProductCard product={mockProduct} />)

    const button = screen.getByRole('button', { name: /Adicionar ao Carrinho/i })
    await user.click(button)

    expect(mockOpenCart).toHaveBeenCalledTimes(1)
  })

  it('supports custom actionLabel prop', () => {
    render(<ProductCard product={mockProduct} actionLabel="Comprar Agora" />)

    const button = screen.getByRole('button', { name: /Comprar Agora/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Comprar Agora')
  })
})
