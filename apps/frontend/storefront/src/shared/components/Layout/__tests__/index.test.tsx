import { render, screen } from '@testing-library/react'
import { Layout } from '../index'

describe('Storefront Layout component', () => {
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
