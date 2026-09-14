import { render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Container } from '../Container'

describe('Container component', () => {
  it('renders children within the container', () => {
    render(
      <AppProvider>
        <Container>
          <span>Admin Content</span>
        </Container>
      </AppProvider>
    )

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
    expect(screen.getByTestId('backoffice-container')).toBeInTheDocument()
  })
})
