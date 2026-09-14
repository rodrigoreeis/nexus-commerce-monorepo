import { ReactNode } from 'react'
import { Header } from '@/shared/components/Header/Header'
import { Container } from '@/shared/components/Container/Container'

export interface LayoutProps {
  children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          {children}
        </Container>
      </main>
      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        <Container>
          <p>© 2026 Nexus Commerce. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  )
}
