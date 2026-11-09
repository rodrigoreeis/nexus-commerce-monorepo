import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Portal } from '@chakra-ui/react'
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  X,
} from 'lucide-react'
import { useChangeOwnPassword } from '@/shared/hooks/useAdminUsers'
import styles from '@/pages/users/components/modal.module.css'

export interface ChangeOwnPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
}

export const ChangeOwnPasswordModal: React.FC<ChangeOwnPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const changePasswordMutation = useChangeOwnPassword()

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setFeedbackMessage(null)
    }
  }, [isOpen])

  // Auto-dismiss alert after 4 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [feedbackMessage])

  const handleClose = () => {
    if (changePasswordMutation.isPending) return
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setFeedbackMessage(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)

    if (!currentPassword) {
      setFeedbackMessage({ type: 'error', text: 'Informe sua senha atual.' })
      return
    }

    if (newPassword.length < 6) {
      setFeedbackMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setFeedbackMessage({ type: 'error', text: 'A nova senha e a confirmação não coincidem.' })
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      })
      onSuccess?.('Sua senha foi alterada com sucesso!')
      handleClose()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setFeedbackMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Falha ao alterar senha.',
      })
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open && !changePasswordMutation.isPending) {
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
                  <Dialog.Title className={styles.dialogTitle}>Alterar Minha Senha</Dialog.Title>
                  <p className={styles.dialogSubtitle}>
                    Atualize a senha de acesso da sua conta
                  </p>
                </div>
              </div>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  className={styles.dialogCloseButton}
                  onClick={handleClose}
                  aria-label="Fechar modal de alterar senha"
                  disabled={changePasswordMutation.isPending}
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.CloseTrigger>
            </div>

            <Dialog.Body padding="0" className={styles.modalBodyContainer}>
              <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="change-own-current-password">
                    Senha Atual
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="change-own-current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      placeholder="Sua senha atual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={styles.passwordInput}
                      disabled={changePasswordMutation.isPending}
                      aria-label="Sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className={styles.passwordToggleBtn}
                      aria-label={showCurrentPassword ? 'Ocultar senha atual' : 'Exibir senha atual'}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="change-own-new-password">
                    Nova Senha
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="change-own-new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      minLength={6}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.passwordInput}
                      disabled={changePasswordMutation.isPending}
                      aria-label="Nova senha desejada"
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
                  <label className={styles.fieldLabel} htmlFor="change-own-confirm-password">
                    Confirmar Nova Senha
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="change-own-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      minLength={6}
                      required
                      placeholder="Repita a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.passwordInput}
                      disabled={changePasswordMutation.isPending}
                      aria-label="Confirmar nova senha desejada"
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
                    disabled={changePasswordMutation.isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    data-testid="submit-change-own-password"
                    className={styles.btnPrimary}
                    disabled={changePasswordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {changePasswordMutation.isPending ? (
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
