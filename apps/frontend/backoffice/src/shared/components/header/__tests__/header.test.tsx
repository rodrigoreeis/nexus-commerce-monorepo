import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Header } from '../header'

describe('Header component', () => {
  it('renders institutional title and online status indicator', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nexus Backoffice')
    expect(screen.getByText('Systems Operational')).toBeInTheDocument()
  })

  it('renders degraded status when system is offline', () => {
    render(
      <AppProvider>
        <Header systemStatus="offline" />
      </AppProvider>
    )

    expect(screen.getByText('Degraded Service')).toBeInTheDocument()
  })
})
