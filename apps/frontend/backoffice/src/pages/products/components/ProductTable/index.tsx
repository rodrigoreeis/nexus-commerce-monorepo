import { useState } from 'react'
import { Dialog, Portal, Table } from '@chakra-ui/react'
import { AlertCircle, Image as ImageIcon, Package, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { Product, getProductImageUrl } from '@/shared/services/products'
import { useDeleteAdminProduct } from '@/shared/hooks/useAdminProducts'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import styles from './styles.module.css'

export interface ProductTableProps {
  products: Product[]
  isLoading: boolean
  errorMessage?: string | null
  onRetry?: () => void
  onDeleteSuccess?: () => void
  onEdit?: (product: Product) => void
}

export const ProductTable = ({
  products,
  isLoading,
  errorMessage,
  onRetry,
  onDeleteSuccess,
  onEdit,
}: ProductTableProps) => {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const deleteMutation = useDeleteAdminProduct()

  const handleOpenDeleteDialog = (product: Product) => {
    setDeleteError(null)
    setProductToDelete(product)
  }

  const handleCloseDeleteDialog = () => {
    if (deleteMutation.isPending) return
    setProductToDelete(null)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    try {
      setDeleteError(null)
      await deleteMutation.mutateAsync(productToDelete.id)
      setProductToDelete(null)
      onDeleteSuccess?.()
    } catch (err: any) {
      setDeleteError(err?.message || 'Falha ao excluir produto')
    }
  }
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
              <Table.ColumnHeader color="#94a3b8" fontWeight="600" fontSize="0.8125rem" padding="0.875rem 1rem" textAlign="right">
                Ações
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

                  {/* Actions */}
                  <Table.Cell padding="0.875rem 1rem" textAlign="right">
                    <div className={styles.actionsCell}>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className={styles.editButton}
                          aria-label={`Editar produto ${product.name}`}
                          title={`Editar produto ${product.name}`}
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteDialog(product)}
                        className={styles.deleteButton}
                        aria-label={`Excluir produto ${product.name}`}
                        title={`Excluir produto ${product.name}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </div>

      {/* Confirmation Dialog */}
      <Dialog.Root
        open={Boolean(productToDelete)}
        onOpenChange={(details) => {
          if (!details.open && !deleteMutation.isPending) {
            handleCloseDeleteDialog()
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop
            position="fixed"
            inset="0"
            width="100vw"
            height="100vh"
            minHeight="100dvh"
            backgroundColor="rgba(0, 0, 0, 0.65)"
            backdropFilter="blur(8px)"
            zIndex={1400}
          />
          <Dialog.Positioner
            position="fixed"
            inset="0"
            width="100vw"
            height="100vh"
            minHeight="100dvh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflowY="auto"
            padding="1.5rem"
            zIndex={1400}
          >
            <Dialog.Content
              backgroundColor="var(--bg-surface)"
              border="1px solid var(--border-app)"
              borderRadius="0.75rem"
              padding="1.5rem"
              maxWidth="28rem"
              width="100%"
              color="var(--text-primary)"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.35)"
            >
              <Dialog.Header padding="0" marginBottom="1rem">
                <Dialog.Title className={styles.dialogTitle}>
                  Confirmar Exclusão
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body padding="0">
                <p className={styles.confirmText}>
                  Tem certeza que deseja remover o produto <strong>{productToDelete?.name}</strong>? Esta ação não poderá ser desfeita.
                </p>
                {deleteError && (
                  <div role="alert" className={styles.dialogErrorAlert}>
                    {deleteError}
                  </div>
                )}
              </Dialog.Body>

              <Dialog.Footer padding="0" marginTop="1.5rem" display="flex" justifyContent="flex-end" gap="0.75rem">
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={handleCloseDeleteDialog}
                  className={styles.dialogCancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={handleConfirmDelete}
                  className={styles.dialogDeleteButton}
                >
                  {deleteMutation.isPending ? 'Excluindo…' : 'Excluir Produto'}
                </button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </div>
  )
}
