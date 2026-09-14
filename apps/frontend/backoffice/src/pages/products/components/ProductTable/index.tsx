import { Table } from '@chakra-ui/react'
import { AlertCircle, Image as ImageIcon, Package, RotateCcw } from 'lucide-react'
import { Product, getProductImageUrl } from '@/shared/services/products'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import styles from './styles.module.css'

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
      <div
        role="status"
        aria-live="polite"
        aria-label="Carregando produtos"
        className={styles.loadingContainer}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="w-10 h-10 border-3 border-[#334155] border-t-blue-500 rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-[#94a3b8]">
            Carregando produtos…
          </p>
        </div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={styles.errorContainer}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-rose-400" aria-hidden="true">
            <AlertCircle size={36} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-rose-200">
              Falha ao carregar produtos do catálogo
            </h3>
            <p className="text-sm text-[#94a3b8] mt-1">
              {errorMessage}
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={styles.retryButton}
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Tentar Novamente</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div
        role="region"
        aria-label="Estado de catálogo vazio"
        className={styles.emptyContainer}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-[#64748b]" aria-hidden="true">
            <Package size={40} />
          </div>
          <h3 className="text-lg font-semibold text-[#f8fafc]">
            Nenhum produto encontrado
          </h3>
          <p className="text-sm text-[#94a3b8] max-w-sm">
            Seu catálogo está vazio no momento. Clique em “Adicionar Produto” para cadastrar seu primeiro produto.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
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
                    <div className="flex items-center gap-3.5">
                      <div className={styles.imageBox}>
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
                          <div className="text-[#64748b]" aria-hidden="true">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#f8fafc]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>

                  {/* Description */}
                  <Table.Cell padding="0.875rem 1rem" maxWidth="18rem">
                    <p className="text-sm text-[#94a3b8] truncate">
                      {product.description || '—'}
                    </p>
                  </Table.Cell>

                  {/* Price */}
                  <Table.Cell
                    padding="0.875rem 1rem"
                    textAlign="right"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    <span className="text-sm font-semibold text-[#f8fafc]">
                      {formatCurrency(product.price)}
                    </span>
                  </Table.Cell>

                  {/* Created At */}
                  <Table.Cell padding="0.875rem 1rem" textAlign="right">
                    <span className="text-xs text-[#94a3b8]">
                      {formatDate(product.createdAt)}
                    </span>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  )
}
