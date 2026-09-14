import { useState } from 'react'
import { Box, Button, Dialog, Flex, Text } from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
import { Layout } from '@/shared/components/Layout'
import { useAdminProducts } from '@/shared/hooks/useAdminProducts'
import { ProductForm } from './components/ProductForm'
import { ProductTable } from './components/ProductTable'

export const ProductsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: products = [], isLoading, error, refetch } = useAdminProducts()

  const isErrorInstance = error instanceof Error
  const hasGenericError = Boolean(error)
  const errorMessage = isErrorInstance
    ? error.message
    : hasGenericError
      ? 'Unable to load products from server'
      : null

  const handleProductCreated = () => {
    refetch()
    setIsDialogOpen(false)
  }

  return (
    <Layout activeRoute="products">
      {/* Top action header */}
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
        gap="1rem"
        marginBottom="2rem"
      >
        <Box>
          <Text
            as="h2"
            fontSize="1.75rem"
            fontWeight="700"
            color="#f8fafc"
            letterSpacing="-0.025em"
          >
            Products Management
          </Text>
          <Text fontSize="0.9375rem" color="#94a3b8" marginTop="0.25rem">
            Manage catalog items, review pricing, and upload product assets.
          </Text>
        </Box>

        <Button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          backgroundColor="#2563eb"
          color="#ffffff"
          fontWeight="600"
          _hover={{ backgroundColor: '#1d4ed8' }}
          gap="0.5rem"
          paddingX="1.25rem"
          paddingY="0.625rem"
          borderRadius="0.5rem"
          aria-label="Add new product"
        >
          <Plus size={18} aria-hidden="true" />
          Add Product
        </Button>
      </Flex>

      {/* Product Listing Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={() => refetch()}
      />

      {/* Creation Modal */}
      <Dialog.Root open={isDialogOpen} onOpenChange={(details) => setIsDialogOpen(details.open)}>
        <Dialog.Backdrop backgroundColor="rgba(0, 0, 0, 0.75)" backdropFilter="blur(4px)" />
        <Dialog.Positioner>
          <Dialog.Content
            backgroundColor="#0f172a"
            border="1px solid #334155"
            borderRadius="0.75rem"
            padding="1.5rem"
            maxWidth="32rem"
            width="100%"
            color="#f8fafc"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          >
            <Dialog.Header padding="0" marginBottom="1.25rem">
              <Flex justify="space-between" align="center">
                <Dialog.Title fontSize="1.25rem" fontWeight="700" color="#f8fafc" letterSpacing="-0.02em">
                  Register New Product
                </Dialog.Title>
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  size="xs"
                  variant="ghost"
                  aria-label="Close product registration dialog"
                  color="#94a3b8"
                  _hover={{ backgroundColor: '#1e293b', color: '#f8fafc' }}
                  padding="0.25rem"
                >
                  <X size={18} aria-hidden="true" />
                </Button>
              </Flex>
            </Dialog.Header>

            <Dialog.Body padding="0">
              <ProductForm
                onSuccess={handleProductCreated}
                onCancel={() => setIsDialogOpen(false)}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Layout>
  )
}

export default ProductsPage
