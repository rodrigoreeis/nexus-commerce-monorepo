import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from '@/shared/services/products'

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

/**
 * Hook to delete a product and automatically invalidate the products cache.
 *
 * @returns React Query mutation result for product deletion.
 */
export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })
}

/**
 * Hook to update an existing product and automatically invalidate the products cache.
 *
 * @returns React Query mutation result for product update.
 */
export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateAdminProduct({ id, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })
}


