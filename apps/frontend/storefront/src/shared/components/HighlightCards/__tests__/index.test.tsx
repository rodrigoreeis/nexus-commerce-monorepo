import { render, screen } from '@testing-library/react'
import { HighlightCards, defaultHighlights } from '../index'

describe('HighlightCards component', () => {
  it('renders all 4 default highlight cards with title and description', () => {
    render(<HighlightCards />)

    expect(screen.getByText('Frete Grátis Brasil')).toBeInTheDocument()
    expect(screen.getByText('Em compras acima de R$ 199')).toBeInTheDocument()

    expect(screen.getByText('Até 10x Sem Juros')).toBeInTheDocument()
    expect(screen.getByText('Parcelamento facilitado no cartão')).toBeInTheDocument()

    expect(screen.getByText('5% OFF no Pix')).toBeInTheDocument()
    expect(screen.getByText('Desconto imediato no checkout')).toBeInTheDocument()

    expect(screen.getByText('Garantia & Troca Fácil')).toBeInTheDocument()
    expect(screen.getByText('Até 30 dias para devolução grátis')).toBeInTheDocument()

    defaultHighlights.forEach((item) => {
      expect(screen.getByTestId(`highlight-card-${item.id}`)).toBeInTheDocument()
    })
  })

  it('renders custom highlight items when provided', () => {
    const customItems = [
      {
        id: 'custom-1',
        title: 'Suporte 24/7',
        description: 'Atendimento humanizado',
        icon: () => <span data-testid="custom-icon">icon</span>,
        variant: 'blue' as const,
      },
    ]

    render(<HighlightCards items={customItems} />)

    expect(screen.getByText('Suporte 24/7')).toBeInTheDocument()
    expect(screen.getByText('Atendimento humanizado')).toBeInTheDocument()
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})
