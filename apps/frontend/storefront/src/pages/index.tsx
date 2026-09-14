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
      ? 'Falha ao carregar produtos do catálogo'
      : null

  return (
    <>
      <Head>
        <title>Nexus Commerce</title>
        <meta name="description" content="A experiência de e-commerce modular de última geração" />
      </Head>
      <Layout>
        {/* Hero Section */}
        <div className={styles.heroWrapper}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Plataforma Live Release 0
          </div>

          <h1 className={styles.heroTitle}>
            Bem-vindo ao <span className={styles.heroTitleAccent}>Nexus Commerce</span>
          </h1>

          <p className={styles.heroDescription}>
            A experiência de e-commerce modular de última geração. Explore nosso catálogo de alta performance.
          </p>

          <div className={styles.heroActions}>
            <a
              href="#catalog"
              className={styles.primaryButton}
            >
              Explorar Catálogo
            </a>
            <a
              href="#catalog"
              className={styles.secondaryButton}
            >
              Ver Categorias <span aria-hidden="true">→</span>
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
              Catálogo Curado
            </div>
            <h2 className={styles.catalogTitle}>
              Produtos em Destaque
            </h2>
            <p className={styles.catalogSubtitle}>
              Descubra nossa seleção de equipamentos e acessórios premium, entregues com máxima performance.
            </p>
          </div>

          <ProductGrid products={products} isLoading={isLoading} error={errorMessage} />
        </section>
      </Layout>
    </>
  )
}

export default HomePage
