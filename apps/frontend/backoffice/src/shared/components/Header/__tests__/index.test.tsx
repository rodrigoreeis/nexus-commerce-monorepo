import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Header } from '../index'

describe('Header component', () => {
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
})
