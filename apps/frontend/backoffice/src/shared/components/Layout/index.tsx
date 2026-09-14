import { ReactNode } from 'react'
import { Sidebar, BackofficeRoute } from '@/shared/components/Sidebar'
import { Header } from '@/shared/components/Header'
import styles from './styles.module.css'

export interface LayoutProps {
  children?: ReactNode
  activeRoute?: BackofficeRoute
  title?: string
  onNavigate?: (route: BackofficeRoute) => void
}

export const Layout = ({
  children,
  activeRoute = 'dashboard',
  title = 'Nexus Backoffice',
  onNavigate,
}: LayoutProps) => {
  return (
    <div className={styles.layoutRoot}>
      <Sidebar activeRoute={activeRoute} onNavigate={onNavigate} />
      <div className={styles.contentWrapper}>
        <Header title={title} activeRoute={activeRoute} onNavigate={onNavigate} />
        <main className={styles.mainArea}>
          {children}
        </main>
      </div>
    </div>
  )
}
