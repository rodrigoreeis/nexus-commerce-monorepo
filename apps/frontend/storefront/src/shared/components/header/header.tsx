import { ShoppingBag } from 'lucide-react'
import { Container } from '@/shared/components/container/container'

export interface HeaderProps {
  cartItemCount?: number
}

export const Header = ({ cartItemCount = 0 }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0b0f19]/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Nexus Commerce Home"
            >
              <span className="h-6 w-6 rounded-md bg-emerald-500" aria-hidden="true" />
              <span className="text-lg font-bold tracking-tight text-white">
                Nexus Commerce
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <a
                href="#catalog"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md px-1 py-0.5"
              >
                Catalog
              </a>
              <a
                href="#categories"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md px-1 py-0.5"
              >
                Categories
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md px-1 py-0.5"
              >
                About
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/60 px-3.5 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>Cart</span>
              <span
                className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-400"
                aria-hidden="true"
              >
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}
