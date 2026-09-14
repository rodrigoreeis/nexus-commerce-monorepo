import axios from 'axios'

export const getApiBaseUrl = (): string => {
  const envUrl = (globalThis as { process?: { env?: Record<string, string> } })?.process?.env?.VITE_API_BASE_URL
  if (envUrl) {
    return envUrl
  }
  return 'http://localhost:8080'
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: 'application/json',
  },
})
