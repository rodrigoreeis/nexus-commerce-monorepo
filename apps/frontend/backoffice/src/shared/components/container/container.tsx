import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

export interface ContainerProps {
  children?: ReactNode
  maxWidth?: string
}

export const Container = ({
  children,
  maxWidth = '1280px',
}: ContainerProps) => {
  return (
    <Box
      width="100%"
      maxWidth={maxWidth}
      marginX="auto"
      paddingX={{ base: '1rem', md: '1.5rem', lg: '2rem' }}
      data-testid="backoffice-container"
    >
      {children}
    </Box>
  )
}
