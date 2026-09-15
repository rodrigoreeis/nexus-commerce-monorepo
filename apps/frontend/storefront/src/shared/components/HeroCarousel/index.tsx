'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './styles.module.css'

export interface HeroSlide {
  id: string
  imageUrl: string
  alt: string
  href?: string
  title?: string
}

export const defaultSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&h=500&q=80',
    alt: 'Banner Promocional: Tecnologia e Equipamentos de Alta Performance',
    href: '#produtos',
  },
  {
    id: 'slide-2',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&h=500&q=80',
    alt: 'Banner Promocional: Lançamentos da Temporada com Frete Grátis',
    href: '#produtos',
  },
  {
    id: 'slide-3',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&h=500&q=80',
    alt: 'Banner Promocional: Acessórios com Desconto e Condições Especiais',
    href: '#produtos',
  },
]

export interface HeroCarouselProps {
  slides?: HeroSlide[]
  autoplayInterval?: number
}

export const HeroCarousel = ({
  slides = defaultSlides,
  autoplayInterval = 5000,
}: HeroCarouselProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const totalSlides = slides.length

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides)
  }, [totalSlides])

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index)
  }

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return

    const timer = setInterval(() => {
      handleNextSlide()
    }, autoplayInterval)

    return () => clearInterval(timer)
  }, [isPaused, totalSlides, autoplayInterval, handleNextSlide])

  if (totalSlides === 0) {
    return null
  }

  return (
    <section
      className={styles.carouselWrapper}
      aria-roledescription="carousel"
      aria-label="Banners promocionais do Nexus Storefront"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={styles.carouselContainer}>
        {/* Fixed height viewport prevents layout shift */}
        <div className={styles.slideViewport}>
          {totalSlides > 1 && (
            <button
              type="button"
              className={styles.navArrowPrev}
              onClick={handlePrevSlide}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          <div className={styles.slideTrack}>
            {slides.map((slide, index) => {
              const isCurrent = index === currentSlideIndex

              const content = (
                <img
                  src={slide.imageUrl}
                  alt={slide.alt}
                  width={1600}
                  height={440}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={styles.slideImage}
                />
              )

              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${totalSlides}: ${slide.alt}`}
                  aria-hidden={!isCurrent}
                  className={`${styles.slideItem} ${isCurrent ? styles.slideVisible : styles.slideHidden}`}
                >
                  {slide.href ? (
                    <a
                      href={slide.href}
                      className={styles.slideLink}
                      tabIndex={isCurrent ? 0 : -1}
                      aria-label={slide.alt}
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </div>
              )
            })}
          </div>

          {totalSlides > 1 && (
            <button
              type="button"
              className={styles.navArrowNext}
              onClick={handleNextSlide}
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          {totalSlides > 1 && (
            <div className={styles.dotsWrapper} role="tablist" aria-label="Indicadores dos banners">
              {slides.map((slide, index) => {
                const isActive = index === currentSlideIndex
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Ir para banner ${index + 1}`}
                    className={`${styles.dotButton} ${isActive ? styles.dotActive : styles.dotInactive}`}
                    onClick={() => handleSelectSlide(index)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
