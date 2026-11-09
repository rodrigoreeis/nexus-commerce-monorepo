import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Portal } from '@chakra-ui/react'
import {
  KeyRound,
  Loader2,
  Save,
  Settings,
  X,
} from 'lucide-react'
import { useAuth } from '@/shared/context/AuthContext'
import { useUpdateOwnProfile } from '@/shared/hooks/useAdminUsers'
import { ChangeOwnPasswordModal } from './ChangeOwnPasswordModal'
import styles from '@/pages/users/components/modal.module.css'

export interface AccountSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  let user: any = null
  let updateCurrentUser: (u: any, t?: string) => void = () => {}

  try {
    const auth = useAuth()
    user = auth.user
    updateCurrentUser = auth.updateCurrentUser
  } catch {
    // Outside of AuthProvider in isolated test environments
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const updateProfileMutation = useUpdateOwnProfile()

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '')
      setEmail(user.email || '')
      setIsChangePasswordOpen(false)
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

  const handleClose = () => {
    setIsChangePasswordOpen(false)
    setFeedbackMessage(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)

    if (!name.trim()) {
      setFeedbackMessage({ type: 'error', text: 'O nome não pode ficar vazio.' })
      return
    }

    if (!email.trim()) {
      setFeedbackMessage({ type: 'error', text: 'O e-mail não pode ficar vazio.' })
      return
    }

    try {
      const result = await updateProfileMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      })

      updateCurrentUser(result.user, result.token)
      onSuccess?.('Perfil atualizado com sucesso!')
      handleClose()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setFeedbackMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Falha ao atualizar perfil.',
      })
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
              width="100%"
              maxWidth="34rem"
              backgroundColor="var(--bg-surface)"
              borderRadius="1.5rem"
              border="1px solid var(--border-app)"
              padding="2rem"
              color="var(--text-primary)"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.55)"
            >
              <Dialog.Header padding="0" marginBottom="1.5rem">
                <div className={styles.dialogHeaderBar}>
                  <div className={styles.dialogHeaderTitleWrapper}>
                    <div className={styles.headerIconWrapper}>
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <Dialog.Title className={styles.dialogTitle}>Minha Conta</Dialog.Title>
                      <p className={styles.dialogSubtitle}>Gerencie suas informações e credenciais de acesso.</p>
                    </div>
                  </div>
                  <Dialog.CloseTrigger asChild>
                    <button
                      type="button"
                      className={styles.dialogCloseButton}
                      onClick={handleClose}
                      aria-label="Fechar"
                      disabled={updateProfileMutation.isPending}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.CloseTrigger>
                </div>
              </Dialog.Header>

              <Dialog.Body padding="0" className={styles.modalBodyContainer}>
                {user && (
                  <div className={styles.userRoleCard}>
                    <div>
                      <div className={styles.userCardLabel}>Função Atual:</div>
                      <div className={styles.userCardName}>
                        {user.role}
                      </div>
                    </div>
                    <span className={styles.userRoleBadge}>
                      {user.role}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.formContainer}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="account-name">
                      Nome Completo
                    </label>
                    <input
                      id="account-name"
                      type="text"
                      required
                      className={styles.textInput}
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={updateProfileMutation.isPending}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="account-email">
                      E-mail
                    </label>
                    <input
                      id="account-email"
                      type="email"
                      required
                      className={styles.textInput}
                      placeholder="seu.email@nexuscommerce.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={updateProfileMutation.isPending}
                    />
                  </div>

                  {/* Botão sólido para Alterar Senha */}
                  <div className={styles.pt2}>
                    <button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(true)}
                      className={styles.fullWidthWarningButton}
                      aria-label="Alterar Minha Senha"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>Alterar Minha Senha</span>
                    </button>
                  </div>

                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={handleClose}
                      disabled={updateProfileMutation.isPending}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Salvar Alterações</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

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

      {/* Modal dedicado para alterar a própria senha */}
      <ChangeOwnPasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={(msg) => {
          setIsChangePasswordOpen(false)
          handleClose()
          onSuccess?.(msg)
        }}
      />
    </>
  )
}
