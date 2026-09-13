import { render, screen } from '@testing-library/react'
import HomePage from '../page'

describe('Storefront HomePage', () => {
  it('renders welcome message and call to action links', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Welcome to Nexus Commerce/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore Catalog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /View Categories/i })).toBeInTheDocument()
  })
})
