import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '@/shared/theme/provider'
import * as productsService from '@/shared/services/products'
import { ProductsPage } from '../index'

describe('ProductsPage', () => {
  const mockInitialProducts: productsService.Product[] = [
    {
      id: 'prod-10',
      name: 'Mechanical Gaming Keyboard',
      description: 'Hot-swappable switches',
      price: 139.99,
      imageUrl: '/uploads/keyboard.png',
      createdAt: '2026-09-13T14:00:00Z',
    },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('fetches and renders initial products in the table with Portuguese headings', async () => {
    jest.spyOn(productsService, 'fetchAdminProducts').mockResolvedValue(mockInitialProducts)

    render(
      <AppProvider>
        <ProductsPage />
      </AppProvider>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gestão de Produtos')

    await waitFor(() => {
      expect(screen.getByText('Mechanical Gaming Keyboard')).toBeInTheDocument()
      expect(screen.getByText(/R\$\s*139,99/)).toBeInTheDocument()
    })
  })

  it('renders error state and retries fetching when retry button is clicked', async () => {
    const fetchSpy = jest
      .spyOn(productsService, 'fetchAdminProducts')
      .mockRejectedValueOnce(new Error('Erro de conexão ao acessar a API'))
      .mockResolvedValueOnce(mockInitialProducts)

    render(
      <AppProvider>
        <ProductsPage />
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Falha ao carregar produtos do catálogo')).toBeInTheDocument()
      expect(screen.getByText('Erro de conexão ao acessar a API')).toBeInTheDocument()
    })

    const retryBtn = screen.getByRole('button', { name: /Tentar Novamente/i })
    fireEvent.click(retryBtn)

    await waitFor(() => {
      expect(screen.getByText('Mechanical Gaming Keyboard')).toBeInTheDocument()
    })

    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('opens creation dialog and reactively adds product to table after submission', async () => {
    const newCreatedProduct: productsService.Product = {
      id: 'prod-new-1',
      name: 'Wireless Ergonomic Mouse',
      description: 'Thumb rest sensor',
      price: 69.9,
      imageUrl: '/uploads/mouse.png',
      createdAt: '2026-09-13T16:00:00Z',
    }

    jest
      .spyOn(productsService, 'fetchAdminProducts')
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([newCreatedProduct])

    jest.spyOn(productsService, 'createAdminProduct').mockResolvedValue(newCreatedProduct)

    render(
      <AppProvider>
        <ProductsPage />
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument()
    })

    // Click Add Product
    const addProductBtn = screen.getByRole('button', { name: /Adicionar novo produto/i })
    fireEvent.click(addProductBtn)

    // Verify modal is displayed
    await waitFor(() => {
      expect(screen.getByText('Cadastrar Novo Produto')).toBeInTheDocument()
    })

    // Fill form
    await userEvent.type(screen.getByLabelText(/Nome do Produto/i), 'Wireless Ergonomic Mouse')
    await userEvent.type(screen.getByLabelText(/Preço \(R\$\)/i), '69.90')
    await userEvent.type(screen.getByLabelText(/Descrição/i), 'Thumb rest sensor')

    const file = new File(['image-content'], 'mouse.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Criar Produto/i })
    fireEvent.click(submitBtn)

    // Verify new product is immediately visible in the table
    await waitFor(() => {
      expect(screen.getByText('Wireless Ergonomic Mouse')).toBeInTheDocument()
      expect(screen.getByText(/R\$\s*69,90/)).toBeInTheDocument()
    })
  })
})
