import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Layout } from '../index'

describe('Layout component', () => {
  it('renders header and main children correctly', () => {
    render(
      <AppProvider>
        <Layout>
          <div>Dashboard Overview</div>
        </Layout>
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nexus Backoffice')
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
  })
})
