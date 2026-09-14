import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '../index'

describe('Sidebar component', () => {
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
})
