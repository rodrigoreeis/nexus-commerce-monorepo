import { Shield, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/shared/theme/provider'
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
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.headerRoot} data-testid="backoffice-header">
      <div className={styles.titleContainer}>
        <h1 className={styles.headerTitle}>{title}</h1>
      </div>

      <div className={styles.userProfile}>
        <button
          type="button"
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title={theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
          onClick={toggleTheme}
          className={styles.themeButton}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.userDetails}>
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
