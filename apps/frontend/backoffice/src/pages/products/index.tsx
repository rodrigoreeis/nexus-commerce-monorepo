import { useState } from 'react'
import { Dialog, Portal } from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
import { Layout } from '@/shared/components/Layout'
import { Product } from '@/shared/services/products'
import { useAdminProducts } from '@/shared/hooks/useAdminProducts'
import { ProductForm } from './components/ProductForm'
import { ProductTable } from './components/ProductTable'
import styles from './styles.module.css'

export const ProductsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { data: products = [], isLoading, error, refetch } = useAdminProducts()

  const isErrorInstance = error instanceof Error
  const hasGenericError = Boolean(error)
  const errorMessage = isErrorInstance
    ? error.message
    : hasGenericError
      ? 'Não foi possível carregar os produtos do servidor'
      : null

  const handleOpenCreateModal = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleProductSaved = () => {
    refetch()
    handleCloseDialog()
  }

  return (
    <Layout activeRoute="products" title="Produtos">
      <div className={styles.productsRoot}>
        {/* Top action header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>
              Gestão de Produtos
            </h2>
            <p className={styles.pageSubtitle}>
              Gerencie itens do catálogo, revise preços e faça upload de imagens dos produtos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className={styles.addButton}
            aria-label="Adicionar novo produto"
          >
            <Plus size={18} aria-hidden="true" />
            <span>Adicionar Produto</span>
          </button>
        </div>

        {/* Product Listing Table */}
        <ProductTable
          products={products}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onRetry={() => refetch()}
          onEdit={handleOpenEditModal}
        />

        {/* Creation/Edit Modal */}
        <Dialog.Root
          open={isDialogOpen}
          onOpenChange={(details) => {
            if (!details.open) {
              handleCloseDialog()
            } else {
              setIsDialogOpen(true)
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
                maxWidth="32rem"
                width="100%"
                color="var(--text-primary)"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.35)"
              >
                <Dialog.Header padding="0" marginBottom="1.25rem">
                  <div className={styles.dialogHeaderBar}>
                    <Dialog.Title className={styles.dialogTitle}>
                      {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={handleCloseDialog}
                      aria-label="Fechar diálogo de cadastro de produto"
                      className={styles.dialogCloseButton}
                    >
                      <X size={20} aria-hidden="true" />
                    </button>
                  </div>
                </Dialog.Header>

                <Dialog.Body padding="0">
                  <ProductForm
                    initialProduct={editingProduct}
                    onSuccess={handleProductSaved}
                    onCancel={handleCloseDialog}
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </div>
    </Layout>
  )
}

export default ProductsPage
