import { render, screen } from '@testing-library/react'
import { Header } from '../index'

describe('Storefront Header component', () => {
  it('renders store brand logo and cart button', () => {
    render(<Header />)

    expect(screen.getByLabelText('Nexus Commerce Home')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Shopping cart with 0 items' })).toBeInTheDocument()
  })

  it('updates cart counter display with custom count', () => {
    render(<Header cartItemCount={3} />)

    expect(screen.getByRole('button', { name: 'Shopping cart with 3 items' })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
