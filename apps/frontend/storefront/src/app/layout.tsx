import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Nexus Commerce',
  description: 'Next-generation modular commerce storefront',
}

export interface RootLayoutProps {
  children?: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className="bg-[#0b0f19] text-gray-100 antialiased">
        {children}
      </body>
    </html>
  )
}

export default RootLayout
