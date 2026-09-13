import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { Layout } from '@/shared/components/layout/layout'

interface MetricCardProps {
  label: string
  value: string
  subtext: string
}

const MetricCard = ({ label, value, subtext }: MetricCardProps) => {
  return (
    <Box
      backgroundColor="#0f172a"
      border="1px solid"
      borderColor="#334155"
      borderRadius="0.75rem"
      padding="1.5rem"
    >
      <Text fontSize="0.875rem" color="#94a3b8" fontWeight="500">
        {label}
      </Text>
      <Text
        fontSize="1.875rem"
        fontWeight="700"
        color="#f8fafc"
        marginTop="0.5rem"
        letterSpacing="-0.02em"
      >
        {value}
      </Text>
      <Text fontSize="0.75rem" color="#64748b" marginTop="0.25rem">
        {subtext}
      </Text>
    </Box>
  )
}

export const HomePage = () => {
  return (
    <Layout>
      <Box marginBottom="2rem">
        <Text
          as="h2"
          fontSize="1.75rem"
          fontWeight="700"
          color="#f8fafc"
          letterSpacing="-0.025em"
        >
          Commerce Overview
        </Text>
        <Text fontSize="1rem" color="#94a3b8" marginTop="0.25rem">
          Nexus Commerce administrative operations and system telemetry.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="1.5rem">
        <MetricCard
          label="Total Catalog Products"
          value="0"
          subtext="Ready for catalog sync"
        />
        <MetricCard
          label="Pending Orders"
          value="0"
          subtext="No active orders"
        />
        <MetricCard
          label="API Gateway Status"
          value="Connected"
          subtext="Go backend ready"
        />
      </SimpleGrid>
    </Layout>
  )
}

export default HomePage
