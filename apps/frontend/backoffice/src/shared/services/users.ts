import { apiClient } from './api'
import { ApiResponse, AuthUser, UserRole } from './auth'

export interface CreateBackofficeUserData {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateBackofficeUserRoleData {
  id: string
  role: UserRole
}

export const fetchBackofficeUsers = async (): Promise<AuthUser[]> => {
  const response = await apiClient.get<ApiResponse<AuthUser[]>>('/api/admin/users')
  return response.data.data
}

export const createBackofficeUser = async (data: CreateBackofficeUserData): Promise<AuthUser> => {
  const response = await apiClient.post<ApiResponse<AuthUser>>('/api/admin/users', data)
  return response.data.data
}

export const updateBackofficeUserRole = async ({ id, role }: UpdateBackofficeUserRoleData): Promise<AuthUser> => {
  const response = await apiClient.patch<ApiResponse<AuthUser>>(`/api/admin/users/${id}/role`, { role })
  return response.data.data
}
