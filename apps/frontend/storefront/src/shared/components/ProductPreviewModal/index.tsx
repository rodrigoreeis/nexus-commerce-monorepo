'use client'

import { useEffect, useState } from 'react'
import { X, ShoppingCart, Package, Minus, Plus } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { formatStorePrice } from '@/shared/utils/format'
import { useAddToCart } from '@/shared/hooks/useCart'
import { useCartUI } from '@/shared/contexts/CartContext'
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
  const [quantity, setQuantity] = useState(1)
  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { openCart } = useCartUI()

  useEffect(() => {
    setImageHasError(false)
    setQuantity(1)
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
  const totalPrice = formatStorePrice(product.price * quantity)

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(10, prev + 1))
  }

  const handleAddToCart = () => {
    addToCart(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          onClose()
          openCart()
        },
      }
    )
  }

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
          {/* Left Column: Product Image */}
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

          {/* Right Column: Information & Actions */}
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

            {/* Quantity Selector */}
            <div className={styles.quantityRow}>
              <span id="preview-quantity-label" className={styles.quantityLabel}>
                Quantidade
              </span>
              <div
                className={styles.quantityControls}
                role="group"
                aria-labelledby="preview-quantity-label"
              >
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1 || isAdding}
                  aria-label="Diminuir quantidade"
                  className={styles.quantityBtn}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span
                  className={styles.quantityValue}
                  aria-live="polite"
                  data-testid="preview-quantity-value"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= 10 || isAdding}
                  aria-label="Aumentar quantidade"
                  className={styles.quantityBtn}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className={styles.actionSection}>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                aria-label={`Adicionar ${quantity} ${productName} ao carrinho`}
                className={styles.actionButton}
              >
                <ShoppingCart className={styles.actionIcon} aria-hidden="true" />
                <span>
                  {isAdding
                    ? 'Adicionando...'
                    : quantity > 1
                      ? `Adicionar ao Carrinho • ${totalPrice}`
                      : 'Adicionar ao Carrinho'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
