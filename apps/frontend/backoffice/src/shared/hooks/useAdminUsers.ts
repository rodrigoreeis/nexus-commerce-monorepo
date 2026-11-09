import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChangeOwnPasswordData,
  CreateBackofficeUserData,
  ResetUserPasswordData,
  UpdateBackofficeUserRoleData,
  UpdateOwnProfileData,
  changeOwnPassword,
  createBackofficeUser,
  deleteBackofficeUser,
  fetchBackofficeUsers,
  resetBackofficeUserPassword,
  updateBackofficeUserRole,
  updateOwnProfile,
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

/**
 * Hook to delete a backoffice user.
 */
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBackofficeUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

/**
 * Hook to reset another user's password (administrative).
 */
export const useResetAdminUserPassword = () => {
  return useMutation({
    mutationFn: (data: ResetUserPasswordData) => resetBackofficeUserPassword(data),
  })
}

/**
 * Hook to change own password.
 */
export const useChangeOwnPassword = () => {
  return useMutation({
    mutationFn: (data: ChangeOwnPasswordData) => changeOwnPassword(data),
  })
}

/**
 * Hook to update own profile (name, email, password).
 */
export const useUpdateOwnProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateOwnProfileData) => updateOwnProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
