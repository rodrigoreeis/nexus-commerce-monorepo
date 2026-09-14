import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Header } from '../index'

describe('Header component', () => {
  beforeEach(() => {
    window.localStorage.clear()
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
})
