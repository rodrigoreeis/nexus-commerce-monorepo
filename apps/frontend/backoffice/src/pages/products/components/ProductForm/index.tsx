import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Image as ImageIcon, Upload, X } from 'lucide-react'
import { Product } from '@/shared/services/products'
import { useCreateAdminProduct } from '@/shared/hooks/useAdminProducts'
import { formatCurrencyInput, parseCurrencyToRaw } from '@/shared/utils/format'
import styles from './styles.module.css'

const MAX_DESCRIPTION_LENGTH = 500

export interface ProductFormProps {
  onSuccess?: (product: Product) => void
  onCancel?: () => void
}

export const ProductForm = ({ onSuccess, onCancel }: ProductFormProps) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { mutateAsync: createProduct, isPending } = useCreateAdminProduct()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(event.target.value)
    setPrice(formatted)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    const objectUrl = typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : ''
    setSelectedFile(file)
    setPreviewUrl(objectUrl)
    setErrorMessage(null)
  }

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmedName = name.trim()
    const hasName = Boolean(trimmedName)
    if (!hasName) {
      setErrorMessage('O nome do produto é obrigatório.')
      return
    }

    const numericPrice = parseCurrencyToRaw(price)
    const hasValidPrice = Boolean(price.trim()) && !Number.isNaN(numericPrice) && numericPrice > 0
    if (!hasValidPrice) {
      setErrorMessage('Um preço positivo válido é obrigatório.')
      return
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setErrorMessage(`A descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres.`)
      return
    }

    const hasSelectedFile = Boolean(selectedFile)
    if (!hasSelectedFile) {
      setErrorMessage('A imagem do produto é obrigatória.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', trimmedName)
      formData.append('price', numericPrice.toFixed(2))
      formData.append('description', description.trim())
      formData.append('image', selectedFile!)

      const createdProduct = await createProduct(formData)

      setSuccessMessage('Produto criado com sucesso!')
      setName('')
      setPrice('')
      setDescription('')
      handleRemoveImage()

      if (onSuccess) {
        onSuccess(createdProduct)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocorreu um erro inesperado'
      setErrorMessage(message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulário de cadastro de produto"
      className={styles.formRoot}
    >
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className={styles.errorBox}
        >
          <AlertCircle size={18} aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className={styles.successBox}
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Product Name */}
      <div>
        <label
          htmlFor="product-name"
          className={styles.fieldLabel}
        >
          Nome do Produto <span className={styles.requiredIndicator} aria-hidden="true">*</span>
        </label>
        <input
          id="product-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Teclado Mecânico Ergonômico…"
          autoComplete="off"
          disabled={isPending}
          className={styles.textInput}
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="product-price"
          className={styles.fieldLabel}
        >
          Preço (R$) <span className={styles.requiredIndicator} aria-hidden="true">*</span>
        </label>
        <input
          id="product-price"
          name="price"
          type="text"
          inputMode="numeric"
          value={price}
          onChange={handlePriceChange}
          placeholder="Ex.: R$ 99,90…"
          autoComplete="off"
          disabled={isPending}
          className={styles.textInput}
        />
      </div>

      {/* Description */}
      <div>
        <div className={styles.descriptionHeader}>
          <label
            htmlFor="product-description"
            className={`${styles.fieldLabel} mb-0`}
          >
            Descrição
          </label>
          <span className={styles.charCounter} aria-live="polite">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          id="product-description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder="Breve descrição das características do produto…"
          rows={3}
          disabled={isPending}
          className={styles.textarea}
        />
      </div>

      {/* Product Image Upload */}
      <div>
        <label
          htmlFor="product-image"
          className={styles.fieldLabel}
        >
          Imagem do Produto <span className={styles.requiredIndicator} aria-hidden="true">*</span>
        </label>

        <div className={`${styles.uploadBox} ${previewUrl ? styles.uploadBoxActive : ''}`}>
          <input
            ref={fileInputRef}
            id="product-image"
            name="image"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            disabled={isPending}
            style={{ display: 'none' }}
          />

          {previewUrl ? (
            <div className={styles.previewContainer}>
              <div className={styles.previewImageBox}>
                <img
                  src={previewUrl}
                  alt="Pré-visualização do produto"
                  width={112}
                  height={112}
                  className={styles.previewImage}
                />
              </div>
              <div className={styles.previewMeta}>
                <span className={styles.previewFileName}>
                  {selectedFile?.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isPending}
                  aria-label="Remover imagem selecionada"
                  className={styles.removeImageButton}
                >
                  <X size={14} aria-hidden="true" />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.uploadEmptyState}>
              <div className={styles.uploadIconWrapper}>
                <ImageIcon size={32} aria-hidden="true" />
              </div>
              <p className={styles.uploadHelpText}>
                Formatos suportados: PNG, JPEG, WebP (máx. 5&nbsp;MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className={styles.uploadSelectButton}
              >
                <Upload size={14} aria-hidden="true" />
                <span>Selecionar Imagem</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button
          type="submit"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? 'Criando Produto…' : 'Criar Produto'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
