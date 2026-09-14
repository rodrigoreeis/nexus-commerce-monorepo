import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import * as productsService from '@/shared/services/products'
import { App } from '../app'

describe('App root component', () => {
  beforeEach(() => {
    jest.spyOn(productsService, 'fetchAdminProducts').mockResolvedValue([])
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders Dashboard by default on root path', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    )

    expect(screen.getByText('Pedidos Recentes')).toBeInTheDocument()
    expect(screen.getByText('Quantidade de Vendas')).toBeInTheDocument()
  })

  it('navigates to UsersPage when clicking Usuários in Sidebar', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    )

    const usersLink = screen.getByRole('link', { name: /Usuários/i })
    fireEvent.click(usersLink)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão de Usuários')
    })
  })

  it('navigates to ProductsPage when clicking Produtos in Sidebar', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    )

    const productsLink = screen.getByRole('link', { name: /Produtos/i })
    fireEvent.click(productsLink)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão de Produtos')
    })
  })
})
