import { render, screen } from '@testing-library/react'
import { Header } from '../index'

describe('Storefront Header component', () => {
  it('renders store brand logo and cart button', () => {
    render(<Header />)

    expect(screen.getByLabelText('Página Inicial do Nexus Commerce')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Carrinho de compras com 0 itens' })).toBeInTheDocument()
    expect(screen.getByText('Carrinho')).toBeInTheDocument()
  })

  it('updates cart counter display with custom count', () => {
    render(<Header cartItemCount={3} />)

    expect(screen.getByRole('button', { name: 'Carrinho de compras com 3 itens' })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
