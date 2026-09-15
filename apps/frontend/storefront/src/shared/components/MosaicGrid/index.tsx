'use client'

import { ArrowUpRight } from 'lucide-react'
import styles from './styles.module.css'

export interface MosaicItem {
  id: string
  title: string
  tag: string
  imageUrl: string
  aspectRatioClass: string
  alt: string
  href?: string
}

export const defaultMosaicItems: MosaicItem[] = [
  {
    id: 'mosaic-1',
    title: 'Tecnologia & Circuitos de Próxima Geração',
    tag: 'Inovação',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-[4/5]',
    alt: 'Banner de Inovação: Tecnologia e microchips',
    href: '#produtos',
  },
  {
    id: 'mosaic-2',
    title: 'Áudio de Alta Fidelidade',
    tag: 'Acústica Pro',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-square',
    alt: 'Banner de Áudio: Fone de ouvido profissional',
    href: '#produtos',
  },
  {
    id: 'mosaic-3',
    title: 'Estação Gamer & Performance RGB',
    tag: 'Setup Gamer',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-[3/4]',
    alt: 'Banner Gamer: Setup iluminado e monitor ultrawide',
    href: '#produtos',
  },
  {
    id: 'mosaic-4',
    title: 'Smart Home & Conectividade Sem Fio',
    tag: 'Dispositivos',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-[16/10]',
    alt: 'Banner de Conectividade: Dispositivos inteligentes',
    href: '#produtos',
  },
  {
    id: 'mosaic-5',
    title: 'Ergonomia de Alta Performance',
    tag: 'Design Suíço',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-[4/5]',
    alt: 'Banner de Ergonomia: Mouse ergonômico moderno',
    href: '#produtos',
  },
  {
    id: 'mosaic-6',
    title: 'Lentes & Captura Cinematográfica',
    tag: 'Fotografia',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-[3/4]',
    alt: 'Banner de Fotografia: Câmera fotográfica profissional',
    href: '#produtos',
  },
  {
    id: 'mosaic-7',
    title: 'Minimalismo & Foco no Home Office',
    tag: 'Produtividade',
    imageUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-square',
    alt: 'Banner de Produtividade: Mesa organizada e limpa',
    href: '#produtos',
  },
  {
    id: 'mosaic-8',
    title: 'Wearables & Monitoramento Diário',
    tag: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    aspectRatioClass: 'aspect-[16/11]',
    alt: 'Banner de Estilo de Vida: Relógio inteligente minimalista',
    href: '#produtos',
  },
]

export interface MosaicGridProps {
  title?: string
  subtitle?: string
  items?: MosaicItem[]
}

export const MosaicGrid = ({
  title = 'Inspirações & Tendências',
  subtitle = 'Explore coleções exclusivas, tecnologia de ponta e ambientes inspirados para transformar seu dia a dia.',
  items = defaultMosaicItems,
}: MosaicGridProps) => {
  return (
    <section aria-label={title} className={styles.section}>
      <div className={styles.headerWrapper}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div data-testid="mosaic-grid" className={styles.gridContainer}>
        {items.map((item) => (
          <article
            key={item.id}
            data-testid={`mosaic-card-${item.id}`}
            className={`${styles.card} ${item.aspectRatioClass}`}
          >
            <img
              src={item.imageUrl}
              alt={item.alt}
              loading="lazy"
              className={styles.image}
            />
            <div className={styles.overlay}>
              <div className={styles.tagWrapper}>
                <span className={styles.tagBadge}>{item.tag}</span>
              </div>
              <div className={styles.infoWrapper}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <span className={styles.cardAction}>
                  Ver destaques
                  <ArrowUpRight className={styles.actionIcon} aria-hidden="true" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
