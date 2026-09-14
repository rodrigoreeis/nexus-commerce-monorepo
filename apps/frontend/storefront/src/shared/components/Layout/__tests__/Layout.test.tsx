import { render, screen } from '@testing-library/react'
import { Layout } from '../Layout'

describe('Storefront Layout component', () => {
  it('renders header, main content, and footer', () => {
    render(
      <Layout>
        <div>Featured Collection</div>
      </Layout>
    )

    expect(screen.getByLabelText('Nexus Commerce Home')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Featured Collection')).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
