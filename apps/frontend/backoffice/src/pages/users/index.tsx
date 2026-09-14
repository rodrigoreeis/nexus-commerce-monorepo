import { useState } from 'react'
import { Layout } from '@/shared/components/Layout'
import { formatDate } from '@/shared/utils/format'
import styles from './styles.module.css'

export interface MockUser {
  id: string
  name: string
  email: string
  role: string
  status: 'Ativo' | 'Inativo'
  createdAt: string
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'USR-01',
    name: 'Lucas Silva',
    email: 'lucas.silva@email.com',
    role: 'Cliente VIP',
    status: 'Ativo',
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'USR-02',
    name: 'Mariana Costa',
    email: 'mariana.costa@email.com',
    role: 'Cliente',
    status: 'Ativo',
    createdAt: '2026-08-15T14:30:00Z',
  },
  {
    id: 'USR-03',
    name: 'Carlos Eduardo',
    email: 'carlos.edu@email.com',
    role: 'Cliente',
    status: 'Ativo',
    createdAt: '2026-08-20T09:15:00Z',
  },
  {
    id: 'USR-04',
    name: 'Beatriz Santos',
    email: 'beatriz.santos@email.com',
    role: 'Cliente VIP',
    status: 'Ativo',
    createdAt: '2026-09-01T16:45:00Z',
  },
  {
    id: 'USR-05',
    name: 'Administrador Nexus',
    email: 'admin@nexuscommerce.com',
    role: 'Administrador',
    status: 'Ativo',
    createdAt: '2026-07-01T08:00:00Z',
  },
]

export const UsersPage = () => {
  const [users] = useState<MockUser[]>(MOCK_USERS)

  return (
    <Layout activeRoute="users" title="Usuários">
      <div className={styles.usersRoot}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Gestão de Usuários</h2>
          <p className={styles.pageSubtitle}>
            Visualize e gerencie as contas de clientes e administradores da plataforma.
          </p>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="Tabela de Usuários">
              <thead>
                <tr>
                  <th className={styles.th}>Nome</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Perfil</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Cadastrado Em</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={styles.tableRow}>
                    <td className={`${styles.td} ${styles.nameCell}`}>
                      {user.name}
                    </td>
                    <td className={`${styles.td} ${styles.emailCell}`}>
                      {user.email}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.roleBadge}>
                        {user.role}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={user.status === 'Ativo' ? styles.statusActive : styles.statusInactive}>
                        {user.status}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.dateCell}`}>
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UsersPage
