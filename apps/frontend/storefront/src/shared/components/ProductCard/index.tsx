'use client'

import { useState } from 'react'
import { Package, ShoppingBag } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { formatStorePrice } from '@/shared/utils/format'
import { useAddToCart } from '@/shared/hooks/useCart'
import { useCartUI } from '@/shared/contexts/CartContext'
import styles from './styles.module.css'

export interface ProductCardProps {
  product: Product
  actionLabel?: string
  onSelect?: (product: Product) => void
}

export const ProductCard = ({
  product,
  actionLabel = 'Adicionar ao Carrinho',
  onSelect,
}: ProductCardProps) => {
  const [imageHasError, setImageHasError] = useState(false)
  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { openCart } = useCartUI()

  const productName = product?.name || 'Produto sem nome'
  const formattedPrice = formatStorePrice(product?.price)
  const hasValidImage = Boolean(product?.imageUrl) && !imageHasError

  const handleClick = () => {
    onSelect?.(product)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onSelect(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product || isAdding) return
    addToCart(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          openCart()
        },
      }
    )
  }

  return (
    <article
      data-testid={`product-card-${product?.id || 'unknown'}`}
      className={`${styles.card} ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className={styles.imageWrapper}>
        {hasValidImage ? (
          <img
            src={product.imageUrl}
            alt={productName}
            width={400}
            height={400}
            loading="lazy"
            onError={() => setImageHasError(true)}
            className={styles.productImage}
          />
        ) : (
          <div
            data-testid="product-image-fallback"
            role="img"
            aria-label={`${productName} - imagem ilustrativa`}
            className={styles.fallbackWrapper}
          >
            <Package className={styles.fallbackIcon} aria-hidden="true" />
            <span className={styles.fallbackText}>
              Sem imagem
            </span>
          </div>
        )}
      </div>

      <div className={styles.detailsWrapper}>
        <h3
          className={styles.title}
          title={productName}
        >
          {productName}
        </h3>

        <div className={styles.priceContainer}>
          <span className={styles.priceLabel}>
            Preço
          </span>
          <span className={styles.priceValue}>
            {formattedPrice}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label={`${actionLabel} - ${productName}`}
          className={styles.actionButton}
        >
          <ShoppingBag size={16} aria-hidden="true" />
          <span>{isAdding ? 'Adicionando...' : actionLabel}</span>
        </button>
      </div>
    </article>
  )
}
