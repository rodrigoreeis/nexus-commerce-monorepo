import { useState } from 'react'
import { Dialog } from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
import { Layout } from '@/shared/components/Layout'
import { useAdminProducts } from '@/shared/hooks/useAdminProducts'
import { ProductForm } from './components/ProductForm'
import { ProductTable } from './components/ProductTable'
import styles from './styles.module.css'

export const ProductsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: products = [], isLoading, error, refetch } = useAdminProducts()

  const isErrorInstance = error instanceof Error
  const hasGenericError = Boolean(error)
  const errorMessage = isErrorInstance
    ? error.message
    : hasGenericError
      ? 'Não foi possível carregar os produtos do servidor'
      : null

  const handleProductCreated = () => {
    refetch()
    setIsDialogOpen(false)
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
            onClick={() => setIsDialogOpen(true)}
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
        />

        {/* Creation Modal */}
        <Dialog.Root open={isDialogOpen} onOpenChange={(details) => setIsDialogOpen(details.open)}>
          <Dialog.Backdrop backgroundColor="rgba(0, 0, 0, 0.75)" backdropFilter="blur(4px)" />
          <Dialog.Positioner>
            <Dialog.Content
              backgroundColor="var(--bg-surface)"
              border="1px solid var(--border-app)"
              borderRadius="0.75rem"
              padding="1.5rem"
              maxWidth="32rem"
              width="100%"
              color="var(--text-primary)"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            >
              <Dialog.Header padding="0" marginBottom="1.25rem">
                <div className={styles.dialogHeaderBar}>
                  <Dialog.Title className={styles.dialogTitle}>
                    Cadastrar Novo Produto
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    aria-label="Fechar diálogo de cadastro de produto"
                    className={styles.dialogCloseButton}
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
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
      </div>
    </Layout>
  )
}

export default ProductsPage
