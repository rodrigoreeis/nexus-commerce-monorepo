import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import * as productsService from '@/shared/services/products'
import * as usersService from '@/shared/services/users'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/shared/services/auth'
import { App } from '../app'

describe('App root component', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(TOKEN_STORAGE_KEY, 'mock-admin-token')
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        id: 'admin-1',
        name: 'Nexus Admin',
        email: 'admin@nexuscommerce.com',
        role: 'admin',
      })
    )

    jest.spyOn(productsService, 'fetchAdminProducts').mockResolvedValue([])
    jest.spyOn(usersService, 'fetchBackofficeUsers').mockResolvedValue([])
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    localStorage.clear()
  })

  it('renders LoginPage when user is unauthenticated', () => {
    localStorage.clear()

    render(
      <AppProvider>
        <App />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nexus Commerce')
    expect(screen.getByText('Painel Administrativo & Controle de Acesso')).toBeInTheDocument()
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Entrar no Backoffice/i })).toBeInTheDocument()
  })

  it('renders Dashboard by default on root path when authenticated', () => {
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

  it('redirects operator user directly to dashboard without showing restricted access message', async () => {
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        id: 'op-1',
        name: 'Carlos Operador',
        email: 'carlos@nexuscommerce.com',
        role: 'user',
      })
    )
    window.history.pushState({}, '', '/users')

    render(
      <AppProvider>
        <App />
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Pedidos Recentes')).toBeInTheDocument()
      expect(screen.getByText('Quantidade de Vendas')).toBeInTheDocument()
    })

    expect(screen.queryByText('Acesso Restrito')).not.toBeInTheDocument()
    expect(screen.queryByText(/Seu perfil de operador \(user\) não possui permissão/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Gestão de Usuários')).not.toBeInTheDocument()
  })
})
