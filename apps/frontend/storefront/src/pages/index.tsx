import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Sparkles } from 'lucide-react'
import { Layout } from '@/shared/components/Layout'
import { ProductGrid } from '@/shared/components/ProductGrid'
import { useStoreProducts } from '@/shared/hooks/useStoreProducts'
import { getStoreProducts, type Product } from '@/shared/services/catalog'
import styles from './index.module.css'

export interface HomePageProps {
  products: Product[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const products = await getStoreProducts()
  return {
    props: {
      products,
    },
  }
}

export const HomePage = ({ products: initialProducts = [] }: HomePageProps) => {
  const { data: products = initialProducts, isLoading, error } = useStoreProducts(initialProducts)

  const isErrorInstance = error instanceof Error
  const hasGenericError = Boolean(error)
  const errorMessage = isErrorInstance
    ? error.message
    : hasGenericError
      ? 'Failed to fetch catalog products'
      : null

  return (
    <>
      <Head>
        <title>Nexus Commerce</title>
        <meta name="description" content="Next-generation modular commerce storefront" />
      </Head>
      <Layout>
        {/* Hero Section */}
        <div className={styles.heroWrapper}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Release 0 Live Platform
          </div>

          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.heroTitleAccent}>Nexus Commerce</span>
          </h1>

          <p className={styles.heroDescription}>
            The next-generation modular e-commerce experience. Explore our high-performance catalog.
          </p>

          <div className={styles.heroActions}>
            <a
              href="#catalog"
              className={styles.primaryButton}
            >
              Explore Catalog
            </a>
            <a
              href="#catalog"
              className={styles.secondaryButton}
            >
              View Categories <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Catalog Section */}
        <section
          id="catalog"
          className={styles.catalogSection}
        >
          <div className={styles.catalogHeader}>
            <div className={styles.catalogBadge}>
              <Sparkles className={styles.catalogBadgeIcon} aria-hidden="true" />
              Curated Catalog
            </div>
            <h2 className={styles.catalogTitle}>
              Featured Products
            </h2>
            <p className={styles.catalogSubtitle}>
              Discover our collection of premium gear and accessories, delivered with maximum performance.
            </p>
          </div>

          <ProductGrid products={products} isLoading={isLoading} error={errorMessage} />
        </section>
      </Layout>
    </>
  )
}

export default HomePage
