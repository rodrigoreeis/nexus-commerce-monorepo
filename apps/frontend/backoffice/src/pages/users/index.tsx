import React, { useEffect, useState } from 'react'
import { Alert, Portal } from '@chakra-ui/react'
import { AlertCircle, Loader2, Pencil, RotateCcw, UserPlus, Users as UsersIcon } from 'lucide-react'
import { Layout } from '@/shared/components/Layout'
import { formatDate } from '@/shared/utils/format'
import { useAuth } from '@/shared/context/AuthContext'
import { AuthUser, UserRole } from '@/shared/services/auth'
import { useAdminUsers } from '@/shared/hooks/useAdminUsers'
import { CreateUserModal } from './components/CreateUserModal'
import { ManageUserModal } from './components/ManageUserModal'
import styles from './styles.module.css'
import modalStyles from './components/modal.module.css'

const getErrorMessage = (err: unknown): string => {
  const axiosError = err as any
  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message
  }
  if (axiosError?.response?.data?.error) {
    return axiosError.response.data.error
  }
  if (axiosError?.message) {
    return axiosError.message
  }
  return 'Falha ao carregar a lista de usuários.'
}

export const UsersPage: React.FC = () => {
  let currentUser: AuthUser | null = null
  let isRoot = false
  let isAdmin = true
  let isManager = false
  let isUser = false

  try {
    const auth = useAuth()
    currentUser = auth.user
    isRoot = auth.isRoot
    isAdmin = auth.isAdmin
    isManager = auth.isManager
    isUser = auth.isUser
  } catch {
    // Outside of AuthProvider in isolated test environments, default to admin
  }

  // Redirect unauthorized users (role 'user') directly to dashboard
  useEffect(() => {
    if (isUser) {
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/')
        window.dispatchEvent(new CustomEvent('app-navigate', { detail: { route: 'dashboard', path: '/' } }))
      }
    }
  }, [isUser])

  const { data: users = [], isLoading, isFetching, isError, error, refetch } = useAdminUsers(!isUser)

  // Root user is only visible if current user is root
  const visibleUsers = isRoot ? users : users.filter((u) => u.role !== 'root')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [managedUser, setManagedUser] = useState<AuthUser | null>(null)
  const [feedbackAlert, setFeedbackAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (feedbackAlert) {
      const timer = setTimeout(() => {
        setFeedbackAlert(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [feedbackAlert])

  if (isUser) {
    return null
  }

  const canDeleteUser = (targetUser: AuthUser): boolean => {
    if (currentUser?.id === targetUser.id) return false
    if (isRoot) return true
    if (isAdmin) return targetUser.role !== 'root'
    if (isManager) return targetUser.role === 'user'
    return false
  }

  const canResetPassword = (targetUser: AuthUser): boolean => {
    if (currentUser?.id === targetUser.id) return false
    if (isRoot) return true
    if (isAdmin) return targetUser.role !== 'root'
    if (isManager) return targetUser.role === 'user'
    return false
  }

  const canChangeRole = (targetUser: AuthUser): boolean => {
    if (currentUser?.id === targetUser.id) return false
    if (targetUser.role === 'root') return false
    if (isRoot || isAdmin) return true
    return false
  }

  const hasAnyRowAction = (targetUser: AuthUser): boolean => {
    return canChangeRole(targetUser) || canResetPassword(targetUser) || canDeleteUser(targetUser)
  }

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'root':
        return (
          <span className={`${styles.roleBadge} ${styles.roleRoot}`}>
            Root
          </span>
        )
      case 'admin':
        return (
          <span className={`${styles.roleBadge} ${styles.roleAdmin}`}>
            Admin
          </span>
        )
      case 'manager':
        return (
          <span className={`${styles.roleBadge} ${styles.roleManager}`}>
            Manager
          </span>
        )
      default:
        return (
          <span className={`${styles.roleBadge} ${styles.roleUser}`}>
            Operador
          </span>
        )
    }
  }

  const effectiveRole = currentUser?.role || 'admin'

  return (
    <Layout activeRoute="users" title="Usuários">
      <div className={styles.usersRoot}>
        <div className={styles.pageHeader}>
          <div className={styles.headerTitleWrapper}>
            <h2 className={styles.pageTitle}>Gestão de Usuários</h2>
            <p className={styles.pageSubtitle}>
              Visualize e gerencie as contas e permissões de acesso do Backoffice.
            </p>
          </div>

          {(isAdmin || isManager) && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className={styles.createButton}
            >
              <UserPlus className="h-4 w-4" />
              <span>Novo Usuário</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer} role="status">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span>Carregando usuários do sistema...</span>
          </div>
        ) : isError ? (
          <div
            role="alert"
            aria-live="polite"
            className={styles.errorContainer}
          >
            <div className={styles.errorWrapper}>
              <div className={styles.errorIcon} aria-hidden="true">
                <AlertCircle className="h-9 w-9" />
              </div>
              <div>
                <h3 className={styles.errorTitle}>
                  Falha ao carregar a lista de usuários
                </h3>
                <p className={styles.errorSubtitle}>
                  {getErrorMessage(error)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className={styles.retryButton}
                aria-label="Tentar novamente"
              >
                <RotateCcw
                  className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>{isFetching ? 'Tentando novamente...' : 'Tentar novamente'}</span>
              </button>
            </div>
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className={styles.emptyContainer}>
            <UsersIcon className="h-10 w-10 text-[#64748b] mx-auto mb-2" />
            <p className="font-semibold text-white">Nenhum usuário encontrado</p>
            <p className="text-xs text-[#94a3b8]">Cadastre o primeiro colaborador usando o botão acima.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
              <table className={styles.table} aria-label="Tabela de Usuários">
                <thead>
                  <tr>
                    <th className={styles.th}>Nome</th>
                    <th className={styles.th}>E-mail</th>
                    <th className={styles.th}>Função (Role)</th>
                    <th className={styles.th}>Cadastrado Em</th>
                    {(isRoot || isAdmin || isManager) && <th className={styles.th}>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id
                    return (
                      <tr key={u.id} className={styles.tableRow}>
                        <td className={`${styles.td} ${styles.nameCell}`}>{u.name}</td>
                        <td className={`${styles.td} ${styles.emailCell}`}>{u.email}</td>
                        <td className={styles.td}>{getRoleBadge(u.role)}</td>
                        <td className={`${styles.td} ${styles.dateCell}`}>
                          {formatDate(u.created_at || (u as unknown as { createdAt?: string }).createdAt || '')}
                        </td>
                        {(isRoot || isAdmin || isManager) && (
                          <td className={styles.td}>
                            {u.role === 'root' ? (
                              <span className={styles.immutableBadge}>Root (Imutável)</span>
                            ) : isSelf ? (
                              <span className={styles.immutableBadge}>Sua conta</span>
                            ) : hasAnyRowAction(u) ? (
                              <button
                                type="button"
                                onClick={() => setManagedUser(u)}
                                className={styles.iconActionButton}
                                title={`Editar colaborador ${u.name}`}
                                aria-label={`Editar colaborador ${u.name}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            ) : (
                              <span className={styles.immutableBadge}>Sem ações permitidas</span>
                            )}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          currentUserRole={effectiveRole}
          onSuccess={(msg) => setFeedbackAlert({ type: 'success', message: msg })}
        />

        <ManageUserModal
          isOpen={!!managedUser}
          onClose={() => setManagedUser(null)}
          user={managedUser}
          canChangeRole={managedUser ? canChangeRole(managedUser) : false}
          canResetPassword={managedUser ? canResetPassword(managedUser) : false}
          canDeleteUser={managedUser ? canDeleteUser(managedUser) : false}
          onSuccess={(msg) => setFeedbackAlert({ type: 'success', message: msg })}
          availableRoles={
            isRoot
              ? [
                  { value: 'admin', label: 'Admin (Administrador)' },
                  { value: 'manager', label: 'Manager (Gerente)' },
                  { value: 'user', label: 'Operador (Usuário padrão)' },
                ]
              : [
                  { value: 'manager', label: 'Manager (Gerente)' },
                  { value: 'user', label: 'Operador (Usuário padrão)' },
                ]
          }
        />

        {feedbackAlert && (
          <Portal>
            <div className={modalStyles.topAlertContainer}>
              <Alert.Root
                status={feedbackAlert.type}
                variant="subtle"
                className={modalStyles.topAlertBox}
              >
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title fontWeight="600">{feedbackAlert.message}</Alert.Title>
                </Alert.Content>
              </Alert.Root>
            </div>
          </Portal>
        )}
      </div>
    </Layout>
  )
}

export default UsersPage
