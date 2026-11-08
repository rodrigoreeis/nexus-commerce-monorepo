import React, { useState } from 'react'
import { Dialog, Portal } from '@chakra-ui/react'
import { AlertCircle, CheckCircle2, Loader2, UserPlus, X } from 'lucide-react'
import { UserRole } from '@/shared/services/auth'
import { useCreateAdminUser } from '@/shared/hooks/useAdminUsers'
import styles from './modal.module.css'

export interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserRole: UserRole
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('user')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { mutateAsync: createUser, isPending } = useCreateAdminUser()

  const handleClose = () => {
    if (isPending) return
    setName('')
    setEmail('')
    setPassword('')
    setRole('user')
    setErrorMessage(null)
    setSuccessMessage(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!name || !email || !password) {
      setErrorMessage('Todos os campos são obrigatórios.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    const assignedRole: UserRole = currentUserRole === 'manager' ? 'user' : role

    try {
      await createUser({
        name,
        email,
        password,
        role: assignedRole,
      })
      setSuccessMessage('Usuário criado com sucesso!')
      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setErrorMessage(error.response?.data?.message || 'Falha ao criar usuário.')
    }
  }

  const isManager = currentUserRole === 'manager'

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
            maxWidth="32rem"
            width="100%"
            color="var(--text-primary)"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.45)"
          >
            <Dialog.Header padding="0" marginBottom="1rem">
              <div className={styles.dialogHeaderBar}>
                <div className="flex items-center gap-3">
                  <div className={styles.headerIconWrapper}>
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <Dialog.Title className={styles.dialogTitle}>
                      Novo Usuário
                    </Dialog.Title>
                    <p className={styles.dialogSubtitle}>Cadastre um novo colaborador no Backoffice</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Fechar diálogo de cadastro de usuário"
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

              <form onSubmit={handleSubmit} className={styles.formRoot}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="create-name">
                    Nome Completo
                  </label>
                  <input
                    id="create-name"
                    type="text"
                    required
                    className={styles.textInput}
                    placeholder="ex: João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="create-email">
                    E-mail
                  </label>
                  <input
                    id="create-email"
                    type="email"
                    required
                    className={styles.textInput}
                    placeholder="ex: joao@nexuscommerce.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="create-password">
                    Senha Provisória
                  </label>
                  <input
                    id="create-password"
                    type="password"
                    required
                    minLength={6}
                    className={styles.textInput}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="create-role">
                    Função (Role)
                  </label>
                  {isManager ? (
                    <div>
                      <select
                        id="create-role"
                        disabled
                        value="user"
                        className={`${styles.selectInput} ${styles.selectDisabled}`}
                      >
                        <option value="user">Operador (user)</option>
                      </select>
                      <p className={styles.helperText}>
                        Gerentes só têm permissão para criar usuários de perfil operador (user).
                      </p>
                    </div>
                  ) : (
                    <select
                      id="create-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className={styles.selectInput}
                      disabled={isPending}
                    >
                      <option value="user">Operador (user) - Acesso ao catálogo</option>
                      <option value="manager">Gerente (manager) - Gestão de catálogo e operadores</option>
                      <option value="admin">Administrador (admin) - Acesso irrestrito</option>
                    </select>
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
                    className={styles.submitButton}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Cadastrando...</span>
                      </>
                    ) : (
                      <span>Criar Usuário</span>
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
