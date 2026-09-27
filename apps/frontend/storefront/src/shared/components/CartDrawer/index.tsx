'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from '@/shared/hooks/useCart'
import { formatStorePrice } from '@/shared/utils/format'
import styles from './styles.module.css'

export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const router = useRouter()
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)
  const { data: cart, isLoading } = useCart()
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartItem()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem()
  const { mutate: clearCart, isPending: isClearing } = useClearCart()

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setIsConfirmingClear(false)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const items = cart?.items || []
  const hasItems = items.length > 0
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const isActionPending = isUpdating || isRemoving || isClearing

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity({ itemId, quantity: newQuantity })
    }
  }

  const handleExploreProducts = () => {
    onClose()
    if (router.pathname === '/') {
      const el = document.getElementById('produtos')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push('/#produtos')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        data-testid="cart-drawer-backdrop"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        className={styles.drawer}
        data-testid="cart-drawer"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingBag size={20} aria-hidden="true" />
            <span>Seu Carrinho</span>
            {hasItems && (
              <span className={styles.itemBadge} aria-label={`${totalItemCount} itens no carrinho`}>
                {totalItemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar carrinho"
            className={styles.closeBtn}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {!hasItems && !isLoading ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={56} className={styles.emptyIcon} aria-hidden="true" />
              <h3 className={styles.emptyTitle}>Seu carrinho está vazio</h3>
              <p className={styles.emptySubtitle}>
                Explore nosso catálogo e adicione produtos incríveis à sua cesta de compras.
              </p>
              <button
                type="button"
                onClick={handleExploreProducts}
                className={styles.exploreBtn}
              >
                <span>Explorar Produtos</span>
                <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  {/* Image */}
                  <div className={styles.itemImageWrapper}>
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className={styles.itemImage}
                      />
                    ) : (
                      <Package size={24} className={styles.itemFallbackImage} aria-hidden="true" />
                    )}
                  </div>

                  {/* Details */}
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemName} title={item.product.name}>
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={isActionPending}
                        aria-label={`Remover ${item.product.name} do carrinho`}
                        className={styles.removeBtn}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>

                    <p className={styles.itemPrice}>
                      {formatStorePrice(item.product.price)} un.
                    </p>

                    <div className={styles.itemFooter}>
                      {/* Quantity Controls */}
                      <div className={styles.quantityGroup}>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isActionPending}
                          aria-label={`Diminuir quantidade de ${item.product.name}`}
                          className={styles.qtyBtn}
                        >
                          <Minus size={12} aria-hidden="true" />
                        </button>
                        <span className={styles.qtyValue}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isActionPending || item.quantity >= 99}
                          aria-label={`Aumentar quantidade de ${item.product.name}`}
                          className={styles.qtyBtn}
                        >
                          <Plus size={12} aria-hidden="true" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className={styles.itemSubtotal}>
                        {formatStorePrice(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasItems && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span className={styles.subtotalValue}>
                {formatStorePrice(cart?.subtotal || 0)}
              </span>
            </div>

            <p className={styles.shippingNote}>
              Frete e opções de pagamento calculados na etapa seguinte.
            </p>

            <button
              type="button"
              className={styles.checkoutBtn}
              aria-label="Finalizar compra"
            >
              <span>Finalizar Compra</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className={styles.continueBtn}
            >
              Continuar Comprando
            </button>

            <div className={styles.footerSecondaryActions}>
              {isConfirmingClear ? (
                <div className={styles.confirmClearGroup} role="alert">
                  <span className={styles.confirmClearPrompt}>Esvaziar toda a sacola?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart(undefined, {
                        onSettled: () => setIsConfirmingClear(false),
                      })
                    }}
                    disabled={isClearing}
                    aria-label="Confirmar esvaziamento do carrinho"
                    className={styles.confirmYesBtn}
                  >
                    Sim, esvaziar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClear(false)}
                    disabled={isClearing}
                    aria-label="Cancelar esvaziamento"
                    className={styles.confirmNoBtn}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingClear(true)}
                  disabled={isActionPending}
                  aria-label="Esvaziar carrinho"
                  className={styles.clearCartBtn}
                >
                  <Trash2 size={13} aria-hidden="true" />
                  <span>Esvaziar sacola</span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
