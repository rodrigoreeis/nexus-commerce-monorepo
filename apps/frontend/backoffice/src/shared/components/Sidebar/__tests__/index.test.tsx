import { render, screen, fireEvent } from '@testing-library/react'
import * as authContext from '@/shared/context/AuthContext'
import { Sidebar } from '../index'

describe('Sidebar component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders brand title and menu items: Dashboard, Usuários, and Produtos', () => {
    render(<Sidebar activeRoute="dashboard" />)

    expect(screen.getByText('Nexus Backoffice')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Usuários/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Produtos/i })).toBeInTheDocument()
  })

  it('renders operational status indicator', () => {
    render(<Sidebar systemStatus="online" />)
    expect(screen.getByText('Sistemas Operacionais')).toBeInTheDocument()
  })

  it('renders degraded status when offline', () => {
    render(<Sidebar systemStatus="offline" />)
    expect(screen.getByText('Serviço Degradado')).toBeInTheDocument()
  })

  it('calls onNavigate when clicking a menu link', () => {
    const onNavigateMock = jest.fn()
    render(<Sidebar activeRoute="dashboard" onNavigate={onNavigateMock} />)

    const usersLink = screen.getByRole('link', { name: /Usuários/i })
    fireEvent.click(usersLink)

    expect(onNavigateMock).toHaveBeenCalledWith('users')
  })

  it('hides Usuários link when logged in as user role', () => {
    jest.spyOn(authContext, 'useAuth').mockReturnValue({
      user: { id: 'u1', name: 'User', email: 'u@test.com', role: 'user' },
      isUser: true,
      isRoot: false,
      isAdmin: false,
      isManager: false,
      isAuthenticated: true,
      isLoading: false,
      token: 'mock-token',
      login: jest.fn(),
      logout: jest.fn(),
    })

    render(<Sidebar activeRoute="dashboard" />)

    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Produtos/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Usuários/i })).not.toBeInTheDocument()
  })
})
