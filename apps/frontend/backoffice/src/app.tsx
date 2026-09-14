import { useEffect, useState } from 'react'
import { HomePage } from '@/pages/home'
import { ProductsPage } from '@/pages/products'
import { BackofficeRoute } from '@/shared/components/Header'

const resolveInitialRoute = (): BackofficeRoute => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    const hash = window.location.hash
    if (pathname === '/products' || hash === '#products' || hash === '#/products') {
      return 'products'
    }
  }
  return 'home'
}

export const App = () => {
  const [currentRoute, setCurrentRoute] = useState<BackofficeRoute>(resolveInitialRoute)

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname
      const hash = window.location.hash
      if (pathname === '/products' || hash === '#products' || hash === '#/products') {
        setCurrentRoute('products')
      } else {
        setCurrentRoute('home')
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

  return <HomePage />
}

export default App
