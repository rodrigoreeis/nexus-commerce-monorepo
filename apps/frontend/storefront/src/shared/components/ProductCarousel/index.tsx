'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, PackageOpen, AlertTriangle } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { ProductCard } from '@/shared/components/ProductCard'
import styles from './styles.module.css'

export interface ProductCarouselProps {
  products?: Product[]
  isLoading?: boolean
  error?: string | null
  itemsPerPage?: number
  title?: string
  subtitle?: string
  emptyTitle?: string
  emptyDescription?: string
}

export const ProductCarousel = ({
  products = [],
  isLoading = false,
  error = null,
  itemsPerPage = 4,
  title = 'Ofertas em Destaque',
  emptyTitle = 'Nenhum Produto Disponível',
  emptyDescription = 'Nosso catálogo está sendo atualizado no momento. Volte em breve para conferir as novidades!',
}: ProductCarouselProps) => {
  const [currentPage, setCurrentPage] = useState(0)

  if (isLoading) {
    return (
      <section aria-label={title} className={styles.section}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTextWrapper}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        </div>

        <div data-testid="product-carousel-loading" className={styles.gridContainer}>
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              data-testid="product-carousel-skeleton"
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
      </section>
    )
  }

  if (error) {
    return (
      <section aria-label={title} className={styles.section}>
        <div
          role="alert"
          data-testid="product-carousel-error"
          className={styles.errorContainer}
        >
          <div className={styles.errorIconWrapper}>
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className={styles.errorTitle}>Não foi possível carregar as ofertas</h3>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </section>
    )
  }

  const totalProducts = products.length

  if (totalProducts === 0) {
    return (
      <section aria-label={title} className={styles.section}>
        <div
          data-testid="product-carousel-empty"
          className={styles.emptyContainer}
        >
          <div className={styles.emptyIconWrapper}>
            <PackageOpen className="h-7 w-7" aria-hidden="true" />
          </div>
          <h3 className={styles.emptyTitle}>{emptyTitle}</h3>
          <p className={styles.emptyDescription}>{emptyDescription}</p>
        </div>
      </section>
    )
  }

  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages - 1)
  const startIndex = safePage * itemsPerPage
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage)

  const hasPrevious = safePage > 0
  const hasNext = safePage < totalPages - 1

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  return (
    <section aria-label={title} className={styles.section}>
      <div className={styles.headerContainer}>
        <div className={styles.headerTextWrapper}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        {totalPages > 1 && (
          <div className={styles.controlsWrapper}>
            <span className={styles.pageIndicator} aria-live="polite">
              Página {safePage + 1} de {totalPages}
            </span>

            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrev}
              disabled={!hasPrevious}
              aria-label="Página anterior de produtos"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              className={styles.navButton}
              onClick={handleNext}
              disabled={!hasNext}
              aria-label="Próxima página de produtos"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div
        data-testid="product-carousel-grid"
        className={styles.gridContainer}
      >
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
