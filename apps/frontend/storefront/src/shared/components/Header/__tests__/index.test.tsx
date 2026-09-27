import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '../index'
import * as cartHook from '@/shared/hooks/useCart'
import * as cartContext from '@/shared/contexts/CartContext'

jest.mock('@/shared/hooks/useCart', () => ({
  useCart: jest.fn(),
}))

jest.mock('@/shared/contexts/CartContext', () => ({
  useCartUI: jest.fn(),
}))

describe('Storefront Header component', () => {
  const mockOpenCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: { items: [] },
      isLoading: false,
    })
    ;(cartContext.useCartUI as jest.Mock).mockReturnValue({
      isCartOpen: false,
      openCart: mockOpenCart,
      closeCart: jest.fn(),
      toggleCart: jest.fn(),
    })
  })

  it('renders store brand logo and cart button', () => {
    render(<Header />)

    expect(screen.getByLabelText('Página Inicial do Nexus Storefront')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Carrinho de compras com 0 itens' })).toBeInTheDocument()
    expect(screen.getByText('Carrinho')).toBeInTheDocument()
  })

  it('updates cart counter display with custom count', () => {
    render(<Header cartItemCount={3} />)

    expect(screen.getByRole('button', { name: 'Carrinho de compras com 3 itens' })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders live count from useCart when cartItemCount prop is omitted', () => {
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: {
        items: [
          { id: '1', quantity: 2 },
          { id: '2', quantity: 3 },
        ],
      },
      isLoading: false,
    })

    render(<Header />)

    expect(screen.getByRole('button', { name: 'Carrinho de compras com 5 itens' })).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls openCart from CartContext when cart button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const cartBtn = screen.getByRole('button', { name: /Carrinho de compras/i })
    await user.click(cartBtn)

    expect(mockOpenCart).toHaveBeenCalledTimes(1)
  })

  it('calls onOpenCart custom handler when provided', async () => {
    const user = userEvent.setup()
    const customHandler = jest.fn()
    render(<Header onOpenCart={customHandler} />)

    const cartBtn = screen.getByRole('button', { name: /Carrinho de compras/i })
    await user.click(cartBtn)

    expect(customHandler).toHaveBeenCalledTimes(1)
    expect(mockOpenCart).not.toHaveBeenCalled()
  })
})
