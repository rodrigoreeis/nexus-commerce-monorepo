import { Box, Flex, Text } from '@chakra-ui/react'
import { Container } from '@/shared/components/container/container'

export interface HeaderProps {
  systemStatus?: 'online' | 'maintenance' | 'offline'
}

export const Header = ({ systemStatus = 'online' }: HeaderProps) => {
  const isOnline = systemStatus === 'online'

  return (
    <Box
      as="header"
      backgroundColor="#0f172a"
      borderBottom="1px solid"
      borderColor="#334155"
      paddingY="1rem"
    >
      <Container>
        <Flex justify="space-between" align="center">
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
