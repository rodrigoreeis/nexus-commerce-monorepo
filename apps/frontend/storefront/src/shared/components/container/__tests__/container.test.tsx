import { render, screen } from '@testing-library/react'
import { Container } from '../container'

describe('Storefront Container component', () => {
  it('renders children with responsive container styles', () => {
    render(
      <Container>
        <span>Store Content</span>
      </Container>
    )

    expect(screen.getByText('Store Content')).toBeInTheDocument()
    expect(screen.getByTestId('storefront-container')).toBeInTheDocument()
  })
})
