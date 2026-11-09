import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Dialog, Portal, Select, createListCollection } from '@chakra-ui/react'
import {
  KeyRound,
  Loader2,
  Pencil,
  Trash2,
  UserCog,
  X,
} from 'lucide-react'
import { AuthUser, UserRole } from '@/shared/services/auth'
import {
  useDeleteAdminUser,
  useUpdateAdminUserRole,
} from '@/shared/hooks/useAdminUsers'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { ResetPasswordModal } from './ResetPasswordModal'
import styles from './modal.module.css'

export interface ManageUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
  canChangeRole: boolean
  canResetPassword: boolean
  canDeleteUser: boolean
  availableRoles: { value: UserRole; label: string }[]
  onSuccess?: (message: string) => void
}

export const ManageUserModal: React.FC<ManageUserModalProps> = ({
  isOpen,
  onClose,
  user,
  canChangeRole,
  canResetPassword,
  canDeleteUser,
  availableRoles,
  onSuccess,
}) => {
  // Role State
  const [selectedRole, setSelectedRole] = useState<UserRole>('user')
  const [roleMessage, setRoleMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const roleCollection = useMemo(
    () =>
      createListCollection({
        items: availableRoles,
      }),
    [availableRoles]
  )

  // Reset Password Modal State
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)

  // Delete Confirmation Modal State
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)

  const updateRoleMutation = useUpdateAdminUserRole()
  const deleteUserMutation = useDeleteAdminUser()

  useEffect(() => {
    if (user && isOpen) {
      setSelectedRole(user.role)
      setRoleMessage(null)
      setIsResetPasswordOpen(false)
      setIsConfirmDeleteOpen(false)
      setDeleteErrorMessage(null)
    }
  }, [user, isOpen])

  // Auto-dismiss feedback alert after 4 seconds
  useEffect(() => {
    if (roleMessage) {
      const timer = setTimeout(() => {
        setRoleMessage(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [roleMessage])

  if (!user) return null

  const handleClose = () => {
    setRoleMessage(null)
    setIsResetPasswordOpen(false)
    setIsConfirmDeleteOpen(false)
    setDeleteErrorMessage(null)
    onClose()
  }

  // 1. Submit Role Change
  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setRoleMessage(null)

    if (selectedRole === user.role) {
      setRoleMessage({ type: 'error', text: 'Selecione uma função diferente da atual.' })
      return
    }

    try {
      await updateRoleMutation.mutateAsync({
        id: user.id,
        role: selectedRole,
      })
      onSuccess?.('Função atualizada com sucesso!')
      handleClose()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setRoleMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Falha ao atualizar função.',
      })
    }
  }

  // 2. Confirm Deletion Action
  const handleConfirmDelete = async () => {
    setDeleteErrorMessage(null)
    try {
      await deleteUserMutation.mutateAsync(user.id)
      setIsConfirmDeleteOpen(false)
      handleClose()
      onSuccess?.('Usuário excluído com sucesso!')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setDeleteErrorMessage(error.response?.data?.message || error.message || 'Falha ao excluir usuário.')
    }
  }

  const initials = (user.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const getRoleBadgeClasses = (role: UserRole) => {
    switch (role) {
      case 'root':
        return styles.roleBadgeRoot
      case 'admin':
        return styles.roleBadgeAdmin
      case 'manager':
        return styles.roleBadgeManager
      case 'user':
      default:
        return styles.roleBadgeUser
    }
  }

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            handleClose()
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop
            position="fixed"
            inset="0"
            width="100vw"
            height="100vh"
            minHeight="100dvh"
            backgroundColor="rgba(0, 0, 0, 0.7)"
            backdropFilter="blur(8px)"
            zIndex={1400}
          />
          <Dialog.Positioner
            position="fixed"
            inset="0"
            width="100vw"
            height="100vh"
            minHeight="100dvh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflowY="auto"
            padding="2rem 1rem"
            zIndex={1400}
          >
            <Dialog.Content
              backgroundColor="var(--bg-surface)"
              border="1px solid var(--border-app)"
              borderRadius="1.5rem"
              padding="2rem"
              maxWidth="36rem"
              width="100%"
              color="var(--text-primary)"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.55)"
            >
              <Dialog.Header padding="0" marginBottom="1.5rem">
                <div className={styles.dialogHeaderBar}>
                  <div className={styles.dialogHeaderTitleWrapper}>
                    <div className={styles.headerIconWrapper}>
                      <UserCog className="h-6 w-6" />
                    </div>
                    <div>
                      <Dialog.Title className={styles.dialogTitle}>Gerenciar Usuário</Dialog.Title>
                      <p className={styles.dialogSubtitle}>
                        Ações e permissões do colaborador
                      </p>
                    </div>
                  </div>
                  <Dialog.CloseTrigger asChild>
                    <button
                      type="button"
                      className={styles.dialogCloseButton}
                      onClick={handleClose}
                      aria-label="Fechar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.CloseTrigger>
                </div>
              </Dialog.Header>

              <form onSubmit={handleUpdateRole} className={styles.modalBodyContainer}>
                <Dialog.Body padding="0" className={styles.modalBodyContainer}>
                  {/* 1. User Summary Card */}
                  <div className={styles.userCard}>
                    <div className={styles.userCardInfoWrapper}>
                      <div className={styles.avatarCircle}>{initials}</div>
                      <div className={styles.userCardTextGroup}>
                        <div className={styles.userCardLabel}>Colaborador</div>
                        <div className={styles.userCardName} title={user.name}>
                          {user.name}
                        </div>
                        <div className={styles.userCardEmail} title={user.email}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className={styles.badgeWrapper}>
                      <span
                        className={`${styles.roleBadgeBase} ${getRoleBadgeClasses(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* 2. Alteração de função com Chakra Select */}
                  {canChangeRole && (
                    <div className={styles.roleSection}>
                      <Select.Root
                        collection={roleCollection}
                        value={[selectedRole]}
                        onValueChange={(details) => {
                          if (details.value[0]) {
                            setSelectedRole(details.value[0] as UserRole)
                          }
                        }}
                        disabled={updateRoleMutation.isPending}
                        size="md"
                        width="100%"
                      >
                        <Select.HiddenSelect id="manage-user-role" aria-label="Selecionar nova função" />
                        <Select.Label className={styles.fieldLabel}>
                          Função no Sistema
                        </Select.Label>
                        <Select.Control>
                          <Select.Trigger className={styles.chakraSelectTrigger}>
                            <Select.ValueText placeholder="Selecione a função" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner zIndex={2000}>
                          <Select.Content className={styles.chakraSelectContent}>
                            {roleCollection.items.map((r) => (
                              <Select.Item
                                key={r.value}
                                item={r}
                                className={styles.chakraSelectItem}
                              >
                                {r.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </div>
                  )}

                  {/* 3. Botões Redefinir Senha e Excluir Usuário: lado a lado com 50% cada e espaçamento */}
                  {(canResetPassword || canDeleteUser) && (
                    <div className={styles.actionsSection}>
                      <div className={styles.twoColumnsRow}>
                        {canResetPassword && (
                          <button
                            type="button"
                            onClick={() => setIsResetPasswordOpen(true)}
                            className={styles.gridButtonWarning}
                            aria-label="Redefinir Senha do Usuário"
                          >
                            <KeyRound className="h-4 w-4" />
                            <span>Redefinir Senha</span>
                          </button>
                        )}

                        {canDeleteUser && (
                          <button
                            type="button"
                            onClick={() => setIsConfirmDeleteOpen(true)}
                            className={styles.gridButtonDanger}
                            aria-label="Excluir Usuário"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Excluir Usuário</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Dialog.Body>

                {/* 4. Rodapé: Botão Editar Usuário no lugar do Fechar com 100% de largura */}
                <div className={styles.footerArea}>
                  {canChangeRole ? (
                    <button
                      type="submit"
                      disabled={updateRoleMutation.isPending || selectedRole === user.role}
                      className={styles.fullWidthSubmitButton}
                      aria-label="Editar Usuário"
                      data-testid="update-role-submit-btn"
                    >
                      {updateRoleMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Pencil className="h-4 w-4" />
                          <span>Editar Usuário</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleClose}
                      className={styles.fullWidthCancelButton}
                    >
                      Fechar
                    </button>
                  )}
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Alert do Chakra UI: position fixed no topo da tela centralizado com CSS Module */}
      {roleMessage && (
        <Portal>
          <div className={styles.topAlertContainer}>
            <Alert.Root
              status={roleMessage.type === 'error' ? 'error' : 'success'}
              variant="subtle"
              className={styles.topAlertBox}
            >
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title fontWeight="600">{roleMessage.text}</Alert.Title>
              </Alert.Content>
            </Alert.Root>
          </div>
        </Portal>
      )}

      {/* Modal dedicado de redefinição de senha */}
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        user={user}
        onSuccess={(msg) => {
          setIsResetPasswordOpen(false)
          handleClose()
          onSuccess?.(msg)
        }}
      />

      {/* Modal dedicado de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        user={user}
        onConfirm={handleConfirmDelete}
        isPending={deleteUserMutation.isPending}
        errorMessage={deleteErrorMessage}
      />
    </>
  )
}
