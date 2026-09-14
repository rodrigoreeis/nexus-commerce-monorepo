import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Header } from '../index'

describe('Header component', () => {
  it('renders institutional title and online status indicator', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nexus Backoffice')
    expect(screen.getByText('Sistemas Operacionais')).toBeInTheDocument()
  })

  it('renders degraded status when system is offline', () => {
    render(
      <AppProvider>
        <Header systemStatus="offline" />
      </AppProvider>
    )
    expect(screen.getByText('Serviço Degradado')).toBeInTheDocument()
  })

  it('renders navigation links and calls onNavigate when clicked', () => {
    const onNavigateMock = jest.fn()

    render(
      <AppProvider>
        <Header activeRoute="home" onNavigate={onNavigateMock} />
      </AppProvider>
    )

    const overviewLink = screen.getByRole('link', { name: 'Visão Geral' })
    const productsLink = screen.getByRole('link', { name: 'Produtos' })

    expect(overviewLink).toBeInTheDocument()
    expect(productsLink).toBeInTheDocument()

    productsLink.click()
    expect(onNavigateMock).toHaveBeenCalledWith('products')
  })
})
