import axios from 'axios'
import { getOrCreateSessionId } from '@/shared/utils/session'

export const getApiBaseUrl = (): string => {
  return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const sessionId = getOrCreateSessionId()
  if (sessionId) {
    if (config.headers && typeof (config.headers as any).set === 'function') {
      (config.headers as any).set('X-Session-ID', sessionId)
    } else {
      config.headers = (config.headers || {}) as any
      config.headers['X-Session-ID'] = sessionId
    }
  }
  return config
})

