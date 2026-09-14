import { useEffect, useState } from 'react'
import { HomePage } from '@/pages/home'
import { ProductsPage } from '@/pages/products'
import { UsersPage } from '@/pages/users'
import { BackofficeRoute } from '@/shared/components/Sidebar'

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

export const App = () => {
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

  if (currentRoute === 'products') {
    return <ProductsPage />
  }

  if (currentRoute === 'users') {
    return <UsersPage />
  }

  return <HomePage />
}

export default App
