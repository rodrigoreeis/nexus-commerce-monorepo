import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { HomePage } from '../index'

describe('Dashboard HomePage', () => {
  it('renders Dashboard heading and key metrics: Quantidade de Vendas and Total de Pedidos', () => {
    render(
      <AppProvider>
        <HomePage />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Dashboard')
    expect(screen.getByText('Quantidade de Vendas')).toBeInTheDocument()
    expect(screen.getByText('1.428')).toBeInTheDocument()
    expect(screen.getByText('Total de Pedidos')).toBeInTheDocument()
    expect(screen.getByText('352')).toBeInTheDocument()
  })

  it('renders Pedidos Recentes table with customer names, order IDs, and statuses', () => {
    render(
      <AppProvider>
        <HomePage />
      </AppProvider>
    )

    expect(screen.getByText('Pedidos Recentes')).toBeInTheDocument()
    expect(screen.getByText('#ORD-9021')).toBeInTheDocument()
    expect(screen.getByText('Lucas Silva')).toBeInTheDocument()
    expect(screen.getByText('Mariana Costa')).toBeInTheDocument()
    expect(screen.getByText('Carlos Eduardo')).toBeInTheDocument()
    expect(screen.getByText('Beatriz Santos')).toBeInTheDocument()
  })

  it('allows updating an order status via interactive modal', async () => {
    render(
      <AppProvider>
        <HomePage />
      </AppProvider>
    )

    const updateButtons = screen.getAllByRole('button', { name: /Atualizar status do pedido/i })
    fireEvent.click(updateButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Atualizar Status do Pedido')).toBeInTheDocument()
    })

    // Select new status
    const select = screen.getByLabelText(/Novo Status/i) as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'Entregue' } })

    // Confirm
    const confirmBtn = screen.getByRole('button', { name: 'Confirmar' })
    fireEvent.click(confirmBtn)

    // Check feedback
    await waitFor(() => {
      expect(
        screen.getByText(/Status do pedido #ORD-9021 alterado para "Entregue"/i)
      ).toBeInTheDocument()
    })
  })
})
