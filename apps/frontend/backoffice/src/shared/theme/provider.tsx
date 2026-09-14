import { ReactNode, useState, useEffect, createContext, useContext } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './theme.css'

export type ThemeMode = 'dark' | 'light'

export interface ThemeContextType {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export interface AppProviderProps {
  children?: ReactNode
  defaultTheme?: ThemeMode
}

export const AppProvider = ({ children, defaultTheme }: AppProviderProps) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (defaultTheme) return defaultTheme
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('nexus-backoffice-theme') as ThemeMode
      if (saved === 'light' || saved === 'dark') {
        return saved
      }
    }
    return 'dark'
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      if (theme === 'light') {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      }
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('nexus-backoffice-theme', theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      })
  )

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    </ThemeContext.Provider>
  )
}
