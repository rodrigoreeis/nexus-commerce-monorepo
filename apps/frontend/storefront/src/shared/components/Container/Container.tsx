import { ReactNode } from 'react'

export interface ContainerProps {
  children?: ReactNode
  className?: string
}

export const Container = ({ children, className = '' }: ContainerProps) => {
  const containerClasses = `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`.trim()

  return (
    <div className={containerClasses} data-testid="storefront-container">
      {children}
    </div>
  )
}
