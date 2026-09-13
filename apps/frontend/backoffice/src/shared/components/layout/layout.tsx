import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import { Header } from '@/shared/components/header/header'
import { Container } from '@/shared/components/container/container'

export interface LayoutProps {
  children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      minHeight="100vh"
      backgroundColor="#090d16"
      color="#f8fafc"
      display="flex"
      flexDirection="column"
    >
      <Header />
      <Box as="main" flex="1" paddingY="2rem">
        <Container>
          {children}
        </Container>
      </Box>
    </Box>
  )
}
