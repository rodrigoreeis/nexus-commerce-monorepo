import { ReactNode } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export interface AppProviderProps {
  children?: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  )
}
