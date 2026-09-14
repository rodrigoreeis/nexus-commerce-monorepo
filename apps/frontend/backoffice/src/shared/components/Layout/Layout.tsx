import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import { BackofficeRoute, Header } from '@/shared/components/Header/Header'
import { Container } from '@/shared/components/Container/Container'

export interface LayoutProps {
  children?: ReactNode
  activeRoute?: BackofficeRoute
}

export const Layout = ({ children, activeRoute }: LayoutProps) => {
  return (
    <Box
      minHeight="100vh"
      backgroundColor="#090d16"
      color="#f8fafc"
      display="flex"
      flexDirection="column"
    >
      <Header activeRoute={activeRoute} />
      <Box as="main" flex="1" paddingY="2rem">
        <Container>
          {children}
        </Container>
      </Box>
    </Box>
  )
}
