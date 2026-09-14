import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Layout } from '@/shared/components/Layout'
import { Container } from '@/shared/components/Container'
import { HeroCarousel } from '@/shared/components/HeroCarousel'
import { HighlightCards } from '@/shared/components/HighlightCards'
import { ProductCarousel } from '@/shared/components/ProductCarousel'
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
        <title>Nexus Commerce | Loja Oficial</title>
        <meta
          name="description"
          content="A experiência definitiva de compras online com catálogo moderno, entrega rápida e garantia."
        />
      </Head>
      <Layout>
        <h1 className="sr-only">Nexus Commerce - Loja Oficial</h1>
        <HeroCarousel />
        <Container>
          <div className={styles.highlightsWrapper}>
            <HighlightCards />
          </div>
          <section id="produtos" className={styles.productsSection}>
            <ProductCarousel
              products={products}
              isLoading={isLoading}
              error={errorMessage}
            />
          </section>
        </Container>
      </Layout>
    </>
  )
}

export default HomePage
