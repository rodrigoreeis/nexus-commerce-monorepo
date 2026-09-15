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
  onSelectProduct?: (product: Product) => void
}

export const ProductCarousel = ({
  products = [],
  isLoading = false,
  error = null,
  itemsPerPage = 4,
  title = 'Ofertas em Destaque',
  emptyTitle = 'Nenhum Produto Disponível',
  emptyDescription = 'Nosso catálogo está sendo atualizado no momento. Volte em breve para conferir as novidades!',
  onSelectProduct,
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
      </div>

      <div
        data-testid="product-carousel-grid"
        className={styles.gridContainer}
      >
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div
          data-testid="product-carousel-pagination"
          className={styles.paginationContainer}
        >
          <button
            type="button"
            className={styles.navButton}
            onClick={handlePrev}
            disabled={!hasPrevious}
            aria-label="Página anterior de produtos"
          >
            <ChevronLeft className={styles.navIcon} aria-hidden="true" />
          </button>

          <div
            className={styles.bulletsWrapper}
            role="tablist"
            aria-label="Navegação do carrossel de ofertas"
          >
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === safePage
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Ir para a página ${idx + 1}`}
                  className={`${styles.bullet} ${isActive ? styles.bulletActive : styles.bulletInactive}`}
                  onClick={() => setCurrentPage(idx)}
                />
              )
            })}
          </div>

          <button
            type="button"
            className={styles.navButton}
            onClick={handleNext}
            disabled={!hasNext}
            aria-label="Próxima página de produtos"
          >
            <ChevronRight className={styles.navIcon} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}
