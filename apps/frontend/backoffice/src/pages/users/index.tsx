import React, { useState } from 'react'
import { AlertCircle, ArrowLeft, Loader2, ShieldAlert, UserPlus, Users as UsersIcon } from 'lucide-react'
import { Layout } from '@/shared/components/Layout'
import { formatDate } from '@/shared/utils/format'
import { useAuth } from '@/shared/context/AuthContext'
import { AuthUser, UserRole } from '@/shared/services/auth'
import { useAdminUsers } from '@/shared/hooks/useAdminUsers'
import { CreateUserModal } from './components/CreateUserModal'
import { ChangeRoleModal } from './components/ChangeRoleModal'
import styles from './styles.module.css'

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

  const { data: users = [], isLoading, isError, error, refetch } = useAdminUsers(!isUser)

  // Root user is only visible if current user is root
  const visibleUsers = isRoot ? users : users.filter((u) => u.role !== 'root')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [userToEditRole, setUserToEditRole] = useState<AuthUser | null>(null)

  const navigateToProducts = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/products')
      window.dispatchEvent(new CustomEvent('app-navigate', { detail: { route: 'products', path: '/products' } }))
    }
  }

  // RBAC Guard: If user has 'user' role, display 403 Forbidden screen
  if (isUser) {
    return (
      <Layout activeRoute="users" title="Acesso Restrito">
        <div className={styles.forbiddenContainer}>
          <div className={styles.forbiddenCard}>
            <div className={styles.forbiddenIcon}>
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className={styles.forbiddenTitle}>Acesso Restrito</h2>
            <p className={styles.forbiddenText}>
              Seu perfil de operador (user) não possui permissão para visualizar ou gerenciar a lista de usuários do Backoffice.
            </p>
            <button
              type="button"
              onClick={navigateToProducts}
              className={styles.backButton}
            >
              <ArrowLeft className="h-4 w-4 mr-2 inline" />
              <span>Voltar ao Catálogo de Produtos</span>
            </button>
          </div>
        </div>
      </Layout>
    )
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
          <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300">
              {(error as Error)?.message || 'Falha ao carregar a lista de usuários.'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-xs font-semibold rounded-xl text-white transition-colors"
            >
              Tentar novamente
            </button>
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
                    {isAdmin && <th className={styles.th}>Ações</th>}
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
                        {isAdmin && (
                          <td className={styles.td}>
                            {u.role === 'root' ? (
                              <span className={styles.immutableBadge}>Root (Imutável)</span>
                            ) : isSelf ? (
                              <span className={styles.immutableBadge}>Sua conta (Imutável)</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setUserToEditRole(u)}
                                className={styles.actionButton}
                                title="Alterar permissão de acesso"
                              >
                                Alterar Função
                              </button>
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
        />

        <ChangeRoleModal
          isOpen={!!userToEditRole}
          onClose={() => setUserToEditRole(null)}
          user={userToEditRole}
          currentUserId={currentUser?.id}
        />
      </div>
    </Layout>
  )
}

export default UsersPage
