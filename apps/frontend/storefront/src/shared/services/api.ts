import axios from 'axios'

export const getApiBaseUrl = (): string => {
  return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: 'application/json',
  },
})
