import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Image as ImageIcon, Upload, X } from 'lucide-react'
import { Product } from '@/shared/services/products'
import { useCreateAdminProduct } from '@/shared/hooks/useAdminProducts'
import styles from './styles.module.css'

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

    const numericPrice = parseFloat(price.replace(',', '.'))
    const hasValidPrice = Boolean(price.trim()) && !Number.isNaN(numericPrice) && numericPrice >= 0
    if (!hasValidPrice) {
      setErrorMessage('Um preço positivo válido é obrigatório.')
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
      formData.append('price', String(numericPrice))
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
          Nome do Produto <span className="text-red-400" aria-hidden="true">*</span>
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
          Preço (R$) <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id="product-price"
          name="price"
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ex.: 99,99…"
          autoComplete="off"
          disabled={isPending}
          className={styles.textInput}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="product-description"
          className={styles.fieldLabel}
        >
          Descrição
        </label>
        <textarea
          id="product-description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          Imagem do Produto <span className="text-red-400" aria-hidden="true">*</span>
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
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-28 h-28 rounded-md overflow-hidden border border-[#334155]">
                <img
                  src={previewUrl}
                  alt="Pré-visualização do produto"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#94a3b8]">
                  {selectedFile?.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isPending}
                  aria-label="Remover imagem selecionada"
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-2 py-0.5 rounded hover:bg-red-950/40 transition-colors"
                >
                  <X size={14} aria-hidden="true" />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-[#64748b] mb-1">
                <ImageIcon size={32} aria-hidden="true" />
              </div>
              <p className="text-xs text-[#94a3b8]">
                Formatos suportados: PNG, JPEG, WebP (máx. 5&nbsp;MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="mt-1 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#1e293b] text-[#f8fafc] border border-[#334155] hover:bg-[#334155] transition-colors"
              >
                <Upload size={14} aria-hidden="true" />
                <span>Selecionar Imagem</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-2">
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

        <button
          type="submit"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? 'Criando Produto…' : 'Criar Produto'}
        </button>
      </div>
    </form>
  )
}
