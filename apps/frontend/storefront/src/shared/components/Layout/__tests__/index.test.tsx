import { render, screen } from '@testing-library/react'
import { Layout } from '../index'
import * as cartHook from '@/shared/hooks/useCart'
import * as cartContext from '@/shared/contexts/CartContext'

jest.mock('@/shared/hooks/useCart', () => ({
  useCart: jest.fn(),
  useUpdateCartItem: jest.fn(),
  useRemoveCartItem: jest.fn(),
  useAddToCart: jest.fn(),
  useClearCart: jest.fn(),
}))

jest.mock('@/shared/contexts/CartContext', () => ({
  useCartUI: jest.fn(),
}))

describe('Storefront Layout component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(cartHook.useCart as jest.Mock).mockReturnValue({
      data: { items: [] },
      isLoading: false,
    })
    ;(cartHook.useUpdateCartItem as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    })
    ;(cartHook.useRemoveCartItem as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    })
    ;(cartHook.useClearCart as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    })
    ;(cartContext.useCartUI as jest.Mock).mockReturnValue({
      isCartOpen: false,
      openCart: jest.fn(),
      closeCart: jest.fn(),
      toggleCart: jest.fn(),
    })
  })

  it('renders header, main content, and footer', () => {
    render(
      <Layout>
        <div>Coleção em Destaque</div>
      </Layout>
    )

    expect(screen.getByLabelText('Página Inicial do Nexus Storefront')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Coleção em Destaque')).toBeInTheDocument()
    expect(screen.getByText(/Todos os direitos reservados/i)).toBeInTheDocument()
  })
})
