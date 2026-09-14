import { Bell, Shield } from 'lucide-react'
import styles from './styles.module.css'

export type BackofficeRoute = 'dashboard' | 'users' | 'products' | 'home'

export interface HeaderProps {
  title?: string
  systemStatus?: 'online' | 'maintenance' | 'offline'
  activeRoute?: BackofficeRoute
  onNavigate?: (route: BackofficeRoute) => void
}

export const Header = ({
  title = 'Nexus Backoffice',
}: HeaderProps) => {
  return (
    <header className={styles.headerRoot} data-testid="backoffice-header">
      <div className="flex items-center gap-3">
        <h1 className={styles.headerTitle}>{title}</h1>
      </div>

      <div className={styles.userProfile}>
        <div className="flex items-center gap-2 p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] cursor-pointer">
          <Bell size={18} aria-label="Notificações" />
        </div>

        <div className="h-6 w-px bg-[#334155]" />

        <div className="flex items-center gap-3">
          <div className={styles.userAvatar} aria-hidden="true">
            <Shield size={16} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Administrador</span>
            <span className={styles.userRole}>admin@nexuscommerce.com</span>
          </div>
        </div>
      </div>
    </header>
  )
}
