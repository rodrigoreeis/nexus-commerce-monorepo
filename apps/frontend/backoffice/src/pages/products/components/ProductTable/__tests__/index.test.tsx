import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AppProvider } from '@/shared/theme/provider'
import { Product } from '@/shared/services/products'
import * as productsService from '@/shared/services/products'
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

  afterEach(() => {
    jest.restoreAllMocks()
  })

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

    expect(screen.getByText('Ações')).toBeInTheDocument()
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

    expect(screen.getByRole('button', { name: 'Excluir produto Teclado Mecânico Sem Fio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Excluir produto Mouse Gamer Pro' })).toBeInTheDocument()
  })

  it('opens confirmation dialog on clicking delete button and cancels correctly', async () => {
    render(
      <AppProvider>
        <ProductTable products={mockProducts} isLoading={false} />
      </AppProvider>
    )

    const deleteBtn = screen.getByRole('button', { name: 'Excluir produto Teclado Mecânico Sem Fio' })
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument()
      expect(
        screen.getByText(/Tem certeza que deseja remover o produto/i)
      ).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toHaveTextContent('Teclado Mecânico Sem Fio')
    })

    const cancelBtn = screen.getByRole('button', { name: /Cancelar/i })
    fireEvent.click(cancelBtn)

    await waitFor(() => {
      expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument()
    })
  })

  it('confirms product deletion and triggers deleteAdminProduct API call', async () => {
    const deleteSpy = jest.spyOn(productsService, 'deleteAdminProduct').mockResolvedValue(undefined)
    const onDeleteSuccessMock = jest.fn()

    render(
      <AppProvider>
        <ProductTable
          products={mockProducts}
          isLoading={false}
          onDeleteSuccess={onDeleteSuccessMock}
        />
      </AppProvider>
    )

    const deleteBtn = screen.getByRole('button', { name: 'Excluir produto Mouse Gamer Pro' })
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument()
    })

    const confirmBtn = screen.getByRole('button', { name: 'Excluir Produto' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('prod-2')
      expect(onDeleteSuccessMock).toHaveBeenCalledTimes(1)
    })
  })

  it('displays error feedback inside dialog when deletion fails', async () => {
    jest.spyOn(productsService, 'deleteAdminProduct').mockRejectedValue(new Error('Falha ao remover produto do banco'))

    render(
      <AppProvider>
        <ProductTable products={mockProducts} isLoading={false} />
      </AppProvider>
    )

    const deleteBtn = screen.getByRole('button', { name: 'Excluir produto Teclado Mecânico Sem Fio' })
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument()
    })

    const confirmBtn = screen.getByRole('button', { name: 'Excluir Produto' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Falha ao remover produto do banco')
    })
  })

  it('renders edit button and triggers onEdit callback when clicked', () => {
    const onEditMock = jest.fn()

    render(
      <AppProvider>
        <ProductTable
          products={mockProducts}
          isLoading={false}
          onEdit={onEditMock}
        />
      </AppProvider>
    )

    const editBtn = screen.getByRole('button', { name: 'Editar produto Teclado Mecânico Sem Fio' })
    expect(editBtn).toBeInTheDocument()

    fireEvent.click(editBtn)
    expect(onEditMock).toHaveBeenCalledTimes(1)
    expect(onEditMock).toHaveBeenCalledWith(mockProducts[0])
  })
})


