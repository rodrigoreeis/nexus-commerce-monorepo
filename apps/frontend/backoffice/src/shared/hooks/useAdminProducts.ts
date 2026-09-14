import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminProduct, fetchAdminProducts } from '@/shared/services/products'

/**
 * Hook to fetch the administrative product list.
 *
 * @returns React Query query result for admin products.
 */
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
    retry: false,
  })
}

/**
 * Hook to create a new product and automatically invalidate the products cache.
 *
 * @returns React Query mutation result for product creation.
 */
export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => createAdminProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })
}
