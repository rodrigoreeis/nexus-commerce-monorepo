import { PackageOpen, AlertTriangle } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { ProductCard } from '@/shared/components/ProductCard'
import styles from './styles.module.css'

export interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  error?: string | null
  emptyTitle?: string
  emptyDescription?: string
  skeletonCount?: number
}

export const ProductGrid = ({
  products,
  isLoading = false,
  error = null,
  emptyTitle = 'Nenhum Produto Disponível',
  emptyDescription = 'Nosso catálogo está sendo atualizado no momento. Volte em breve para conferir as novidades!',
  skeletonCount = 8,
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div
        data-testid="product-grid-loading"
        className={styles.gridContainer}
      >
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            data-testid="product-card-skeleton"
            className={styles.skeletonCard}
          >
            <div className={styles.skeletonImage} />

            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLines}>
                <div className={styles.skeletonLineHeader} />
                <div className={styles.skeletonLineBodyFull} />
                <div className={styles.skeletonLineBodyPart} />
              </div>

              <div className={styles.skeletonFooter}>
                <div className={styles.skeletonPriceArea}>
                  <div className={styles.skeletonPriceLabel} />
                  <div className={styles.skeletonPriceValue} />
                </div>
                <div className={styles.skeletonButton} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        data-testid="product-grid-error"
        className={styles.errorContainer}
      >
        <div className={styles.errorIconWrapper}>
          <AlertTriangle className={styles.errorIcon} aria-hidden="true" />
        </div>
        <h3 className={styles.errorTitle}>Não foi possível carregar o catálogo</h3>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div
        data-testid="product-grid-empty"
        className={styles.emptyContainer}
      >
        <div className={styles.emptyIconWrapper}>
          <PackageOpen className={styles.emptyIcon} aria-hidden="true" />
        </div>
        <h3 className={styles.emptyTitle}>{emptyTitle}</h3>
        <p className={styles.emptyDescription}>{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div
      data-testid="product-grid"
      className={styles.gridContainer}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
