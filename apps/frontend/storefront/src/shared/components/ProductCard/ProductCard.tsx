'use client'

import { useState } from 'react'
import { ShoppingCart, Package } from 'lucide-react'
import { Product } from '@/shared/services/catalog'
import { formatStorePrice, truncateDescription } from '@/shared/utils/format'

export interface ProductCardProps {
  product: Product
  actionLabel?: string
}

export const ProductCard = ({
  product,
  actionLabel = 'Add to Cart',
}: ProductCardProps) => {
  const [imageHasError, setImageHasError] = useState(false)

  const productName = product?.name || 'Unnamed Product'
  const productDescription = product?.description
    ? truncateDescription(product.description, 95)
    : 'No description provided.'
  const formattedPrice = formatStorePrice(product?.price)
  const hasValidImage = Boolean(product?.imageUrl) && !imageHasError

  return (
    <article
      data-testid={`product-card-${product?.id || 'unknown'}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-[#111827] shadow-sm transition-all duration-200 hover:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/5 focus-within:ring-2 focus-within:ring-emerald-500/50"
    >
      {/* Product Image Wrapper with Aspect Ratio */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-950">
        {hasValidImage ? (
          <img
            src={product.imageUrl}
            alt={productName}
            width={400}
            height={400}
            loading="lazy"
            onError={() => setImageHasError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            data-testid="product-image-fallback"
            role="img"
            aria-label={`${productName} placeholder image`}
            className="flex h-full w-full flex-col items-center justify-center bg-gray-900/80 text-gray-600 gap-2"
          >
            <Package className="h-10 w-10 stroke-[1.5]" aria-hidden="true" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between p-5 min-w-0">
        <div className="min-w-0">
          <h3
            className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors truncate"
            title={productName}
          >
            {productName}
          </h3>
          <p
            className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed"
            title={product?.description || ''}
          >
            {productDescription}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-gray-800/80">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              Price
            </span>
            <span className="text-lg font-bold tracking-tight text-white tabular-nums">
              {formattedPrice}
            </span>
          </div>

          <button
            type="button"
            disabled
            aria-label={`${actionLabel} - ${productName} (Release 2 Preview)`}
            title="Available in Release 2"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700/60 bg-gray-800/80 px-3 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed transition-colors hover:border-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{actionLabel}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
