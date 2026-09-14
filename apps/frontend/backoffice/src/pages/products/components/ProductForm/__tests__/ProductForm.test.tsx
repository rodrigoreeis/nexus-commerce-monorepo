import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '@/shared/theme/provider'
import * as productsService from '@/shared/services/products'
import { ProductForm } from '../ProductForm'

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

    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Price \(USD\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Product Image/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Product/i })).toBeInTheDocument()
  })

  it('validates required fields on submit', async () => {
    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    const submitBtn = screen.getByRole('button', { name: /Create Product/i })
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toHaveTextContent('Product name is required.')

    // Fill name
    const nameInput = screen.getByLabelText(/Product Name/i)
    await userEvent.type(nameInput, 'Mechanical Keyboard')
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toHaveTextContent('A valid positive price is required.')

    // Fill price
    const priceInput = screen.getByLabelText(/Price \(USD\)/i)
    await userEvent.type(priceInput, '149.90')
    fireEvent.click(submitBtn)

    expect(screen.getByRole('alert')).toHaveTextContent('Product image is required.')
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

    const preview = screen.getByAltText('Product preview')
    expect(preview).toBeInTheDocument()
    expect(screen.getByText('keyboard.png')).toBeInTheDocument()

    const removeBtn = screen.getByRole('button', { name: /Remove selected image/i })
    fireEvent.click(removeBtn)

    expect(screen.queryByAltText('Product preview')).not.toBeInTheDocument()
  })

  it('submits valid data via createAdminProduct and invokes onSuccess', async () => {
    const mockProduct = {
      id: 'prod-new',
      name: 'Wireless Mouse',
      description: 'Ultra light',
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

    await userEvent.type(screen.getByLabelText(/Product Name/i), 'Wireless Mouse')
    await userEvent.type(screen.getByLabelText(/Price \(USD\)/i), '89.99')
    await userEvent.type(screen.getByLabelText(/Description/i), 'Ultra light')

    const file = new File(['image-bytes'], 'mouse.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    const submitBtn = screen.getByRole('button', { name: /Create Product/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1)
    })

    const submittedFormData = createSpy.mock.calls[0][0]
    expect(submittedFormData.get('name')).toBe('Wireless Mouse')
    expect(submittedFormData.get('price')).toBe('89.99')
    expect(submittedFormData.get('description')).toBe('Ultra light')
    expect(submittedFormData.get('image')).toBeTruthy()

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledWith(mockProduct)
    })
  })

  it('displays error feedback when service rejects', async () => {
    jest.spyOn(productsService, 'createAdminProduct').mockRejectedValue(new Error('Backend rejected image format'))

    render(
      <AppProvider>
        <ProductForm />
      </AppProvider>
    )

    await userEvent.type(screen.getByLabelText(/Product Name/i), 'Wireless Mouse')
    await userEvent.type(screen.getByLabelText(/Price \(USD\)/i), '89.99')

    const file = new File(['image-bytes'], 'mouse.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    const submitBtn = screen.getByRole('button', { name: /Create Product/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Backend rejected image format')
    })
  })
})
