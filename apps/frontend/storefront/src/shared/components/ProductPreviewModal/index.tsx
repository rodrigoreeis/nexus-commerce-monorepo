'use client'

import { useEffect, useState } from 'react'
import { X, ShoppingCart, Package } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { formatStorePrice } from '@/shared/utils/format'
import styles from './styles.module.css'

export interface ProductPreviewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export const ProductPreviewModal = ({
  product,
  isOpen,
  onClose,
}: ProductPreviewModalProps) => {
  const [imageHasError, setImageHasError] = useState(false)

  useEffect(() => {
    setImageHasError(false)
  }, [product?.id])

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) {
    return null
  }

  const productName = product.name || 'Produto sem nome'
  const productDescription = product.description || 'Nenhuma descrição fornecida.'
  const formattedPrice = formatStorePrice(product.price)
  const hasValidImage = Boolean(product.imageUrl) && !imageHasError

  return (
    <div
      className={styles.overlay}
      data-testid="product-preview-overlay"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-preview-title"
        data-testid="product-preview-modal"
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar prévia do produto"
          className={styles.closeButton}
        >
          <X className={styles.closeIcon} aria-hidden="true" />
        </button>

        <div className={styles.contentGrid}>
          {/* Left Column: Enlarged Product Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {hasValidImage ? (
                <img
                  src={product.imageUrl}
                  alt={productName}
                  onError={() => setImageHasError(true)}
                  className={styles.productImage}
                />
              ) : (
                <div
                  data-testid="product-preview-image-fallback"
                  role="img"
                  aria-label={`${productName} - imagem ilustrativa`}
                  className={styles.fallbackWrapper}
                >
                  <Package className={styles.fallbackIcon} aria-hidden="true" />
                  <span className={styles.fallbackText}>Sem imagem</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Information */}
          <div className={styles.detailsSection}>
            <div className={styles.headerInfo}>
              <h2 id="product-preview-title" className={styles.title}>
                {productName}
              </h2>
              <div className={styles.priceContainer}>
                <span className={styles.priceLabel}>Preço</span>
                <span className={styles.priceValue}>{formattedPrice}</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.descriptionSection}>
              <h3 className={styles.descriptionHeading}>Descrição do Produto</h3>
              <p className={styles.descriptionText}>
                {productDescription}
              </p>
            </div>

            <div className={styles.actionSection}>
              <button
                type="button"
                disabled
                aria-label={`Adicionar ao Carrinho - ${productName} (Prévia da Release 2)`}
                title="Disponível na Release 2"
                className={styles.actionButton}
              >
                <ShoppingCart className={styles.actionIcon} aria-hidden="true" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
