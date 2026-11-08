import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateBackofficeUserData,
  UpdateBackofficeUserRoleData,
  createBackofficeUser,
  fetchBackofficeUsers,
  updateBackofficeUserRole,
} from '@/shared/services/users'

/**
 * Hook to fetch backoffice users list.
 */
export const useAdminUsers = (enabled = true) => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchBackofficeUsers,
    enabled,
    retry: false,
  })
}

/**
 * Hook to create a new backoffice user.
 */
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBackofficeUserData) => createBackofficeUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

/**
 * Hook to update a backoffice user's role.
 */
export const useUpdateAdminUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBackofficeUserRoleData) => updateBackofficeUserRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
