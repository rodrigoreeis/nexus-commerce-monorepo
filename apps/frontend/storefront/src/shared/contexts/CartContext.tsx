import { createContext, useContext, useState, ReactNode } from 'react'

export interface CartContextType {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen((prev) => !prev)

  return (
    <CartContext.Provider value={{ isCartOpen, openCart, closeCart, toggleCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartUI = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    return {
      isCartOpen: false,
      openCart: () => {},
      closeCart: () => {},
      toggleCart: () => {},
    }
  }
  return context
}
