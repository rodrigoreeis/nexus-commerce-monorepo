import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Portal } from '@chakra-ui/react'
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  X,
} from 'lucide-react'
import { AuthUser } from '@/shared/services/auth'
import { useResetAdminUserPassword } from '@/shared/hooks/useAdminUsers'
import styles from './modal.module.css'

export interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
  onSuccess?: (message: string) => void
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const resetPasswordMutation = useResetAdminUserPassword()

  useEffect(() => {
    if (user && isOpen) {
      setNewPassword('')
      setConfirmPassword('')
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setFeedbackMessage(null)
    }
  }, [user, isOpen])

  // Auto-dismiss alert after 4 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [feedbackMessage])

  if (!user) return null

  const handleClose = () => {
    if (resetPasswordMutation.isPending) return
    setNewPassword('')
    setConfirmPassword('')
    setFeedbackMessage(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)

    if (newPassword.length < 6) {
      setFeedbackMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setFeedbackMessage({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        id: user.id,
        newPassword,
      })
      onSuccess?.('Senha redefinida com sucesso!')
      handleClose()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setFeedbackMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Falha ao redefinir a senha.',
      })
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open && !resetPasswordMutation.isPending) {
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
                <div className={styles.headerIconWrapperAmber}>
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <Dialog.Title className={styles.dialogTitle}>Redefinir Senha</Dialog.Title>
                  <p className={styles.dialogSubtitle}>
                    Defina uma nova senha para o colaborador
                  </p>
                </div>
              </div>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  className={styles.dialogCloseButton}
                  onClick={handleClose}
                  aria-label="Fechar modal de redefinir senha"
                  disabled={resetPasswordMutation.isPending}
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.CloseTrigger>
            </div>

            <Dialog.Body padding="0" className={styles.modalBodyContainer}>
              {/* User summary card */}
              <div className={styles.userRoleCard}>
                <div>
                  <div className={styles.userCardLabel}>Colaborador:</div>
                  <div className={styles.userCardName} title={user.name}>
                    {user.name}
                  </div>
                  <div className={styles.userCardEmail} title={user.email}>
                    {user.email}
                  </div>
                </div>
                <span className={styles.userRoleBadge}>
                  {user.role}
                </span>
              </div>

              <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="modal-new-password">
                    Nova Senha
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="modal-new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      minLength={6}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.passwordInput}
                      disabled={resetPasswordMutation.isPending}
                      aria-label="Nova senha para o usuário"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className={styles.passwordToggleBtn}
                      aria-label={showNewPassword ? 'Ocultar nova senha' : 'Exibir nova senha'}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="modal-confirm-password">
                    Confirmar Nova Senha
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="modal-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      minLength={6}
                      required
                      placeholder="Repita a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.passwordInput}
                      disabled={resetPasswordMutation.isPending}
                      aria-label="Confirmar nova senha para o usuário"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className={styles.passwordToggleBtn}
                      aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Exibir confirmação de senha'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handleClose}
                    disabled={resetPasswordMutation.isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    data-testid="confirm-reset-password-btn"
                    className={styles.btnPrimary}
                    disabled={resetPasswordMutation.isPending || !newPassword || !confirmPassword}
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        <span>Salvar Nova Senha</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>

      {/* Alert do Chakra UI: position fixed no topo da tela centralizado com CSS Module */}
      {feedbackMessage && (
        <Portal>
          <div className={styles.topAlertContainer}>
            <Alert.Root
              status={feedbackMessage.type === 'error' ? 'error' : 'success'}
              variant="subtle"
              className={styles.topAlertBox}
            >
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title fontWeight="600">{feedbackMessage.text}</Alert.Title>
              </Alert.Content>
            </Alert.Root>
          </div>
        </Portal>
      )}
    </Dialog.Root>
  )
}
