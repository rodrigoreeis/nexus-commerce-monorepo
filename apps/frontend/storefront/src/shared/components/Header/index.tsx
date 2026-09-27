import { ShoppingBag } from 'lucide-react'
import { Container } from '@/shared/components/Container'
import { useCart } from '@/shared/hooks/useCart'
import { useCartUI } from '@/shared/contexts/CartContext'
import styles from './styles.module.css'

export interface HeaderProps {
  cartItemCount?: number
  onOpenCart?: () => void
}

export const Header = ({ cartItemCount, onOpenCart }: HeaderProps) => {
  const { data: cart } = useCart()
  const { openCart } = useCartUI()

  const liveCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const totalCount = cartItemCount !== undefined ? cartItemCount : liveCount

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart()
    } else {
      openCart()
    }
  }

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <div className={styles.brandWrapper}>
            <a
              href="/"
              className={styles.brandLink}
              aria-label="Página Inicial do Nexus Storefront"
            >
              <span className={styles.brandLogo} aria-hidden="true" />
              <span className={styles.brandTitle}>
                Nexus Storefront
              </span>
            </a>
          </div>

          <div className={styles.actionsWrapper}>
            <button
              type="button"
              onClick={handleCartClick}
              className={styles.cartButton}
              aria-label={`Carrinho de compras com ${totalCount} itens`}
            >
              <ShoppingBag className={styles.cartIcon} aria-hidden="true" />
              <span className={styles.cartLabel}>Carrinho</span>
              <span
                className={styles.cartBadge}
                aria-hidden="true"
              >
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}

