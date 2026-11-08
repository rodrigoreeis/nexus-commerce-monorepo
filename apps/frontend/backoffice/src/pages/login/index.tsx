import React, { useState } from 'react'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/shared/context/AuthContext'
import styles from './styles.module.css'

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.')
      return
    }

    try {
      await login({ email, password })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      const message = error.response?.data?.message || 'E-mail ou senha incorretos. Tente novamente.'
      setErrorMessage(message)
    }
  }

  const fillDevCredentials = () => {
    setEmail('admin@nexuscommerce.com')
    setPassword('admin123')
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className={styles.brandTitle}>Nexus Commerce</h1>
          <p className={styles.brandSubtitle}>Painel Administrativo & Controle de Acesso</p>
        </div>

        {errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              E-mail
            </label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                required
                className={styles.inputField}
                placeholder="seu.email@nexuscommerce.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className={styles.inputFieldWithAction}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar no Backoffice</span>
            )}
          </button>
        </form>

        <div className={styles.devHintCard}>
          <div className={styles.devHintTitle}>
            <span>Acesso Rápido (Desenvolvimento):</span>
          </div>
          <button
            type="button"
            className={styles.devHintCode}
            onClick={fillDevCredentials}
            title="Clique para preencher as credenciais"
          >
            <span>admin@nexuscommerce.com / admin123</span>
            <span className="text-[10px] text-blue-300 ml-2">Preencher</span>
          </button>
        </div>
      </div>
    </div>
  )
}
