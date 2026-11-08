import axios from 'axios'
import { clearStoredAuth, getStoredToken } from './auth'

const getMetaEnv = (): Record<string, string> | undefined => {
  try {
    const fn = new Function('return typeof import.meta !== "undefined" ? import.meta.env : undefined')
    return fn()
  } catch {
    return undefined
  }
}

export const getApiBaseUrl = (): string => {
  const metaEnv = getMetaEnv()
  if (metaEnv?.VITE_API_BASE_URL) {
    return metaEnv.VITE_API_BASE_URL.replace(/\/+$/, '')
  }
  const envUrl = (globalThis as { process?: { env?: Record<string, string> } })?.process?.env?.VITE_API_BASE_URL
  if (envUrl) {
    return envUrl.replace(/\/+$/, '')
  }
  return 'http://localhost:8080'
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: 'application/json',
  },
})

// Request interceptor to inject Authorization Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      if (!url.includes('/auth/login')) {
        clearStoredAuth()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-unauthorized'))
        }
      }
    }
    return Promise.reject(error)
  },
)
