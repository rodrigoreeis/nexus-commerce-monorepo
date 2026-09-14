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
                <div className="flex justify-between items-center w-full">
                  <Dialog.Title fontSize="1.25rem" fontWeight="700" color="#f8fafc" letterSpacing="-0.02em">
                    Cadastrar Novo Produto
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    aria-label="Fechar diálogo de cadastro de produto"
                    className="text-[#94a3b8] hover:text-[#f8fafc] p-1 rounded-md transition-colors"
                  >
                    <X size={18} aria-hidden="true" />
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
