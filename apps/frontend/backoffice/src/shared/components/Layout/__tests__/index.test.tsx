import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Layout } from '../index'

describe('Layout component', () => {
  it('renders vertical sidebar, top header, and main children correctly', () => {
    render(
      <AppProvider>
        <Layout activeRoute="dashboard" title="Visão Geral">
          <div>Conteúdo Principal</div>
        </Layout>
      </AppProvider>
    )

    expect(screen.getByRole('complementary', { name: 'Navegação Lateral' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Usuários/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Produtos/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo Principal')).toBeInTheDocument()
  })
})
