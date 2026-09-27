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
    expect(screen.getByRole('button', { name: /Adicionar/i })).toBeInTheDocument()
  })

  it('validates required fields on submit with Portuguese messages', async () => {
    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    const submitBtn = screen.getByRole('button', { name: /Adicionar/i })
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

    const submitBtn = screen.getByRole('button', { name: /Adicionar/i })
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

    const submitBtn = screen.getByRole('button', { name: /Adicionar/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Backend rejeitou o formato da imagem')
    })
  })

  it('formats price with Brazilian Real (R$) mask dynamically on typing', async () => {
    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    const priceInput = screen.getByLabelText(/Preço \(R\$\)/i) as HTMLInputElement
    await userEvent.type(priceInput, '1500')

    expect(priceInput.value.replace(/\u00a0/g, ' ')).toBe('R$ 15,00')
  })

  it('limits description to 500 characters and updates live counter', async () => {
    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    expect(screen.getByText('0/500')).toBeInTheDocument()

    const descInput = screen.getByLabelText(/Descrição/i)
    await userEvent.type(descInput, 'Smartphone top de linha')

    expect(screen.getByText('23/500')).toBeInTheDocument()
    expect(descInput).toHaveAttribute('maxLength', '500')
  })

  it('renders cancel button and triggers onCancel when clicked', () => {
    const onCancelMock = jest.fn()

    render(
      <AppProvider>
        <ProductForm onCancel={onCancelMock} />
      </AppProvider>
    )

    const cancelBtn = screen.getByRole('button', { name: /Cancelar/i })
    expect(cancelBtn).toBeInTheDocument()

    fireEvent.click(cancelBtn)
    expect(onCancelMock).toHaveBeenCalledTimes(1)
  })

  it('pre-fills fields and shows existing image preview in edit mode', () => {
    const existingProduct: productsService.Product = {
      id: 'prod-edit-1',
      name: 'Monitor Gamer 240Hz',
      description: 'Painel IPS 1ms',
      price: 1899.9,
      imageUrl: '/uploads/monitor.png',
      createdAt: '2026-09-13T10:00:00Z',
    }

    render(
      <AppProvider>
        <ProductForm initialProduct={existingProduct} />
      </AppProvider>
    )

    const nameInput = screen.getByLabelText(/Nome do Produto/i) as HTMLInputElement
    expect(nameInput.value).toBe('Monitor Gamer 240Hz')

    const priceInput = screen.getByLabelText(/Preço \(R\$\)/i) as HTMLInputElement
    expect(priceInput.value.replace(/\u00a0/g, ' ')).toBe('R$ 1.899,90')

    const descInput = screen.getByLabelText(/Descrição/i) as HTMLTextAreaElement
    expect(descInput.value).toBe('Painel IPS 1ms')

    expect(screen.getByText('Imagem atual cadastrada')).toBeInTheDocument()
    expect(screen.getByAltText('Pré-visualização do produto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Salvar Alterações/i })).toBeInTheDocument()
  })

  it('submits edit data without changing image via updateAdminProduct', async () => {
    const existingProduct: productsService.Product = {
      id: 'prod-edit-1',
      name: 'Monitor Gamer',
      description: 'Painel IPS',
      price: 1500,
      imageUrl: '/uploads/monitor.png',
      createdAt: '2026-09-13T10:00:00Z',
    }

    const updatedProduct = {
      ...existingProduct,
      name: 'Monitor Gamer Pro',
    }

    const updateSpy = jest.spyOn(productsService, 'updateAdminProduct').mockResolvedValue(updatedProduct)
    const onSuccessMock = jest.fn()

    render(
      <AppProvider>
        <ProductForm initialProduct={existingProduct} onSuccess={onSuccessMock} />
      </AppProvider>
    )

    const nameInput = screen.getByLabelText(/Nome do Produto/i)
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Monitor Gamer Pro')

    const submitBtn = screen.getByRole('button', { name: /Salvar Alterações/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1)
    })

    const callArgs = updateSpy.mock.calls[0][0]
    expect(callArgs.id).toBe('prod-edit-1')
    expect(callArgs.formData.get('name')).toBe('Monitor Gamer Pro')
    expect(callArgs.formData.get('image')).toBeNull()

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledWith(updatedProduct)
    })
  })

  it('submits edit data with new image uploaded via updateAdminProduct', async () => {
    const existingProduct: productsService.Product = {
      id: 'prod-edit-2',
      name: 'Headset Pro',
      description: '7.1 Surround',
      price: 350,
      imageUrl: '/uploads/headset.png',
      createdAt: '2026-09-13T10:00:00Z',
    }

    const updatedProduct = {
      ...existingProduct,
      imageUrl: '/uploads/headset-new.png',
    }

    const updateSpy = jest.spyOn(productsService, 'updateAdminProduct').mockResolvedValue(updatedProduct)

    render(
      <AppProvider>
        <ProductForm initialProduct={existingProduct} />
      </AppProvider>
    )

    const file = new File(['new-image-data'], 'headset-new.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    const submitBtn = screen.getByRole('button', { name: /Salvar Alterações/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1)
    })

    const callArgs = updateSpy.mock.calls[0][0]
    expect(callArgs.id).toBe('prod-edit-2')
    expect(callArgs.formData.get('image')).toBeTruthy()
  })
})
