import { Layout } from '@/shared/components/layout/layout'

const HomePage = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl text-center py-12 sm:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          Release 0 Live Platform
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
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
            href="#categories"
            className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors"
          >
            View Categories <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
