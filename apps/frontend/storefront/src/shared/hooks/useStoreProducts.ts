import { useQuery } from '@tanstack/react-query'
import { getStoreProducts, type Product } from '@/shared/services/catalog'

/**
 * TanStack React Query hook for storefront products with initialData support for SSR.
 *
 * @param initialData - Optional prefetched product list from SSR.
 * @returns React Query result object for product catalog.
 */
export const useStoreProducts = (initialData?: Product[]) => {
  return useQuery({
    queryKey: ['store-products'],
    queryFn: getStoreProducts,
    initialData,
    retry: false,
  })
}
