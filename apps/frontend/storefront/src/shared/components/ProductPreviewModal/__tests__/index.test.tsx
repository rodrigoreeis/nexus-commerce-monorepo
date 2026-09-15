import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductPreviewModal } from '../index'
import { Product } from '@/shared/services/catalog'

describe('ProductPreviewModal component', () => {
  const mockProduct: Product = {
    id: 'prod-999',
    name: 'Cadeira Gamer Ergonomica Nexus Ultra',
    description: 'Apoio lombar adaptável com ajuste 4D, revestimento premium respirável e estrutura reforçada em aço carbono para máximo conforto durante longas sessões de trabalho ou gameplay intenso.',
    price: 1899.9,
    imageUrl: 'http://localhost:8080/uploads/chair.jpg',
  }

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

  it('renders complete product details, formatted BRL price, and full description', () => {
    render(
      <ProductPreviewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    )

    expect(screen.getByTestId('product-preview-modal')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Cadeira Gamer Ergonomica Nexus Ultra' })).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*1\.899,90/)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()

    const img = screen.getByRole('img', { name: 'Cadeira Gamer Ergonomica Nexus Ultra' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockProduct.imageUrl)

    const actionButton = screen.getByRole('button', { name: /Adicionar ao Carrinho/i })
    expect(actionButton).toBeDisabled()
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

    expect(screen.queryByRole('img', { name: 'Cadeira Gamer Ergonomica Nexus Ultra' })).not.toBeInTheDocument()
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
