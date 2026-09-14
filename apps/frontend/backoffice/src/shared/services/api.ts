import axios from 'axios'

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
