import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductPreviewModal } from '../index'
import { Product } from '@/shared/services/catalog'
import * as cartHook from '@/shared/hooks/useCart'
import * as cartContext from '@/shared/contexts/CartContext'

jest.mock('@/shared/hooks/useCart', () => ({
  useAddToCart: jest.fn(),
}))

jest.mock('@/shared/contexts/CartContext', () => ({
  useCartUI: jest.fn(),
}))

describe('ProductPreviewModal component', () => {
  const mockProduct: Product = {
    id: 'prod-999',
    name: 'Cadeira Gamer Ergonomica Nexus Ultra',
    description:
      'Apoio lombar adaptável com ajuste 4D, revestimento premium respirável e estrutura reforçada em aço carbono para máximo conforto durante longas sessões de trabalho ou gameplay intenso.',
    price: 1899.9,
    imageUrl: 'http://localhost:8080/uploads/chair.jpg',
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

  it('renders nothing when isOpen is false or product is null', () => {
    const { rerender } = render(
      <ProductPreviewModal product={mockProduct} isOpen={false} onClose={jest.fn()} />
    )
    expect(screen.queryByTestId('product-preview-modal')).not.toBeInTheDocument()

    rerender(
      <ProductPreviewModal product={null} isOpen={true} onClose={jest.fn()} />
    )
    expect(screen.queryByTestId('product-preview-modal')).not.toBeInTheDocument()
  })

  it('renders complete product details, formatted BRL price, and quantity controls', () => {
    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    )

    expect(screen.getByTestId('product-preview-modal')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Cadeira Gamer Ergonomica Nexus Ultra' })
    ).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*1\.899,90/)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()

    const img = screen.getByRole('img', { name: 'Cadeira Gamer Ergonomica Nexus Ultra' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockProduct.imageUrl)

    expect(screen.getByTestId('preview-quantity-value')).toHaveTextContent('1')

    const actionButton = screen.getByRole('button', { name: /Adicionar 1 Cadeira Gamer/i })
    expect(actionButton).toBeEnabled()
  })

  it('allows increasing and decreasing quantity within limits', async () => {
    const user = userEvent.setup()
    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    )

    const increaseBtn = screen.getByRole('button', { name: 'Aumentar quantidade' })
    const decreaseBtn = screen.getByRole('button', { name: 'Diminuir quantidade' })
    const qtyValue = screen.getByTestId('preview-quantity-value')

    expect(decreaseBtn).toBeDisabled() // At min quantity 1
    expect(qtyValue).toHaveTextContent('1')

    await user.click(increaseBtn)
    expect(qtyValue).toHaveTextContent('2')
    expect(decreaseBtn).toBeEnabled()

    await user.click(increaseBtn)
    expect(qtyValue).toHaveTextContent('3')

    await user.click(decreaseBtn)
    expect(qtyValue).toHaveTextContent('2')
  })

  it('calls addToCart with selected quantity and opens cart drawer on success', async () => {
    const handleClose = jest.fn()
    mockAddToCart.mockImplementation((_payload, options) => {
      options?.onSuccess?.()
    })

    const user = userEvent.setup()
    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={handleClose} />
    )

    const increaseBtn = screen.getByRole('button', { name: 'Aumentar quantidade' })
    await user.click(increaseBtn)
    await user.click(increaseBtn)

    const actionButton = screen.getByRole('button', { name: /Adicionar 3 Cadeira Gamer/i })
    await user.click(actionButton)

    expect(mockAddToCart).toHaveBeenCalledWith(
      { productId: 'prod-999', quantity: 3 },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
    expect(handleClose).toHaveBeenCalledTimes(1)
    expect(mockOpenCart).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()

    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={handleClose} />
    )

    const closeButton = screen.getByRole('button', { name: /Fechar prévia do produto/i })
    await user.click(closeButton)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay backdrop is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()

    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={handleClose} />
    )

    const overlay = screen.getByTestId('product-preview-overlay')
    await user.click(overlay)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()

    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={handleClose} />
    )

    const modal = screen.getByTestId('product-preview-modal')
    await user.click(modal)

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = jest.fn()

    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={handleClose} />
    )

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('handles image error with fallback placeholder', () => {
    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    )

    const img = screen.getByRole('img', { name: 'Cadeira Gamer Ergonomica Nexus Ultra' })
    fireEvent.error(img)

    expect(
      screen.queryByRole('img', { name: 'Cadeira Gamer Ergonomica Nexus Ultra' })
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('product-preview-image-fallback')).toBeInTheDocument()
    expect(screen.getByText('Sem imagem')).toBeInTheDocument()
  })

  it('renders fallback placeholder directly when imageUrl is empty', () => {
    render(
      <ProductPreviewModal
        product={{ ...mockProduct, imageUrl: '' }}
        isOpen={true}
        onClose={jest.fn()}
      />
    )

    expect(screen.getByTestId('product-preview-image-fallback')).toBeInTheDocument()
    expect(screen.getByText('Sem imagem')).toBeInTheDocument()
  })

  it('locks body scroll when open and restores on unmount', () => {
    const { unmount } = render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    )

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
