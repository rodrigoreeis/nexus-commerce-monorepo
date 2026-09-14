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
              aria-label="Nexus Commerce Home"
            >
              <span className={styles.brandLogo} aria-hidden="true" />
              <span className={styles.brandTitle}>
                Nexus Commerce
              </span>
            </a>

            <nav className={styles.navigation} aria-label="Main navigation">
              <a
                href="#catalog"
                className={styles.navLink}
              >
                Catalog
              </a>
              <a
                href="#categories"
                className={styles.navLink}
              >
                Categories
              </a>
              <a
                href="#about"
                className={styles.navLink}
              >
                About
              </a>
            </nav>
          </div>

          <div className={styles.actionsWrapper}>
            <button
              type="button"
              className={styles.cartButton}
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingBag className={styles.cartIcon} aria-hidden="true" />
              <span>Cart</span>
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
