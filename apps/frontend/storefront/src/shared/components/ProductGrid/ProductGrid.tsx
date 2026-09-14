import { PackageOpen, AlertTriangle } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { ProductCard } from '@/shared/components/ProductCard/ProductCard'

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
  emptyTitle = 'No Products Available',
  emptyDescription = 'Our catalog is currently being updated. Please check back soon for new arrivals!',
  skeletonCount = 8,
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div
        data-testid="product-grid-loading"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            data-testid="product-card-skeleton"
            className="flex flex-col overflow-hidden rounded-xl border border-gray-800/80 bg-[#111827] shadow-sm animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="aspect-square w-full bg-gray-800/60" />

            {/* Content Skeleton */}
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-800" />
                <div className="h-3 w-full rounded bg-gray-800/60" />
                <div className="h-3 w-2/3 rounded bg-gray-800/60" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
                <div className="space-y-1">
                  <div className="h-2.5 w-8 rounded bg-gray-800/60" />
                  <div className="h-5 w-16 rounded bg-gray-800" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-gray-800" />
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
        className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-10 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-900/40 text-rose-400 mb-3">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-white">Unable to Load Catalog</h3>
        <p className="mt-1.5 text-sm text-gray-400 max-w-md mx-auto">{error}</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div
        data-testid="product-grid-empty"
        className="rounded-xl border border-dashed border-gray-800 bg-[#111827]/40 py-16 px-6 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-800/70 text-gray-400 mb-4">
          <PackageOpen className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
