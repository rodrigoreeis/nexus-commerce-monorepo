import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LoginPage } from '../index'
import * as AuthContextModule from '@/shared/context/AuthContext'

describe('LoginPage', () => {
  const mockLogin = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isRoot: false,
      isAdmin: false,
      isManager: false,
      isUser: false,
      login: mockLogin,
      logout: jest.fn(),
      updateCurrentUser: jest.fn(),
    })
  })

  it('renders login form properly', () => {
    render(<LoginPage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nexus Commerce')
    expect(screen.getByLabelText(/^E-mail$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Senha$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Entrar no Backoffice/i })).toBeInTheDocument()
  })

  it('toggles password visibility when clicking eye button', () => {
    render(<LoginPage />)

    const passwordInput = screen.getByLabelText(/^Senha$/i)
    const toggleButton = screen.getByRole('button', { name: /Exibir senha/i })

    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /Ocultar senha/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Ocultar senha/i }))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows validation error when fields are empty', async () => {
    render(<LoginPage />)

    const form = screen.getByRole('button', { name: /Entrar no Backoffice/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Por favor, preencha todos os campos.')
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('shows friendly message "E-mail ou senha inválidos." when login fails with 401', async () => {
    mockLogin.mockRejectedValue({
      response: {
        status: 401,
        data: { message: 'Invalid email or password' },
      },
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/^E-mail$/i), {
      target: { value: 'admin@nexuscommerce.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { value: 'wrong-password' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Entrar no Backoffice/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.')
    })
  })

  it('shows "E-mail ou senha inválidos." when backend returns raw English "Invalid email or password"', async () => {
    mockLogin.mockRejectedValue({
      response: {
        data: { message: 'Invalid email or password' },
      },
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/^E-mail$/i), {
      target: { value: 'nonexistent@nexuscommerce.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { value: 'secret123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Entrar no Backoffice/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.')
    })
  })

  it('trims email before submitting login request', async () => {
    mockLogin.mockResolvedValue(undefined)

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/^E-mail$/i), {
      target: { value: '   admin@nexuscommerce.com   ' },
    })
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { value: 'securepassword' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Entrar no Backoffice/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@nexuscommerce.com',
        password: 'securepassword',
      })
    })
  })
})
