import { apiClient } from './api'

export type UserRole = 'root' | 'admin' | 'manager' | 'user'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  created_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface ApiResponse<T> {
  message?: string
  success?: boolean
  error?: boolean
  data: T
}

export const TOKEN_STORAGE_KEY = 'nexus_backoffice_token'
export const USER_STORAGE_KEY = 'nexus_backoffice_user'

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  const item = localStorage.getItem(USER_STORAGE_KEY)
  if (!item) return null
  try {
    return JSON.parse(item) as AuthUser
  } catch {
    return null
  }
}

export const setStoredUser = (user: AuthUser): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}

export const loginAdmin = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/admin/auth/login', credentials)
  return response.data.data
}
