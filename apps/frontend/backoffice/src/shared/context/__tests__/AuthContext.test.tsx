import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import * as authService from '@/shared/services/auth'
import { AuthProvider, useAuth } from '../AuthContext'

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('initializes with unauthenticated state when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isRoot).toBe(false)
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isManager).toBe(false)
    expect(result.current.isUser).toBe(false)
  })

  it('correctly computes isRoot and isAdmin for root user', () => {
    const mockRootUser: authService.AuthUser = {
      id: 'root-1',
      name: 'Nexus Root',
      email: 'admin@nexuscommerce.com',
      role: 'root',
    }
    localStorage.setItem(authService.TOKEN_STORAGE_KEY, 'root-token-123')
    localStorage.setItem(authService.USER_STORAGE_KEY, JSON.stringify(mockRootUser))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isRoot).toBe(true)
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.isManager).toBe(false)
    expect(result.current.isUser).toBe(false)
  })

  it('initializes with stored credentials from localStorage', () => {
    const mockUser: authService.AuthUser = {
      id: 'admin-1',
      name: 'Admin Test',
      email: 'admin@test.com',
      role: 'admin',
    }
    localStorage.setItem(authService.TOKEN_STORAGE_KEY, 'stored-token-123')
    localStorage.setItem(authService.USER_STORAGE_KEY, JSON.stringify(mockUser))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.email).toBe('admin@test.com')
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.isManager).toBe(false)
    expect(result.current.isUser).toBe(false)
  })

  it('successfully logs in and updates state and localStorage', async () => {
    const mockLoginResponse: authService.LoginResponse = {
      token: 'new-jwt-token',
      user: {
        id: 'manager-1',
        name: 'Manager Test',
        email: 'manager@test.com',
        role: 'manager',
      },
    }
    jest.spyOn(authService, 'loginAdmin').mockResolvedValue(mockLoginResponse)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.login({ email: 'manager@test.com', password: 'password123' })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.token).toBe('new-jwt-token')
    expect(result.current.user?.role).toBe('manager')
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isManager).toBe(true)
    expect(localStorage.getItem(authService.TOKEN_STORAGE_KEY)).toBe('new-jwt-token')
  })

  it('clears state and storage on logout', () => {
    localStorage.setItem(authService.TOKEN_STORAGE_KEY, 'token-to-clear')
    localStorage.setItem(
      authService.USER_STORAGE_KEY,
      JSON.stringify({ id: 'u1', name: 'User', email: 'u@test.com', role: 'user' })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(localStorage.getItem(authService.TOKEN_STORAGE_KEY)).toBeNull()
  })
})
