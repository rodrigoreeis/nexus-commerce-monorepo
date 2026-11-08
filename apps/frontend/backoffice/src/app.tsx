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
  const { isAuthenticated } = useAuth()
  const [currentRoute, setCurrentRoute] = useState<BackofficeRoute>(resolveInitialRoute)

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname
      const hash = window.location.hash
      if (pathname === '/products' || hash === '#products' || hash === '#/products') {
        setCurrentRoute('products')
      } else if (pathname === '/users' || hash === '#users' || hash === '#/users') {
        setCurrentRoute('users')
      } else {
        setCurrentRoute('dashboard')
      }
    }

    const handleCustomNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ route: BackofficeRoute }>
      if (customEvent.detail?.route) {
        setCurrentRoute(customEvent.detail.route)
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('app-navigate', handleCustomNavigate)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('app-navigate', handleCustomNavigate)
    }
  }, [])

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (currentRoute === 'products') {
    return <ProductsPage />
  }

  if (currentRoute === 'users') {
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
