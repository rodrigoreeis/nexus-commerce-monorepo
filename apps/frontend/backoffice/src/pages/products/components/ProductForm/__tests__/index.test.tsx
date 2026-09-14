import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '@/shared/theme/provider'
import * as productsService from '@/shared/services/products'
import { ProductForm } from '../index'

describe('ProductForm component', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders all form inputs and submit button', () => {
    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    expect(screen.getByLabelText(/Nome do Produto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Preço \(R\$\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Imagem do Produto/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Criar Produto/i })).toBeInTheDocument()
  })

  it('validates required fields on submit with Portuguese messages', async () => {
    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    const submitBtn = screen.getByRole('button', { name: /Criar Produto/i })
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toHaveTextContent('O nome do produto é obrigatório.')

    // Fill name
    const nameInput = screen.getByLabelText(/Nome do Produto/i)
    await userEvent.type(nameInput, 'Teclado Mecânico')
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toHaveTextContent('Um preço positivo válido é obrigatório.')

    // Fill price
    const priceInput = screen.getByLabelText(/Preço \(R\$\)/i)
    await userEvent.type(priceInput, '149.90')
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toHaveTextContent('A imagem do produto é obrigatória.')
  })

  it('shows image preview when file is selected and allows removal', async () => {
    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    const file = new File(['fake-image-data'], 'keyboard.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    await userEvent.upload(fileInput, file)

    const preview = screen.getByAltText('Pré-visualização do produto')
    expect(preview).toBeInTheDocument()
    expect(screen.getByText('keyboard.png')).toBeInTheDocument()

    const removeBtn = screen.getByRole('button', { name: /Remover imagem selecionada/i })
    fireEvent.click(removeBtn)

    expect(screen.queryByAltText('Pré-visualização do produto')).not.toBeInTheDocument()
  })

  it('submits valid data via createAdminProduct and invokes onSuccess', async () => {
    const mockProduct = {
      id: 'prod-new',
      name: 'Mouse Sem Fio',
      description: 'Ultra leve',
      price: 89.99,
      imageUrl: '/uploads/mouse.png',
      createdAt: '2026-09-13T12:00:00Z',
    }

    const createSpy = jest.spyOn(productsService, 'createAdminProduct').mockResolvedValue(mockProduct)
    const onSuccessMock = jest.fn()

    render(
      <AppProvider>
        <ProductForm onSuccess={onSuccessMock} />
      </AppProvider>
    )

    await userEvent.type(screen.getByLabelText(/Nome do Produto/i), 'Mouse Sem Fio')
    await userEvent.type(screen.getByLabelText(/Preço \(R\$\)/i), '89.99')
    await userEvent.type(screen.getByLabelText(/Descrição/i), 'Ultra leve')

    const file = new File(['image-bytes'], 'mouse.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    const submitBtn = screen.getByRole('button', { name: /Criar Produto/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1)
    })

    const submittedFormData = createSpy.mock.calls[0][0]
    expect(submittedFormData.get('name')).toBe('Mouse Sem Fio')
    expect(submittedFormData.get('price')).toBe('89.99')
    expect(submittedFormData.get('description')).toBe('Ultra leve')
    expect(submittedFormData.get('image')).toBeTruthy()

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledWith(mockProduct)
    })
  })

  it('displays error feedback when service rejects', async () => {
    jest.spyOn(productsService, 'createAdminProduct').mockRejectedValue(new Error('Backend rejeitou o formato da imagem'))

    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    await userEvent.type(screen.getByLabelText(/Nome do Produto/i), 'Mouse Sem Fio')
    await userEvent.type(screen.getByLabelText(/Preço \(R\$\)/i), '89.99')

    const file = new File(['image-bytes'], 'mouse.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    const submitBtn = screen.getByRole('button', { name: /Criar Produto/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Backend rejeitou o formato da imagem')
    })
  })
})
