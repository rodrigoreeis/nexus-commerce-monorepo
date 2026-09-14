import { Box, Button, Flex, Table, Text } from '@chakra-ui/react'
import { AlertCircle, Image as ImageIcon, Package, RotateCcw } from 'lucide-react'
import { Product, getProductImageUrl } from '@/shared/services/products'
import { formatCurrency, formatDate } from '@/shared/utils/format'

export interface ProductTableProps {
  products: Product[]
  isLoading: boolean
  errorMessage?: string | null
  onRetry?: () => void
}

export const ProductTable = ({
  products,
  isLoading,
  errorMessage,
  onRetry,
}: ProductTableProps) => {
  if (isLoading) {
    return (
      <Box
        role="status"
        aria-live="polite"
        aria-label="Carregando produtos"
        backgroundColor="#0f172a"
        border="1px solid #334155"
        borderRadius="0.75rem"
        padding="3rem 2rem"
        textAlign="center"
      >
        <Flex direction="column" align="center" justify="center" gap="1rem">
          <Box
            width="2.5rem"
            height="2.5rem"
            border="3px solid #334155"
            borderTopColor="#3b82f6"
            borderRadius="9999px"
            style={{ animation: 'spin 1s linear infinite' }}
            aria-hidden="true"
          />
          <Text fontSize="0.9375rem" color="#94a3b8" fontWeight="500">
            Carregando produtos…
          </Text>
        </Flex>
      </Box>
    )
  }

  if (errorMessage) {
    return (
      <Box
        role="alert"
        aria-live="polite"
        backgroundColor="#0f172a"
        border="1px solid #7f1d1d"
        borderRadius="0.75rem"
        padding="2.5rem 2rem"
        textAlign="center"
      >
        <Flex direction="column" align="center" gap="1rem">
          <Box color="#f87171" aria-hidden="true">
            <AlertCircle size={36} />
          </Box>
          <Box>
            <Text fontSize="1.125rem" fontWeight="600" color="#fecaca">
              Falha ao carregar produtos do catálogo
            </Text>
            <Text fontSize="0.875rem" color="#94a3b8" marginTop="0.25rem">
              {errorMessage}
            </Text>
          </Box>
          {onRetry && (
            <Button
              type="button"
              onClick={onRetry}
              size="sm"
              backgroundColor="#1e293b"
              border="1px solid #334155"
              color="#f8fafc"
              _hover={{ backgroundColor: '#334155' }}
              gap="0.5rem"
              paddingX="1rem"
              paddingY="0.5rem"
              borderRadius="0.375rem"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Tentar Novamente
            </Button>
          )}
        </Flex>
      </Box>
    )
  }

  if (!products || products.length === 0) {
    return (
      <Box
        role="region"
        aria-label="Estado de catálogo vazio"
        backgroundColor="#0f172a"
        border="1px dashed #334155"
        borderRadius="0.75rem"
        padding="3.5rem 2rem"
        textAlign="center"
      >
        <Flex direction="column" align="center" gap="0.75rem">
          <Box color="#64748b" aria-hidden="true">
            <Package size={40} />
          </Box>
          <Text fontSize="1.125rem" fontWeight="600" color="#f8fafc">
            Nenhum produto encontrado
          </Text>
          <Text fontSize="0.875rem" color="#94a3b8" maxWidth="24rem">
            Seu catálogo está vazio no momento. Clique em “Adicionar Produto” para cadastrar seu primeiro produto.
          </Text>
        </Flex>
      </Box>
    )
  }

  return (
    <Box
      backgroundColor="#0f172a"
      border="1px solid #334155"
      borderRadius="0.75rem"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Table.Root width="100%" interactive={false}>
          <Table.Header backgroundColor="#1e293b">
            <Table.Row borderColor="#334155">
              <Table.ColumnHeader color="#94a3b8" fontWeight="600" fontSize="0.8125rem" padding="0.875rem 1rem">
                Produto
              </Table.ColumnHeader>
              <Table.ColumnHeader color="#94a3b8" fontWeight="600" fontSize="0.8125rem" padding="0.875rem 1rem">
                Descrição
              </Table.ColumnHeader>
              <Table.ColumnHeader color="#94a3b8" fontWeight="600" fontSize="0.8125rem" padding="0.875rem 1rem" textAlign="right">
                Preço
              </Table.ColumnHeader>
              <Table.ColumnHeader color="#94a3b8" fontWeight="600" fontSize="0.8125rem" padding="0.875rem 1rem" textAlign="right">
                Data de Cadastro
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {products.map((product) => {
              const fullImageUrl = getProductImageUrl(product.imageUrl)

              return (
                <Table.Row
                  key={product.id}
                  borderColor="#1e293b"
                  _hover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                >
                  {/* Product Thumbnail & Name */}
                  <Table.Cell padding="0.875rem 1rem">
                    <Flex align="center" gap="0.875rem">
                      <Box
                        width="3rem"
                        height="3rem"
                        minWidth="3rem"
                        borderRadius="0.375rem"
                        overflow="hidden"
                        backgroundColor="#1e293b"
                        border="1px solid #334155"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {fullImageUrl ? (
                          <img
                            src={fullImageUrl}
                            alt={product.name}
                            width={48}
                            height={48}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <Box color="#64748b" aria-hidden="true">
                            <ImageIcon size={20} />
                          </Box>
                        )}
                      </Box>
                      <Box minWidth="0">
                        <Text
                          fontSize="0.9375rem"
                          fontWeight="600"
                          color="#f8fafc"
                          letterSpacing="-0.01em"
                        >
                          {product.name}
                        </Text>
                        <Text fontSize="0.75rem" color="#64748b">
                          ID: {product.id}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>

                  {/* Description */}
                  <Table.Cell padding="0.875rem 1rem" maxWidth="18rem">
                    <Text
                      fontSize="0.875rem"
                      color="#94a3b8"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {product.description || '—'}
                    </Text>
                  </Table.Cell>

                  {/* Price */}
                  <Table.Cell
                    padding="0.875rem 1rem"
                    textAlign="right"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    <Text fontSize="0.9375rem" fontWeight="600" color="#f8fafc">
                      {formatCurrency(product.price)}
                    </Text>
                  </Table.Cell>

                  {/* Created At */}
                  <Table.Cell padding="0.875rem 1rem" textAlign="right">
                    <Text fontSize="0.8125rem" color="#94a3b8">
                      {formatDate(product.createdAt)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}
