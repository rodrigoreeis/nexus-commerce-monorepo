import React, { useState } from 'react'
import { Dialog, Portal, Select, createListCollection } from '@chakra-ui/react'
import { AlertCircle, CheckCircle2, Loader2, UserPlus, X } from 'lucide-react'
import { UserRole } from '@/shared/services/auth'
import { useCreateAdminUser } from '@/shared/hooks/useAdminUsers'
import styles from './modal.module.css'

const createRoleCollection = createListCollection({
  items: [
    { value: 'user', label: 'Operador (user) - Acesso ao catálogo' },
    { value: 'manager', label: 'Gerente (manager) - Gestão de catálogo e operadores' },
    { value: 'admin', label: 'Administrador (admin) - Acesso irrestrito' },
  ],
})

const managerRoleCollection = createListCollection({
  items: [
    { value: 'user', label: 'Operador (user)' },
  ],
})

export interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserRole: UserRole
  onSuccess?: (message: string) => void
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onSuccess,
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
      onSuccess?.('Usuário criado com sucesso!')
      handleClose()
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
                <div className={styles.dialogHeaderTitleWrapper}>
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
                  {isManager ? (
                    <div>
                      <Select.Root
                        collection={managerRoleCollection}
                        value={['user']}
                        disabled
                        size="md"
                        width="100%"
                      >
                        <Select.HiddenSelect id="create-role" aria-label="Função (Role)" />
                        <Select.Label className={styles.fieldLabel}>
                          Função (Role)
                        </Select.Label>
                        <Select.Control>
                          <Select.Trigger className={`${styles.chakraSelectTrigger} ${styles.selectDisabled}`}>
                            <Select.ValueText placeholder="Operador (user)" />
                          </Select.Trigger>
                        </Select.Control>
                      </Select.Root>
                      <p className={styles.helperText}>
                        Gerentes só têm permissão para criar usuários de perfil operador (user).
                      </p>
                    </div>
                  ) : (
                    <Select.Root
                      collection={createRoleCollection}
                      value={[role]}
                      onValueChange={(details) => {
                        if (details.value[0]) {
                          setRole(details.value[0] as UserRole)
                        }
                      }}
                      disabled={isPending}
                      size="md"
                      width="100%"
                    >
                      <Select.HiddenSelect id="create-role" aria-label="Função (Role)" />
                      <Select.Label className={styles.fieldLabel}>
                        Função (Role)
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
                          {createRoleCollection.items.map((r) => (
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
                  )}
                </div>

                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={styles.btnSecondary}
                    disabled={isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Cadastrando...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Criar Usuário</span>
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
  )
}
