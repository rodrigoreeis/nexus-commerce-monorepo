import { Shield, Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from '@/shared/theme/provider'
import { useAuth } from '@/shared/context/AuthContext'
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

  let user = null
  let logout: (() => void) | null = null

  try {
    const auth = useAuth()
    user = auth.user
    logout = auth.logout
  } catch {
    // Outside of AuthProvider in isolated tests
  }

  const displayName = user?.name || 'Administrador'
  const displayEmail = user?.email || 'admin@nexuscommerce.com'
  const userRole = user?.role || 'admin'

  const getRoleBadgeClass = () => {
    switch (userRole) {
      case 'root':
        return `${styles.roleBadge} ${styles.roleRoot}`
      case 'admin':
        return `${styles.roleBadge} ${styles.roleAdmin}`
      case 'manager':
        return `${styles.roleBadge} ${styles.roleManager}`
      case 'user':
        return `${styles.roleBadge} ${styles.roleUser}`
      default:
        return styles.roleBadge
    }
  }

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
            <div className="flex items-center gap-2">
              <span className={styles.userName}>{displayName}</span>
              <span className={getRoleBadgeClass()}>{userRole}</span>
            </div>
            <span className={styles.userRole}>{displayEmail}</span>
          </div>

          {logout && (
            <button
              type="button"
              onClick={logout}
              className={styles.logoutButton}
              title="Sair do sistema"
              aria-label="Sair do sistema"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
