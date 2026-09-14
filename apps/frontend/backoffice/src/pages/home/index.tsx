import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { Layout } from '@/shared/components/Layout'

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
    <Layout activeRoute="home">
      <Box marginBottom="2rem">
        <Text
          as="h2"
          fontSize="1.75rem"
          fontWeight="700"
          color="#f8fafc"
          letterSpacing="-0.025em"
        >
          Visão Geral do Comércio
        </Text>
        <Text fontSize="1rem" color="#94a3b8" marginTop="0.25rem">
          Operações administrativas do Nexus Commerce e telemetria do sistema.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="1.5rem">
        <MetricCard
          label="Total de Produtos no Catálogo"
          value="0"
          subtext="Pronto para sincronização"
        />
        <MetricCard
          label="Pedidos Pendentes"
          value="0"
          subtext="Nenhum pedido ativo"
        />
        <MetricCard
          label="Status do Gateway de API"
          value="Conectado"
          subtext="Backend Go pronto"
        />
      </SimpleGrid>
    </Layout>
  )
}

export default HomePage
