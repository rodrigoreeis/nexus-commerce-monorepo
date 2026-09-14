'use client'

import { useState } from 'react'
import { ShoppingCart, Package } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { formatStorePrice, truncateDescription } from '@/shared/utils/format'
import styles from './styles.module.css'

export interface ProductCardProps {
  product: Product
  actionLabel?: string
}

export const ProductCard = ({
  product,
  actionLabel = 'Adicionar ao Carrinho',
}: ProductCardProps) => {
  const [imageHasError, setImageHasError] = useState(false)

  const productName = product?.name || 'Produto sem nome'
  const productDescription = product?.description
    ? truncateDescription(product.description, 95)
    : 'Nenhuma descrição fornecida.'
  const formattedPrice = formatStorePrice(product?.price)
  const hasValidImage = Boolean(product?.imageUrl) && !imageHasError

  return (
    <article
      data-testid={`product-card-${product?.id || 'unknown'}`}
      className={styles.card}
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
        <div className={styles.infoWrapper}>
          <h3
            className={styles.title}
            title={productName}
          >
            {productName}
          </h3>
          <p
            className={styles.description}
            title={product?.description || ''}
          >
            {productDescription}
          </p>
        </div>

        <div className={styles.footer}>
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
            disabled
            aria-label={`${actionLabel} - ${productName} (Prévia da Release 2)`}
            title="Disponível na Release 2"
            className={styles.actionButton}
          >
            <ShoppingCart className={styles.actionIcon} aria-hidden="true" />
            <span>{actionLabel}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
