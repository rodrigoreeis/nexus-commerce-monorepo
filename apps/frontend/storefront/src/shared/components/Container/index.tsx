import { ReactNode } from 'react'
import styles from './styles.module.css'

export interface ContainerProps {
  children?: ReactNode
  className?: string
}

export const Container = ({ children, className = '' }: ContainerProps) => {
  const containerClasses = `${styles.containerRoot} ${className}`.trim()

  return (
    <div className={containerClasses} data-testid="storefront-container">
      {children}
    </div>
  )
}
