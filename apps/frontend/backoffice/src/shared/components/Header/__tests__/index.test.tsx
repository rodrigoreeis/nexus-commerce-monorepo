import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '@/shared/theme/provider'
import * as authContext from '@/shared/context/AuthContext'
import * as usersService from '@/shared/services/users'
import { Header } from '../index'

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        {ui}
      </AppProvider>
    </QueryClientProvider>
  )
}

describe('Header component', () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.restoreAllMocks()
  })

  it('renders topbar title and admin user profile', () => {
    render(
      <AppProvider>
        <Header title="Nexus Backoffice" />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nexus Backoffice')
    expect(screen.getByText('Administrador')).toBeInTheDocument()
    expect(screen.getByText('admin@nexuscommerce.com')).toBeInTheDocument()
  })

  it('renders custom title when passed as prop', () => {
    render(
      <AppProvider>
        <Header title="Gestão de Produtos" />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Gestão de Produtos')
  })

  it('renders theme toggle button and switches theme on click', () => {
    render(
      <AppProvider defaultTheme="dark">
        <Header title="Nexus Backoffice" />
      </AppProvider>
    )

    const toggleBtn = screen.getByRole('button', { name: /Ativar tema claro/i })
    expect(toggleBtn).toBeInTheDocument()

    fireEvent.click(toggleBtn)

    expect(screen.getByRole('button', { name: /Ativar tema escuro/i })).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('renders settings gear button and opens account settings modal on click', async () => {
    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: { id: 'admin-1', name: 'Paula Admin', email: 'paula@nexuscommerce.com', role: 'admin' },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      isRoot: false,
      isAdmin: true,
      isManager: false,
      isUser: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateCurrentUser: jest.fn(),
    })

    renderWithProviders(
      <Header title="Nexus Backoffice" />
    )

    const settingsBtn = screen.getByRole('button', { name: /Configurações da minha conta/i })
    expect(settingsBtn).toBeInTheDocument()

    fireEvent.click(settingsBtn)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Minha Conta' })).toBeInTheDocument()
      expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^E-mail$/i)).toBeInTheDocument()
    })
  })

  it('submits profile changes and displays success alert at the top', async () => {
    const updateSpy = jest.spyOn(usersService, 'updateOwnProfile').mockResolvedValue({
      user: { id: 'admin-1', name: 'Paula Nova', email: 'paula.nova@nexuscommerce.com', role: 'admin' },
      token: 'new-token',
    })

    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: { id: 'admin-1', name: 'Paula Admin', email: 'paula@nexuscommerce.com', role: 'admin' },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      isRoot: false,
      isAdmin: true,
      isManager: false,
      isUser: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateCurrentUser: jest.fn(),
    })

    renderWithProviders(<Header title="Nexus Backoffice" />)

    const settingsBtn = screen.getByRole('button', { name: /Configurações da minha conta/i })
    fireEvent.click(settingsBtn)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Minha Conta' })).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/Nome Completo/i)
    fireEvent.change(nameInput, { target: { value: 'Paula Nova' } })

    const saveBtn = screen.getByRole('button', { name: /Salvar Alterações/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith({
        name: 'Paula Nova',
        email: 'paula@nexuscommerce.com',
      })
      expect(screen.getByText('Perfil atualizado com sucesso!')).toBeInTheDocument()
    })
  })
})
