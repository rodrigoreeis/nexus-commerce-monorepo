import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { UsersPage } from '../index'

describe('UsersPage', () => {
  it('renders users management heading and mock users in table', () => {
    render(
      <AppProvider>
        <UsersPage />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão de Usuários')
    expect(screen.getByText('Lucas Silva')).toBeInTheDocument()
    expect(screen.getByText('lucas.silva@email.com')).toBeInTheDocument()
    expect(screen.getByText('Mariana Costa')).toBeInTheDocument()
    expect(screen.getByText('Administrador Nexus')).toBeInTheDocument()
  })
})
