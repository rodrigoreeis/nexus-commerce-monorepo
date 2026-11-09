import { useEffect, useState } from 'react'
import { HomePage } from '@/pages/home'
import { ProductsPage } from '@/pages/products'
import { UsersPage } from '@/pages/users'
import { LoginPage } from '@/pages/login'
import { BackofficeRoute } from '@/shared/components/Sidebar'
import { AuthProvider, useAuth } from '@/shared/context/AuthContext'

const resolveInitialRoute = (): BackofficeRoute => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    const hash = window.location.hash
    if (pathname === '/products' || hash === '#products' || hash === '#/products') {
      return 'products'
    }
    if (pathname === '/users' || hash === '#users' || hash === '#/users') {
      return 'users'
    }
  }
  return 'dashboard'
}

export const AppContent = () => {
  const { isAuthenticated, isUser } = useAuth()
  const [currentRoute, setCurrentRoute] = useState<BackofficeRoute>(() => {
    const initial = resolveInitialRoute()
    return initial
  })

  useEffect(() => {
    if (isUser && currentRoute === 'users') {
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/')
      }
      setCurrentRoute('dashboard')
    }
  }, [isUser, currentRoute])

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname
      const hash = window.location.hash
      if (pathname === '/products' || hash === '#products' || hash === '#/products') {
        setCurrentRoute('products')
      } else if (pathname === '/users' || hash === '#users' || hash === '#/users') {
        if (isUser) {
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', '/')
          }
          setCurrentRoute('dashboard')
        } else {
          setCurrentRoute('users')
        }
      } else {
        setCurrentRoute('dashboard')
      }
    }

    const handleCustomNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ route: BackofficeRoute }>
      if (customEvent.detail?.route) {
        if (isUser && customEvent.detail.route === 'users') {
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', '/')
          }
          setCurrentRoute('dashboard')
        } else {
          setCurrentRoute(customEvent.detail.route)
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('app-navigate', handleCustomNavigate)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('app-navigate', handleCustomNavigate)
    }
  }, [isUser])

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (currentRoute === 'products') {
    return <ProductsPage />
  }

  if (currentRoute === 'users') {
    if (isUser) {
      return <HomePage />
    }
    return <UsersPage />
  }

  return <HomePage />
}

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
