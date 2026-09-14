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
        <div className={styles.spinnerWrapper}>
          <div
            className={styles.spinner}
            aria-hidden="true"
          />
          <p className={styles.spinnerText}>
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
        <div className={styles.errorWrapper}>
          <div className={styles.errorIcon} aria-hidden="true">
            <AlertCircle size={36} />
          </div>
          <div>
            <h3 className={styles.errorTitle}>
              Falha ao carregar produtos do catálogo
            </h3>
            <p className={styles.errorSubtitle}>
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
        <div className={styles.emptyWrapper}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <Package size={40} />
          </div>
          <h3 className={styles.emptyTitle}>
            Nenhum produto encontrado
          </h3>
          <p className={styles.emptySubtitle}>
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
                    <div className={styles.productInfoCell}>
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
                          <div className={styles.placeholderIcon} aria-hidden="true">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className={styles.productDetails}>
                        <p className={styles.productNameText}>
                          {product.name}
                        </p>
                        <p className={styles.productIdText}>
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>

                  {/* Description */}
                  <Table.Cell padding="0.875rem 1rem" maxWidth="18rem">
                    <p className={styles.productDescText}>
                      {product.description || '—'}
                    </p>
                  </Table.Cell>

                  {/* Price */}
                  <Table.Cell
                    padding="0.875rem 1rem"
                    textAlign="right"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    <span className={styles.priceText}>
                      {formatCurrency(product.price)}
                    </span>
                  </Table.Cell>

                  {/* Created At */}
                  <Table.Cell padding="0.875rem 1rem" textAlign="right">
                    <span className={styles.dateText}>
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
