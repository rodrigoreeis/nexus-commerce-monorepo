import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  AuthUser,
  LoginRequest,
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  loginAdmin,
  setStoredToken,
  setStoredUser,
} from '@/shared/services/auth'

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isRoot: boolean
  isAdmin: boolean
  isManager: boolean
  isUser: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  updateCurrentUser: (user: AuthUser, token?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const logout = () => {
    clearStoredAuth()
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-unauthorized', handleUnauthorized)
      return () => {
        window.removeEventListener('auth-unauthorized', handleUnauthorized)
      }
    }
  }, [])

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    try {
      const data = await loginAdmin(credentials)
      setStoredToken(data.token)
      setStoredUser(data.user)
      setToken(data.token)
      setUser(data.user)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCurrentUser = (updatedUser: AuthUser, newToken?: string) => {
    setUser(updatedUser)
    setStoredUser(updatedUser)
    if (newToken) {
      setToken(newToken)
      setStoredToken(newToken)
    }
  }

  const isAuthenticated = !!token && !!user
  const isRoot = user?.role === 'root'
  const isAdmin = isRoot || user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const isUser = user?.role === 'user'

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isRoot,
        isAdmin,
        isManager,
        isUser,
        login,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
