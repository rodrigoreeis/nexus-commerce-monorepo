import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react'
import { AlertCircle, CheckCircle2, Image as ImageIcon, Upload, X } from 'lucide-react'
import { Product } from '@/shared/services/products'
import { useCreateAdminProduct } from '@/shared/hooks/useAdminProducts'

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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {errorMessage && (
        <Flex
          role="alert"
          aria-live="polite"
          align="center"
          gap="0.5rem"
          padding="0.75rem 1rem"
          backgroundColor="#450a0a"
          border="1px solid #7f1d1d"
          borderRadius="0.5rem"
          color="#fecaca"
        >
          <AlertCircle size={18} aria-hidden="true" />
          <Text fontSize="0.875rem" fontWeight="500">
            {errorMessage}
          </Text>
        </Flex>
      )}

      {successMessage && (
        <Flex
          role="status"
          aria-live="polite"
          align="center"
          gap="0.5rem"
          padding="0.75rem 1rem"
          backgroundColor="#064e3b"
          border="1px solid #065f46"
          borderRadius="0.5rem"
          color="#a7f3d0"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          <Text fontSize="0.875rem" fontWeight="500">
            {successMessage}
          </Text>
        </Flex>
      )}

      {/* Product Name */}
      <Box>
        <label
          htmlFor="product-name"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#e2e8f0',
            marginBottom: '0.375rem',
          }}
        >
          Nome do Produto <span style={{ color: '#f87171' }} aria-hidden="true">*</span>
        </label>
        <Input
          id="product-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Teclado Mecânico Ergonômico…"
          autoComplete="off"
          disabled={isPending}
          backgroundColor="#1e293b"
          borderColor="#334155"
          color="#f8fafc"
          _placeholder={{ color: '#64748b' }}
          _focusVisible={{ borderColor: '#3b82f6', outline: 'none' }}
          paddingX="0.75rem"
          paddingY="0.5rem"
          borderRadius="0.5rem"
          width="100%"
        />
      </Box>

      {/* Price */}
      <Box>
        <label
          htmlFor="product-price"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#e2e8f0',
            marginBottom: '0.375rem',
          }}
        >
          Preço (R$) <span style={{ color: '#f87171' }} aria-hidden="true">*</span>
        </label>
        <Input
          id="product-price"
          name="price"
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ex.: 99,99…"
          autoComplete="off"
          disabled={isPending}
          backgroundColor="#1e293b"
          borderColor="#334155"
          color="#f8fafc"
          _placeholder={{ color: '#64748b' }}
          _focusVisible={{ borderColor: '#3b82f6', outline: 'none' }}
          paddingX="0.75rem"
          paddingY="0.5rem"
          borderRadius="0.5rem"
          width="100%"
        />
      </Box>

      {/* Description */}
      <Box>
        <label
          htmlFor="product-description"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#e2e8f0',
            marginBottom: '0.375rem',
          }}
        >
          Descrição
        </label>
        <Textarea
          id="product-description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição das características do produto…"
          rows={3}
          disabled={isPending}
          backgroundColor="#1e293b"
          borderColor="#334155"
          color="#f8fafc"
          _placeholder={{ color: '#64748b' }}
          _focusVisible={{ borderColor: '#3b82f6', outline: 'none' }}
          padding="0.75rem"
          borderRadius="0.5rem"
          width="100%"
        />
      </Box>

      {/* Product Image Upload */}
      <Box>
        <label
          htmlFor="product-image"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#e2e8f0',
            marginBottom: '0.375rem',
          }}
        >
          Imagem do Produto <span style={{ color: '#f87171' }} aria-hidden="true">*</span>
        </label>

        <Box
          border="2px dashed"
          borderColor={previewUrl ? '#3b82f6' : '#334155'}
          borderRadius="0.5rem"
          padding="1rem"
          backgroundColor="#0b1329"
          textAlign="center"
          position="relative"
        >
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
            <Flex direction="column" align="center" gap="0.75rem">
              <Box
                position="relative"
                width="120px"
                height="120px"
                borderRadius="0.375rem"
                overflow="hidden"
                border="1px solid #334155"
              >
                <img
                  src={previewUrl}
                  alt="Pré-visualização do produto"
                  width={120}
                  height={120}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Flex align="center" gap="0.5rem">
                <Text fontSize="0.75rem" color="#94a3b8">
                  {selectedFile?.name}
                </Text>
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isPending}
                  size="xs"
                  aria-label="Remover imagem selecionada"
                  variant="ghost"
                  color="#f87171"
                  _hover={{ backgroundColor: '#450a0a' }}
                  padding="0.25rem 0.5rem"
                >
                  <X size={14} aria-hidden="true" />
                  Remover
                </Button>
              </Flex>
            </Flex>
          ) : (
            <Flex direction="column" align="center" gap="0.5rem">
              <Box color="#64748b" marginBottom="0.25rem">
                <ImageIcon size={32} aria-hidden="true" />
              </Box>
              <Text fontSize="0.875rem" color="#94a3b8">
                Formatos suportados: PNG, JPEG, WebP (máx. 5&nbsp;MB)
              </Text>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                size="sm"
                backgroundColor="#1e293b"
                color="#f8fafc"
                border="1px solid #334155"
                _hover={{ backgroundColor: '#334155' }}
                gap="0.5rem"
                paddingX="1rem"
                paddingY="0.5rem"
                borderRadius="0.375rem"
              >
                <Upload size={16} aria-hidden="true" />
                Selecionar Imagem
              </Button>
            </Flex>
          )}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Flex justify="flex-end" gap="0.75rem" marginTop="0.5rem">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            variant="outline"
            borderColor="#334155"
            color="#94a3b8"
            _hover={{ backgroundColor: '#1e293b', color: '#f8fafc' }}
            paddingX="1.25rem"
            paddingY="0.625rem"
            borderRadius="0.5rem"
          >
            Cancelar
          </Button>
        )}

        <Button
          type="submit"
          disabled={isPending}
          backgroundColor="#2563eb"
          color="#ffffff"
          fontWeight="600"
          _hover={{ backgroundColor: '#1d4ed8' }}
          _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
          paddingX="1.5rem"
          paddingY="0.625rem"
          borderRadius="0.5rem"
        >
          {isPending ? 'Criando Produto…' : 'Criar Produto'}
        </Button>
      </Flex>
    </form>
  )
}
