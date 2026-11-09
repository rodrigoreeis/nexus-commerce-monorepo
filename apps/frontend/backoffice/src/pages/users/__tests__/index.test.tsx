import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
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
      updateCurrentUser: jest.fn(),
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
    // Paula Admin, Maria Gerente, Carlos Operador have management pencil buttons available to Root
    expect(screen.getAllByRole('button', { name: /Editar colaborador/i })).toHaveLength(3)
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
      updateCurrentUser: jest.fn(),
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
    expect(screen.getByText('Sua conta')).toBeInTheDocument()

    // Manage button is available for Maria Gerente and Carlos Operador (2 users)
    expect(screen.getAllByRole('button', { name: /Editar colaborador/i })).toHaveLength(2)
  })

  it('renders users list without root and shows management pencil only for operator to manager', async () => {
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
      updateCurrentUser: jest.fn(),
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

    // Manager can manage ONLY operator (Carlos Operador)
    expect(screen.getByRole('button', { name: /Editar colaborador Carlos Operador/i })).toBeInTheDocument()

    // Manager cannot manage admin (Paula Admin)
    expect(screen.queryByRole('button', { name: /Editar colaborador Paula Admin/i })).not.toBeInTheDocument()
    expect(screen.getByText('Sem ações permitidas')).toBeInTheDocument()
  })

  it('redirects user to dashboard and renders nothing for user role', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent')

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
      updateCurrentUser: jest.fn(),
    })

    const { container } = renderWithProviders(<UsersPage />)

    expect(screen.queryByText('Acesso Restrito')).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Seu perfil de operador \(user\) não possui permissão/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Gestão de Usuários')).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'app-navigate',
        detail: { route: 'dashboard', path: '/' },
      })
    )
  })

  it('renders error state and retries on button click', async () => {
    const fetchUsersSpy = jest.spyOn(usersService, 'fetchBackofficeUsers').mockRejectedValue(new Error('Erro de conexão com o servidor'))

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
      updateCurrentUser: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Falha ao carregar a lista de usuários')).toBeInTheDocument()
      expect(screen.getByText('Erro de conexão com o servidor')).toBeInTheDocument()
    })

    const retryButton = screen.getByRole('button', { name: /Tentar novamente/i })
    expect(retryButton).toBeInTheDocument()

    // Test clicking retry button
    fetchUsersSpy.mockResolvedValueOnce(mockUsers)
    retryButton.click()

    await waitFor(() => {
      expect(fetchUsersSpy).toHaveBeenCalledTimes(2)
    })
  })

  it('opens and confirms user deletion dialog', async () => {
    const deleteSpy = jest.spyOn(usersService, 'deleteBackofficeUser').mockResolvedValue(undefined)

    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: mockUsers[0], // Nexus Root
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      isRoot: true,
      isAdmin: true,
      isManager: false,
      isUser: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateCurrentUser: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Editar colaborador Carlos Operador/i })).toBeInTheDocument()
    })

    const manageButton = screen.getByRole('button', { name: /Editar colaborador Carlos Operador/i })
    manageButton.click()

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Gerenciar Usuário' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Excluir Usuário/i })).toBeInTheDocument()
    })

    const deleteBtn = screen.getByRole('button', { name: /Excluir Usuário/i })
    deleteBtn.click()

    await waitFor(() => {
      expect(screen.getByText(/Você realmente deseja excluir o usuário/i)).toBeInTheDocument()
      expect(screen.getByText(/Essa ação não pode ser desfeita!/i)).toBeInTheDocument()
      expect(screen.getByTestId('confirm-delete-btn')).toBeInTheDocument()
    })

    const confirmButton = screen.getByTestId('confirm-delete-btn')
    confirmButton.click()

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('user-op')
      expect(screen.getByText('Usuário excluído com sucesso!')).toBeInTheDocument()
    })
  })

  it('opens and submits reset password modal from manage user modal', async () => {
    const resetSpy = jest.spyOn(usersService, 'resetBackofficeUserPassword').mockResolvedValue(undefined)

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
      updateCurrentUser: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Editar colaborador Carlos Operador/i })).toBeInTheDocument()
    })

    const manageButton = screen.getByRole('button', { name: /Editar colaborador Carlos Operador/i })
    manageButton.click()

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Gerenciar Usuário' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Redefinir Senha do Usuário/i })).toBeInTheDocument()
    })

    const resetBtn = screen.getByRole('button', { name: /Redefinir Senha do Usuário/i })
    resetBtn.click()

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Redefinir Senha' })).toBeInTheDocument()
      expect(screen.getByLabelText('Nova senha para o usuário')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirmar nova senha para o usuário')).toBeInTheDocument()
    })

    const newPasswordInput = screen.getByLabelText('Nova senha para o usuário')
    const confirmPasswordInput = screen.getByLabelText('Confirmar nova senha para o usuário')

    fireEvent.change(newPasswordInput, { target: { value: 'novaSenha123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'novaSenha123' } })

    const submitBtn = screen.getByTestId('confirm-reset-password-btn')
    fireEvent.submit(submitBtn.closest('form')!)

    await waitFor(() => {
      expect(resetSpy).toHaveBeenCalledWith({ id: 'user-op', newPassword: 'novaSenha123' })
      expect(screen.getByText('Senha redefinida com sucesso!')).toBeInTheDocument()
    })
  })

  it('updates user role using chakra select and shows success alert', async () => {
    const updateRoleSpy = jest.spyOn(usersService, 'updateBackofficeUserRole').mockResolvedValue({
      id: 'user-op',
      name: 'Carlos Operador',
      email: 'operador@nexuscommerce.com',
      role: 'manager',
    })

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
      updateCurrentUser: jest.fn(),
    })

    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Editar colaborador Carlos Operador/i })).toBeInTheDocument()
    })

    const manageButton = screen.getByRole('button', { name: /Editar colaborador Carlos Operador/i })
    fireEvent.click(manageButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Gerenciar Usuário' })).toBeInTheDocument()
    })

    const roleSelect = screen.getByLabelText('Selecionar nova função') as HTMLSelectElement
    act(() => {
      roleSelect.value = 'manager'
      roleSelect.dispatchEvent(new window.Event('change', { bubbles: true }))
    })

    await waitFor(() => {
      const btn = screen.getByTestId('update-role-submit-btn')
      expect(btn).not.toBeDisabled()
    })

    const submitBtn = screen.getByTestId('update-role-submit-btn')
    fireEvent.submit(submitBtn.closest('form')!)

    await waitFor(() => {
      expect(updateRoleSpy).toHaveBeenCalledWith({ id: 'user-op', role: 'manager' })
      expect(screen.getByText('Função atualizada com sucesso!')).toBeInTheDocument()
    })
  })
})
