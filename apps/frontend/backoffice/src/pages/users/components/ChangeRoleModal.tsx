import React, { useState, useEffect } from 'react'
import { Dialog, Portal } from '@chakra-ui/react'
import { AlertCircle, CheckCircle2, Loader2, ShieldAlert, X } from 'lucide-react'
import { AuthUser, UserRole } from '@/shared/services/auth'
import { useUpdateAdminUserRole } from '@/shared/hooks/useAdminUsers'
import styles from './modal.module.css'

export interface ChangeRoleModalProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
  currentUserId?: string
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  currentUserId,
}) => {
  const [role, setRole] = useState<UserRole>('user')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { mutateAsync: updateRole, isPending } = useUpdateAdminUserRole()

  useEffect(() => {
    if (user) {
      setRole(user.role)
      setErrorMessage(null)
      setSuccessMessage(null)
    }
  }, [user])

  const isSelf = user?.id === currentUserId

  const handleClose = () => {
    if (isPending) return
    setErrorMessage(null)
    setSuccessMessage(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!user) return

    if (isSelf) {
      setErrorMessage('Você não pode alterar sua própria função.')
      return
    }

    try {
      await updateRole({
        id: user.id,
        role,
      })
      setSuccessMessage('Função atualizada com sucesso!')
      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setErrorMessage(error.response?.data?.message || 'Falha ao alterar função.')
    }
  }

  return (
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
          backgroundColor="rgba(0, 0, 0, 0.65)"
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
          padding="1.5rem"
          zIndex={1400}
        >
          <Dialog.Content
            backgroundColor="var(--bg-surface)"
            border="1px solid var(--border-app)"
            borderRadius="1rem"
            padding="1.5rem"
            maxWidth="28rem"
            width="100%"
            color="var(--text-primary)"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.45)"
          >
            <Dialog.Header padding="0" marginBottom="1rem">
              <div className={styles.dialogHeaderBar}>
                <div className="flex items-center gap-3">
                  <div className={styles.headerIconWrapperPurple}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <Dialog.Title className={styles.dialogTitle}>
                      Alterar Função
                    </Dialog.Title>
                    <p className={styles.dialogSubtitle}>Modifique o nível de permissão de acesso</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Fechar diálogo de alteração de função"
                  className={styles.dialogCloseButton}
                  disabled={isPending}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </Dialog.Header>

            <Dialog.Body padding="0">
              {errorMessage && (
                <div className={styles.errorBox} role="alert">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className={styles.successBox} role="status">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {user && (
                <div className={styles.userCard}>
                  <p className={styles.userCardLabel}>Usuário selecionado:</p>
                  <p className={styles.userCardName}>{user.name}</p>
                  <p className={styles.userCardEmail}>{user.email}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.formRoot}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="select-new-role">
                    Nova Função (Role)
                  </label>
                  <select
                    id="select-new-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className={styles.selectInput}
                    disabled={isPending || isSelf}
                  >
                    <option value="user">Operador (user) - Acesso ao catálogo</option>
                    <option value="manager">Gerente (manager) - Gestão de catálogo e operadores</option>
                    <option value="admin">Administrador (admin) - Acesso irrestrito</option>
                  </select>
                  {isSelf && (
                    <p className={styles.helperText}>
                      Atenção: Usuários não podem alterar a função da sua própria conta.
                    </p>
                  )}
                </div>

                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={styles.cancelButton}
                    disabled={isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButtonPurple}
                    disabled={isPending || isSelf}
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <span>Salvar Alteração</span>
                    )}
                  </button>
                </div>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
