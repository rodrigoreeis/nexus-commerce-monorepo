import React from 'react'
import { Alert, Dialog, Portal } from '@chakra-ui/react'
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react'
import { AuthUser } from '@/shared/services/auth'
import styles from './modal.module.css'

export interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
  onConfirm: () => Promise<void>
  isPending: boolean
  errorMessage?: string | null
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isPending,
  errorMessage,
}) => {
  if (!user) return null

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open && !isPending) {
          onClose()
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
          zIndex={1500}
        />
        <Dialog.Positioner
          position="fixed"
          inset="0"
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="2rem 1rem"
          zIndex={1500}
        >
          <Dialog.Content
            width="100%"
            maxWidth="32rem"
            backgroundColor="var(--bg-surface)"
            borderRadius="1.5rem"
            border="1px solid var(--border-app)"
            padding="2rem"
            color="var(--text-primary)"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.55)"
          >
            <div className={styles.dialogHeaderBar}>
              <div className={styles.dialogHeaderTitleWrapper}>
                <div className={styles.headerIconWrapperRed}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <Dialog.Title className={styles.dialogTitle}>Excluir Usuário</Dialog.Title>
                  <p className={styles.dialogSubtitle}>Confirmação de exclusão definitiva</p>
                </div>
              </div>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  className={styles.dialogCloseButton}
                  onClick={onClose}
                  aria-label="Fechar"
                  disabled={isPending}
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.CloseTrigger>
            </div>

            <Dialog.Body padding="0" className={styles.modalBodyContainer}>
              <div className={styles.dangerCard}>
                <p className={styles.dangerAlertText}>
                  Você realmente deseja excluir o usuário <strong>{user.name}</strong>?
                </p>
                <p className={styles.dangerWarningText}>
                  Essa ação não pode ser desfeita!
                </p>
              </div>

              <div className={styles.userCard}>
                <div className="min-w-0">
                  <div className={styles.userCardLabel}>Dados da conta:</div>
                  <div className={styles.userCardName}>{user.name}</div>
                  <div className={styles.userCardEmail}>{user.email}</div>
                </div>
                <span className={styles.userRoleBadge}>
                  {user.role}
                </span>
              </div>

              <div className={styles.actionButtons}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  data-testid="confirm-delete-btn"
                  aria-label="Sim, Excluir Usuário"
                  className={styles.btnDanger}
                  onClick={onConfirm}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Excluindo...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Sim, Excluir Usuário</span>
                    </>
                  )}
                </button>
              </div>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>

      {/* Alert do Chakra UI: position fixed no topo da tela centralizado com CSS Module */}
      {errorMessage && (
        <Portal>
          <div className={styles.topAlertContainer}>
            <Alert.Root
              status="error"
              variant="subtle"
              className={styles.topAlertBox}
            >
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title fontWeight="600">{errorMessage}</Alert.Title>
              </Alert.Content>
            </Alert.Root>
          </div>
        </Portal>
      )}
    </Dialog.Root>
  )
}
