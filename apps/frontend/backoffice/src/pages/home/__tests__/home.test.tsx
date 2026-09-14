import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { HomePage } from '../index'

describe('HomePage', () => {
  it('renders overview heading and operational metric cards in Portuguese', () => {
    render(
      <AppProvider>
        <HomePage />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Visão Geral do Comércio')
    expect(screen.getByText('Total de Produtos no Catálogo')).toBeInTheDocument()
    expect(screen.getByText('Pedidos Pendentes')).toBeInTheDocument()
    expect(screen.getByText('Status do Gateway de API')).toBeInTheDocument()
  })
})
