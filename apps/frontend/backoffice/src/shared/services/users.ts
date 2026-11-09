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

export interface ResetUserPasswordData {
  id: string
  newPassword: string
}

export interface ChangeOwnPasswordData {
  currentPassword: string
  newPassword: string
}

export interface UpdateOwnProfileData {
  name: string
  email: string
  currentPassword?: string
  newPassword?: string
}

export interface AuthProfileResponse {
  user: AuthUser
  token: string
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

export const deleteBackofficeUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/users/${id}`)
}

export const resetBackofficeUserPassword = async ({ id, newPassword }: ResetUserPasswordData): Promise<void> => {
  await apiClient.patch(`/api/admin/users/${id}/password`, { new_password: newPassword })
}

export const changeOwnPassword = async (data: ChangeOwnPasswordData): Promise<void> => {
  await apiClient.patch('/api/admin/auth/password', {
    current_password: data.currentPassword,
    new_password: data.newPassword,
  })
}

export const updateOwnProfile = async (data: UpdateOwnProfileData): Promise<AuthProfileResponse> => {
  const payload: Record<string, string> = {
    name: data.name,
    email: data.email,
  }
  if (data.newPassword) {
    payload.current_password = data.currentPassword || ''
    payload.new_password = data.newPassword
  }
  const response = await apiClient.patch<ApiResponse<AuthProfileResponse>>('/api/admin/auth/profile', payload)
  return response.data.data
}
