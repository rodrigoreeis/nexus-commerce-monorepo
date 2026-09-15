'use client'

import styles from './styles.module.css'

export interface MosaicItem {
  id: string
  title: string
  imageUrl: string
  alt: string
  href?: string
}

export const defaultMosaicItems: MosaicItem[] = [
  {
    id: 'mosaic-1',
    title: 'Inovação & Tecnologia de Ponta',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    alt: 'Banner de Inovação e Tecnologia',
    href: '#produtos',
  },
  {
    id: 'mosaic-2',
    title: 'Áudio Espacial de Alta Fidelidade',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    alt: 'Banner de Áudio Espacial',
    href: '#produtos',
  },
  {
    id: 'mosaic-3',
    title: 'Estação Gamer & Performance',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    alt: 'Banner de Estação Gamer',
    href: '#produtos',
  },
  {
    id: 'mosaic-4',
    title: 'Smart Home & Conectividade Sem Fio',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    alt: 'Banner de Conectividade Inteligente',
    href: '#produtos',
  },
  {
    id: 'mosaic-5',
    title: 'Ergonomia de Alta Performance',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    alt: 'Banner de Ergonomia Moderna',
    href: '#produtos',
  },
  {
    id: 'mosaic-6',
    title: 'Lentes & Captura Cinematográfica',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    alt: 'Banner de Fotografia Profissional',
    href: '#produtos',
  },
]

export interface MosaicGridProps {
  title?: string
  subtitle?: string
  items?: MosaicItem[]
}

const columnCardStyles = [
  [styles.col1Top, styles.col1Bottom],
  [styles.col2Top, styles.col2Bottom],
  [styles.col3Top, styles.col3Bottom],
]

export const MosaicGrid = ({
  title = 'Inspirações & Tendências',
  subtitle = 'Explore coleções exclusivas, tecnologia de ponta e ambientes inspirados para transformar seu dia a dia.',
  items = defaultMosaicItems,
}: MosaicGridProps) => {
  // Distribute items across 3 columns
  const columns: MosaicItem[][] = [[], [], []]
  items.forEach((item, index) => {
    columns[index % 3].push(item)
  })

  return (
    <section aria-label={title} className={styles.section}>
      <div className={styles.headerWrapper}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div data-testid="mosaic-grid" className={styles.gridContainer}>
        {columns.map((columnItems, colIdx) => (
          <div key={colIdx} className={styles.column}>
            {columnItems.map((item, rowIdx) => {
              const cardClass = columnCardStyles[colIdx]?.[rowIdx] || ''
              return (
                <article
                  key={item.id}
                  data-testid={`mosaic-card-${item.id}`}
                  className={`${styles.card} ${cardClass}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.alt}
                    loading="lazy"
                    className={styles.image}
                  />
                  <div className={styles.overlay}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                  </div>
                </article>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
