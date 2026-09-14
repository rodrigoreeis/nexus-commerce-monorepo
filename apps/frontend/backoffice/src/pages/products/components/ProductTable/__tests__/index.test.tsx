import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Product } from '@/shared/services/products'
import { ProductTable } from '../index'

describe('ProductTable component', () => {
  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Teclado Mecânico Sem Fio',
      description: 'Switches Gateron Brown',
      price: 129.99,
      imageUrl: '/uploads/keyboard.jpg',
      createdAt: '2026-09-13T10:00:00Z',
    },
    {
      id: 'prod-2',
      name: 'Mouse Gamer Pro',
      description: 'Ultra leve com 58g',
      price: 79.5,
      imageUrl: 'http://cdn.example.com/mouse.png',
      createdAt: '2026-09-12T15:30:00Z',
    },
  ]

  it('renders loading indicator when isLoading is true', () => {
    render(
      <AppProvider>
        <ProductTable products={[]} isLoading={true} />
      </AppProvider>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Carregando produtos…')).toBeInTheDocument()
  })

  it('renders error state with retry button when errorMessage is provided', () => {
    const onRetryMock = jest.fn()

    render(
      <AppProvider>
        <ProductTable
          products={[]}
          isLoading={false}
          errorMessage="Falha ao buscar produtos no backend"
          onRetry={onRetryMock}
        />
      </AppProvider>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Falha ao carregar produtos do catálogo')).toBeInTheDocument()
    expect(screen.getByText('Falha ao buscar produtos no backend')).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /Tentar Novamente/i })
    fireEvent.click(retryBtn)

    expect(onRetryMock).toHaveBeenCalledTimes(1)
  })

  it('renders empty state when products list is empty', () => {
    render(
      <AppProvider>
        <ProductTable products={[]} isLoading={false} />
      </AppProvider>
    )

    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument()
    expect(screen.getByText(/Seu catálogo está vazio no momento/i)).toBeInTheDocument()
  })

  it('renders product rows with images, formatted prices in R$ and dates in pt-BR', () => {
    render(
      <AppProvider>
        <ProductTable products={mockProducts} isLoading={false} />
      </AppProvider>
    )

    expect(screen.getByText('Teclado Mecânico Sem Fio')).toBeInTheDocument()
    expect(screen.getByText('Mouse Gamer Pro')).toBeInTheDocument()
    expect(screen.getByText('Switches Gateron Brown')).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*129,99/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*79,50/)).toBeInTheDocument()

    const keyboardImage = screen.getByAltText('Teclado Mecânico Sem Fio') as HTMLImageElement
    expect(keyboardImage).toBeInTheDocument()
    expect(keyboardImage.src).toBe('http://localhost:8080/uploads/keyboard.jpg')

    const mouseImage = screen.getByAltText('Mouse Gamer Pro') as HTMLImageElement
    expect(mouseImage).toBeInTheDocument()
    expect(mouseImage.src).toBe('http://cdn.example.com/mouse.png')
  })
})
