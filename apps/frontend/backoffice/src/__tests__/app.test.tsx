import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import * as productsService from '@/shared/services/products'
import { App } from '../app'

describe('App root component', () => {
  beforeEach(() => {
    jest.spyOn(productsService, 'fetchAdminProducts').mockResolvedValue([])
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders HomePage by default on root path', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    )

    expect(screen.getByText('Commerce Overview')).toBeInTheDocument()
  })

  it('navigates to ProductsPage when clicking Products in Header', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    )

    const productsLink = screen.getByRole('link', { name: 'Products' })
    fireEvent.click(productsLink)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Products Management')
    })
  })
})
