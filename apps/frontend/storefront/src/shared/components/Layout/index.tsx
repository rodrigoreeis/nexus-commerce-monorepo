import { ReactNode } from 'react'
import { Header } from '@/shared/components/Header'
import { Container } from '@/shared/components/Container'
import styles from './styles.module.css'

export interface LayoutProps {
  children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layoutRoot}>
      <Header />
      <main className={styles.mainContent}>
        <Container>
          {children}
        </Container>
      </main>
      <footer className={styles.footer}>
        <Container>
          <p>© 2026 Nexus Commerce. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  )
}
