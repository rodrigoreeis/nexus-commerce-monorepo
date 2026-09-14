import { Truck, CreditCard, Percent, ShieldCheck } from 'lucide-react'
import styles from './styles.module.css'

export interface HighlightItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  variant: 'blue' | 'emerald' | 'indigo' | 'amber'
}

export const defaultHighlights: HighlightItem[] = [
  {
    id: 'free-shipping',
    title: 'Frete Grátis Brasil',
    description: 'Em compras acima de R$ 199',
    icon: Truck,
    variant: 'blue',
  },
  {
    id: 'installments',
    title: 'Até 10x Sem Juros',
    description: 'Parcelamento facilitado no cartão',
    icon: CreditCard,
    variant: 'indigo',
  },
  {
    id: 'pix-discount',
    title: '5% OFF no Pix',
    description: 'Desconto imediato no checkout',
    icon: Percent,
    variant: 'emerald',
  },
  {
    id: 'easy-exchange',
    title: 'Garantia & Troca Fácil',
    description: 'Até 30 dias para devolução grátis',
    icon: ShieldCheck,
    variant: 'amber',
  },
]

export interface HighlightCardsProps {
  items?: HighlightItem[]
}

const variantStyles: Record<HighlightItem['variant'], string> = {
  blue: styles.iconWrapperBlue,
  indigo: styles.iconWrapperIndigo,
  emerald: styles.iconWrapperEmerald,
  amber: styles.iconWrapperAmber,
}

export const HighlightCards = ({ items = defaultHighlights }: HighlightCardsProps) => {
  return (
    <section aria-label="Vantagens de comprar no Nexus Commerce">
      <div className={styles.highlightGrid}>
        {items.map((item) => {
          const Icon = item.icon
          const iconVariantClass = variantStyles[item.variant] || styles.iconWrapperBlue

          return (
            <div
              key={item.id}
              data-testid={`highlight-card-${item.id}`}
              className={styles.card}
            >
              <div className={`${styles.iconWrapper} ${iconVariantClass}`}>
                <Icon className={styles.icon} aria-hidden="true" />
              </div>

              <div className={styles.contentWrapper}>
                <h3 className={styles.title}>
                  {item.title}
                </h3>
                <p className={styles.description}>
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
