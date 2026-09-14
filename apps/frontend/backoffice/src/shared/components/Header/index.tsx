import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Container } from '@/shared/components/Container'

export type BackofficeRoute = 'home' | 'products'

export interface HeaderProps {
  systemStatus?: 'online' | 'maintenance' | 'offline'
  activeRoute?: BackofficeRoute
  onNavigate?: (route: BackofficeRoute) => void
}

export const Header = ({
  systemStatus = 'online',
  activeRoute = 'home',
  onNavigate,
}: HeaderProps) => {
  const isOnline = systemStatus === 'online'

  const handleNavClick = (route: BackofficeRoute, path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new CustomEvent('app-navigate', { detail: { route, path } }))
    }

    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <Box
      as="header"
      backgroundColor="#0f172a"
      borderBottom="1px solid"
      borderColor="#334155"
      paddingY="1rem"
    >
      <Container>
        <Flex justify="space-between" align="center" wrap="wrap" gap="1rem">
          {/* Logo & Navigation */}
          <Flex align="center" gap="1.5rem">
            <Flex align="center" gap="0.75rem">
              <Text
                as="h1"
                fontSize="1.25rem"
                fontWeight="700"
                color="#f8fafc"
                letterSpacing="-0.025em"
              >
                Nexus Backoffice
              </Text>
              <Box
                as="span"
                fontSize="0.75rem"
                fontWeight="600"
                paddingX="0.5rem"
                paddingY="0.125rem"
                borderRadius="0.375rem"
                backgroundColor="#1e293b"
                color="#94a3b8"
                border="1px solid"
                borderColor="#334155"
                aria-label="Application version"
              >
                v0.1.0
              </Box>
            </Flex>

            {/* Navigation links */}
            <Flex as="nav" aria-label="Main Navigation" align="center" gap="0.375rem">
              <a
                href="/"
                onClick={handleNavClick('home', '/')}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: activeRoute === 'home' ? 600 : 500,
                  color: activeRoute === 'home' ? '#f8fafc' : '#94a3b8',
                  textDecoration: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: activeRoute === 'home' ? '#1e293b' : 'transparent',
                  border: activeRoute === 'home' ? '1px solid #334155' : '1px solid transparent',
                  transition: 'background-color 0.15s, color 0.15s',
                }}
              >
                Overview
              </a>
              <a
                href="/products"
                onClick={handleNavClick('products', '/products')}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: activeRoute === 'products' ? 600 : 500,
                  color: activeRoute === 'products' ? '#f8fafc' : '#94a3b8',
                  textDecoration: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: activeRoute === 'products' ? '#1e293b' : 'transparent',
                  border: activeRoute === 'products' ? '1px solid #334155' : '1px solid transparent',
                  transition: 'background-color 0.15s, color 0.15s',
                }}
              >
                Products
              </a>
            </Flex>
          </Flex>

          {/* System Operational Status */}
          <Flex
            align="center"
            gap="0.5rem"
            role="status"
            aria-label="System operational status"
          >
            <Box
              as="span"
              width="0.5rem"
              height="0.5rem"
              borderRadius="9999px"
              backgroundColor={isOnline ? '#10b981' : '#ef4444'}
              aria-hidden="true"
            />
            <Text fontSize="0.875rem" color="#94a3b8" fontWeight="500">
              {isOnline ? 'Systems Operational' : 'Degraded Service'}
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
