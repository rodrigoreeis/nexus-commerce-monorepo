import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { HomePage } from '../index'

describe('HomePage', () => {
  it('renders overview heading and operational metric cards', () => {
    render(
      <AppProvider>
        <HomePage />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Commerce Overview')
    expect(screen.getByText('Total Catalog Products')).toBeInTheDocument()
    expect(screen.getByText('Pending Orders')).toBeInTheDocument()
    expect(screen.getByText('API Gateway Status')).toBeInTheDocument()
  })
})
