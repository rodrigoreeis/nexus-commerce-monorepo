import { ReactNode } from 'react'
import { Header } from '@/shared/components/Header'
import { Container } from '@/shared/components/Container'
import { CartDrawer } from '@/shared/components/CartDrawer'
import { useCartUI } from '@/shared/contexts/CartContext'
import styles from './styles.module.css'

export interface LayoutProps {
  children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const { isCartOpen, closeCart } = useCartUI()

  return (
    <div className={styles.layoutRoot}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <footer className={styles.footer}>
        <Container>
          <p>© 2026 Nexus Storefront. Todos os direitos reservados.</p>
        </Container>
      </footer>
    </div>
  )
}
