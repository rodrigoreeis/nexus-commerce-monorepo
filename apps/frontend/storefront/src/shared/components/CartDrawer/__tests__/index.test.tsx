import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartDrawer } from '../index'
import * as cartHook from '@/shared/hooks/useCart'
import { Cart } from '@/shared/services/cart'

jest.mock('@/shared/hooks/useCart', () => ({
  useCart: jest.fn(),
  useUpdateCartItem: jest.fn(),
  useRemoveCartItem: jest.fn(),
  useClearCart: jest.fn(),
}))

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: mockPush,
  }),
}))

describe('CartDrawer Component', () => {
  const mockUpdateQuantity = jest.fn()
  const mockRemoveItem = jest.fn()
  const mockOnClose = jest.fn()

  const mockCartWithItems: Cart = {
    id: 'cart-1',
    sessionId: 'session-123',
    subtotal: 350.0,
    items: [
      {
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'prod-1',
        quantity: 2,
        subtotal: 200.0,
        createdAt: '2026-09-27T10:00:00Z',
        updatedAt: '2026-09-27T10:00:00Z',
        product: {
          id: 'prod-1',
          name: 'Mechanical Keyboard RGB',
          description: 'Top switches',
          price: 100.0,
          imageUrl: 'http://localhost:8080/uploads/kb.jpg',
        },
      },
      {
        id: 'item-2',
        cartId: 'cart-1',
        productId: 'prod-2',
        quantity: 1,
        subtotal: 150.0,
        createdAt: '2026-09-27T10:00:00Z',
        updatedAt: '2026-09-27T10:00:00Z',
        product: {
          id: 'prod-2',
          name: 'Wireless Mouse',
          description: 'Ergonomic sensor',
          price: 150.0,
          imageUrl: '',
        },
      },
    ],
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z',
  }

  const mockEmptyCart: Cart = {
    id: 'cart-2',
    sessionId: 'session-123',
    subtotal: 0,
    items: [],
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z',
  }

  const mockClearCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(cartHook.useUpdateCartItem as jest.Mock).mockReturnValue({
      mutate: mockUpdateQuantity,
      isPending: false,
    })
    ;(cartHook.useRemoveCartItem as jest.Mock).mockReturnValue({
      mutate: mockRemoveItem,
      isPending: false,
    })
    ;(cartHook.useClearCart as jest.Mock).mockReturnValue({
      mutate: mockClearCart,
      isPending: false,
    })
  })

  it('renders nothing when isOpen is false', () => {
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    const { container } = render(<CartDrawer isOpen={false} onClose={mockOnClose} />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByTestId('cart-drawer')).not.toBeInTheDocument()
  })

  it('renders empty cart view when cart has no items', () => {
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockEmptyCart,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByTestId('cart-drawer')).toBeInTheDocument()
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Explorar Produtos/i })).toBeInTheDocument()
  })

  it('renders cart items, quantities, and subtotal when items are present', () => {
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Mechanical Keyboard RGB')).toBeInTheDocument()
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // Total item badge (2 + 1)
    expect(screen.getByText(/R\$\s*350,00/)).toBeInTheDocument() // Overall subtotal
  })

  it('calls updateQuantity mutation when increasing quantity', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const plusBtn = screen.getByRole('button', {
      name: 'Aumentar quantidade de Mechanical Keyboard RGB',
    })
    await user.click(plusBtn)

    expect(mockUpdateQuantity).toHaveBeenCalledWith({
      itemId: 'item-1',
      quantity: 3,
    })
  })

  it('calls updateQuantity mutation when decreasing quantity above 1', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const minusBtn = screen.getByRole('button', {
      name: 'Diminuir quantidade de Mechanical Keyboard RGB',
    })
    await user.click(minusBtn)

    expect(mockUpdateQuantity).toHaveBeenCalledWith({
      itemId: 'item-1',
      quantity: 1,
    })
  })

  it('calls removeItem when decreasing quantity of item with quantity 1', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const minusBtn = screen.getByRole('button', {
      name: 'Diminuir quantidade de Wireless Mouse',
    })
    await user.click(minusBtn)

    expect(mockRemoveItem).toHaveBeenCalledWith('item-2')
  })

  it('calls removeItem when clicking trash button', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const trashBtn = screen.getByRole('button', {
      name: 'Remover Mechanical Keyboard RGB do carrinho',
    })
    await user.click(trashBtn)

    expect(mockRemoveItem).toHaveBeenCalledWith('item-1')
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const closeBtn = screen.getByRole('button', { name: 'Fechar carrinho' })
    await user.click(closeBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const backdrop = screen.getByTestId('cart-drawer-backdrop')
    await user.click(backdrop)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('scrolls to products section when clicking Explorar Produtos on home page', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockEmptyCart,
      isLoading: false,
    })

    const scrollIntoViewMock = jest.fn()
    const targetElement = document.createElement('div')
    targetElement.id = 'produtos'
    targetElement.scrollIntoView = scrollIntoViewMock
    document.body.appendChild(targetElement)

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const exploreBtn = screen.getByRole('button', { name: /Explorar Produtos/i })
    await user.click(exploreBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })

    document.body.removeChild(targetElement)
  })

  it('does not display Esvaziar button when cart is empty', () => {
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockEmptyCart,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    expect(screen.queryByRole('button', { name: /Esvaziar carrinho/i })).not.toBeInTheDocument()
  })

  it('displays Esvaziar button when cart has items and handles confirmation flow', async () => {
    const user = userEvent.setup()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: mockCartWithItems,
      isLoading: false,
    })

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />)

    const clearBtn = screen.getByRole('button', { name: /Esvaziar carrinho/i })
    expect(clearBtn).toBeInTheDocument()

    // Click to initiate confirmation
    await user.click(clearBtn)

    expect(screen.getByText('Esvaziar toda a sacola?')).toBeInTheDocument()
    const confirmYesBtn = screen.getByRole('button', { name: /Confirmar esvaziamento do carrinho/i })
    const confirmNoBtn = screen.getByRole('button', { name: /Cancelar esvaziamento/i })

    // Cancel confirmation
    await user.click(confirmNoBtn)
    expect(screen.queryByText('Esvaziar toda a sacola?')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Esvaziar carrinho/i })).toBeInTheDocument()

    // Click again and confirm
    await user.click(screen.getByRole('button', { name: /Esvaziar carrinho/i }))
    await user.click(screen.getByRole('button', { name: /Confirmar esvaziamento do carrinho/i }))

    expect(mockClearCart).toHaveBeenCalledTimes(1)
  })
})
