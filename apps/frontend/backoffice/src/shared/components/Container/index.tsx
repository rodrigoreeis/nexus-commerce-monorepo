import { ReactNode } from 'react'
import styles from './styles.module.css'

export interface ContainerProps {
  children?: ReactNode
  className?: string
}

export const Container = ({
  children,
  className = '',
}: ContainerProps) => {
  return (
    <div
      className={`${styles.containerRoot} ${className}`.trim()}
      data-testid="backoffice-container"
    >
      {children}
    </div>
  )
}
