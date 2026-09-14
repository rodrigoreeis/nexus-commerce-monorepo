import React from 'react'
import { LayoutDashboard, Users, Package } from 'lucide-react'
import styles from './styles.module.css'

export type BackofficeRoute = 'dashboard' | 'users' | 'products' | 'home'

export interface SidebarProps {
  activeRoute?: BackofficeRoute
  onNavigate?: (route: BackofficeRoute) => void
  systemStatus?: 'online' | 'maintenance' | 'offline'
}

export const Sidebar = ({
  activeRoute = 'dashboard',
  onNavigate,
  systemStatus = 'online',
}: SidebarProps) => {
  const isOnline = systemStatus === 'online'

  const normalizedRoute = activeRoute === 'home' ? 'dashboard' : activeRoute

  const handleNavClick = (route: BackofficeRoute, path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new CustomEvent('app-navigate', { detail: { route, path } }))
    }

    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <aside className={styles.sidebarRoot} aria-label="Navegação Lateral">
      <div>
        {/* Brand Area */}
        <div className={styles.brandArea}>
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
              N
            </span>
            <span className={styles.brandTitle}>Nexus Backoffice</span>
          </div>
          <span className={styles.brandBadge} aria-label="Versão da aplicação">
            v0.1.0
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navSection} aria-label="Menu Principal">
          <p className={styles.navSectionTitle}>Gerenciamento</p>

          <a
            href="/"
            onClick={handleNavClick('dashboard', '/')}
            className={`${styles.navItem} ${normalizedRoute === 'dashboard' ? styles.navItemActive : ''}`}
            aria-current={normalizedRoute === 'dashboard' ? 'page' : undefined}
          >
            <LayoutDashboard className={styles.navIcon} aria-hidden="true" />
            <span>Dashboard</span>
          </a>

          <a
            href="/users"
            onClick={handleNavClick('users', '/users')}
            className={`${styles.navItem} ${normalizedRoute === 'users' ? styles.navItemActive : ''}`}
            aria-current={normalizedRoute === 'users' ? 'page' : undefined}
          >
            <Users className={styles.navIcon} aria-hidden="true" />
            <span>Usuários</span>
          </a>

          <a
            href="/products"
            onClick={handleNavClick('products', '/products')}
            className={`${styles.navItem} ${normalizedRoute === 'products' ? styles.navItemActive : ''}`}
            aria-current={normalizedRoute === 'products' ? 'page' : undefined}
          >
            <Package className={styles.navIcon} aria-hidden="true" />
            <span>Produtos</span>
          </a>
        </nav>
      </div>

      {/* Footer Status */}
      <div
        className={styles.footerStatus}
        role="status"
        aria-label="Status operacional do sistema"
      >
        <span
          className={styles.statusDot}
          style={{ backgroundColor: isOnline ? '#10b981' : '#ef4444' }}
          aria-hidden="true"
        />
        <span>{isOnline ? 'Sistemas Operacionais' : 'Serviço Degradado'}</span>
      </div>
    </aside>
  )
}
