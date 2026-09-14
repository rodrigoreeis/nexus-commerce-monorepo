import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Sparkles } from 'lucide-react'
import { Layout } from '@/shared/components/Layout/Layout'
import { ProductGrid } from '@/shared/components/ProductGrid/ProductGrid'
import { useStoreProducts } from '@/shared/hooks/useStoreProducts'
import { getStoreProducts, type Product } from '@/shared/services/catalog'

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
        <div className="mx-auto max-w-3xl text-center py-12 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Release 0 Live Platform
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl text-pretty">
            Welcome to <span className="text-emerald-400">Nexus Commerce</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-400 max-w-xl mx-auto">
            The next-generation modular e-commerce experience. Explore our high-performance catalog.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#catalog"
              className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 transition-colors"
            >
              Explore Catalog
            </a>
            <a
              href="#catalog"
              className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors"
            >
              View Categories <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Catalog Section */}
        <section
          id="catalog"
          className="mt-12 sm:mt-16 scroll-mt-12 border-t border-gray-800/80 pt-16"
        >
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Curated Catalog
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-pretty">
              Featured Products
            </h2>
            <p className="mt-3 text-base text-gray-400 max-w-xl mx-auto">
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
