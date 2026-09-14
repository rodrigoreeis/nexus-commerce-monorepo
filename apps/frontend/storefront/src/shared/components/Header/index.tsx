import { ShoppingBag } from 'lucide-react'
import { Container } from '@/shared/components/Container'
import styles from './styles.module.css'

export interface HeaderProps {
  cartItemCount?: number
}

export const Header = ({ cartItemCount = 0 }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <div className={styles.brandWrapper}>
            <a
              href="/"
              className={styles.brandLink}
              aria-label="Página Inicial do Nexus Commerce"
            >
              <span className={styles.brandLogo} aria-hidden="true" />
              <span className={styles.brandTitle}>
                Nexus Commerce
              </span>
            </a>
          </div>

          <div className={styles.actionsWrapper}>
            <button
              type="button"
              className={styles.cartButton}
              aria-label={`Carrinho de compras com ${cartItemCount} itens`}
            >
              <ShoppingBag className={styles.cartIcon} aria-hidden="true" />
              <span className={styles.cartLabel}>Carrinho</span>
              <span
                className={styles.cartBadge}
                aria-hidden="true"
              >
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}
