import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '@/shared/theme/provider'
import * as usersService from '@/shared/services/users'
import * as authContext from '@/shared/context/AuthContext'
import { AuthUser } from '@/shared/services/auth'
import { UsersPage } from '../index'

const mockUsers: AuthUser[] = [
  {
    id: 'user-root',
    name: 'Nexus Root',
    email: 'admin@nexuscommerce.com',
    role: 'root',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-admin',
    name: 'Paula Admin',
    email: 'paula.admin@nexuscommerce.com',
    role: 'admin',
    created_at: '2026-01-01T12:00:00Z',
  },
  {
    id: 'user-manager',
    name: 'Maria Gerente',
    email: 'maria@nexuscommerce.com',
    role: 'manager',
    created_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 'user-op',
    name: 'Carlos Operador',
    email: 'carlos@nexuscommerce.com',
    role: 'user',
    created_at: '2026-01-03T00:00:00Z',
  },
]

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
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

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(usersService, 'fetchBackofficeUsers').mockResolvedValue(mockUsers)
  })

  it('renders users list including root for root administrator', async () => {
    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: mockUsers[0],
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      isRoot: true,
      isAdmin: true,
      isManager: false,
      isUser: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão de Usuários')

    await waitFor(() => {
      expect(screen.getAllByText('Nexus Root').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('paula.admin@nexuscommerce.com')).toBeInTheDocument()
      expect(screen.getByText('maria@nexuscommerce.com')).toBeInTheDocument()
      expect(screen.getByText('Carlos Operador')).toBeInTheDocument()
      expect(screen.getByText('Root (Imutável)')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Novo Usuário/i })).toBeInTheDocument()
    // Paula Admin, Maria Gerente, Carlos Operador can have their roles altered by Root
    expect(screen.getAllByRole('button', { name: /Alterar Função/i })).toHaveLength(3)
  })

  it('hides root user and prevents modifying own account for admin user', async () => {
    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: mockUsers[1], // Paula Admin
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      isRoot: false,
      isAdmin: true,
      isManager: false,
      isUser: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão de Usuários')

    await waitFor(() => {
      expect(screen.getAllByText('paula.admin@nexuscommerce.com').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('maria@nexuscommerce.com')).toBeInTheDocument()
    })

    // Root should NOT be visible in the table for an admin
    expect(screen.queryByText('Nexus Root')).not.toBeInTheDocument()
    expect(screen.queryByText('admin@nexuscommerce.com')).not.toBeInTheDocument()

    // Own account cannot be edited
    expect(screen.getByText('Sua conta (Imutável)')).toBeInTheDocument()

    // Alterar Função is only available for Maria Gerente and Carlos Operador (2 users)
    expect(screen.getAllByRole('button', { name: /Alterar Função/i })).toHaveLength(2)
  })

  it('renders users list without root and hides role alteration for manager user', async () => {
    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: mockUsers[2], // Maria Gerente
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      isRoot: false,
      isAdmin: false,
      isManager: true,
      isUser: false,
      login: jest.fn(),
      logout: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão de Usuários')

    await waitFor(() => {
      expect(screen.getByText('paula.admin@nexuscommerce.com')).toBeInTheDocument()
      expect(screen.getByText('Carlos Operador')).toBeInTheDocument()
    })

    // Root is hidden
    expect(screen.queryByText('Nexus Root')).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: /Novo Usuário/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Alterar Função/i })).not.toBeInTheDocument()
  })

  it('renders 403 Forbidden restricted access screen for user role', () => {
    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: mockUsers[3], // Carlos Operador
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      isRoot: false,
      isAdmin: false,
      isManager: false,
      isUser: true,
      login: jest.fn(),
      logout: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Acesso Restrito')
    expect(
      screen.getByText(/Seu perfil de operador \(user\) não possui permissão/i)
    ).toBeInTheDocument()
    expect(screen.queryByText('Gestão de Usuários')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Voltar ao Catálogo de Produtos/i })).toBeInTheDocument()
  })
})
