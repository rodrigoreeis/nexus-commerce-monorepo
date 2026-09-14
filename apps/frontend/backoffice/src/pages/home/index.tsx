import { useState } from 'react'
import { Dialog, Portal } from '@chakra-ui/react'
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  RotateCw,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { Layout } from '@/shared/components/Layout'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import styles from './styles.module.css'

export type OrderStatus = 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado'

export interface RecentOrder {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: OrderStatus
  createdAt: string
}

export const INITIAL_ORDERS: RecentOrder[] = [
  {
    id: '#ORD-9021',
    customerName: 'Lucas Silva',
    customerEmail: 'lucas.silva@email.com',
    total: 349.9,
    status: 'Pendente',
    createdAt: '2026-09-14T00:10:00Z',
  },
  {
    id: '#ORD-9020',
    customerName: 'Mariana Costa',
    customerEmail: 'mariana.costa@email.com',
    total: 890.0,
    status: 'Processando',
    createdAt: '2026-09-13T23:45:00Z',
  },
  {
    id: '#ORD-9019',
    customerName: 'Carlos Eduardo',
    customerEmail: 'carlos.edu@email.com',
    total: 159.99,
    status: 'Enviado',
    createdAt: '2026-09-13T22:15:00Z',
  },
  {
    id: '#ORD-9018',
    customerName: 'Beatriz Santos',
    customerEmail: 'beatriz.santos@email.com',
    total: 1250.0,
    status: 'Entregue',
    createdAt: '2026-09-13T20:30:00Z',
  },
  {
    id: '#ORD-9017',
    customerName: 'Rafael Oliveira',
    customerEmail: 'rafael.olv@email.com',
    total: 75.5,
    status: 'Cancelado',
    createdAt: '2026-09-13T18:00:00Z',
  },
]

const ALL_STATUSES: OrderStatus[] = [
  'Pendente',
  'Processando',
  'Enviado',
  'Entregue',
  'Cancelado',
]

const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case 'Pendente':
      return styles.statusBadgePendente
    case 'Processando':
      return styles.statusBadgeProcessando
    case 'Enviado':
      return styles.statusBadgeEnviado
    case 'Entregue':
      return styles.statusBadgeEntregue
    case 'Cancelado':
      return styles.statusBadgeCancelado
    default:
      return styles.statusBadgePendente
  }
}

export const HomePage = () => {
  const [orders, setOrders] = useState<RecentOrder[]>(INITIAL_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pendente')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const handleOpenStatusModal = (order: RecentOrder) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsModalOpen(true)
    setFeedbackMessage(null)
  }

  const handleSaveStatus = () => {
    if (!selectedOrder) return

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      )
    )

    setFeedbackMessage(`Status do pedido ${selectedOrder.id} alterado para "${newStatus}".`)
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  return (
    <Layout activeRoute="dashboard" title="Dashboard">
      <div className={styles.dashboardRoot}>
        {/* Construction Notice Banner */}
        <div className={styles.constructionBanner} role="status">
          <div className={styles.constructionBadge}>
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span>Em Construção</span>
          </div>
        </div>

        <div className={styles.blurredArea}>
          {/* Page Header */}
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Dashboard</h2>
          <p className={styles.pageSubtitle}>
            Métricas de performance, quantidade de vendas e gestão de pedidos recentes.
          </p>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            role="status"
            className={styles.feedbackAlert}
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          {/* Quantidade de Vendas */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Quantidade de Vendas</span>
              <div className={`${styles.metricIconWrapper} ${styles.metricIconEmerald}`}>
                <TrendingUp size={20} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.metricValue}>1.428</p>
            <p className={styles.metricSubtext}>
              <span className={styles.metricPositive}>+14,2%</span> em relação ao mês anterior
            </p>
          </div>

          {/* Total de Pedidos */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Total de Pedidos</span>
              <div className={`${styles.metricIconWrapper} ${styles.metricIconBlue}`}>
                <ShoppingBag size={20} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.metricValue}>352</p>
            <p className={styles.metricSubtext}>
              <span className={styles.metricInfo}>98,5%</span> taxa de entrega com sucesso
            </p>
          </div>

          {/* Volume em Reais */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Receita de Vendas</span>
              <div className={`${styles.metricIconWrapper} ${styles.metricIconPurple}`}>
                <DollarSign size={20} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.metricValue}>{formatCurrency(284950.0)}</p>
            <p className={styles.metricSubtext}>
              Moeda oficial: <span className={styles.metricCurrency}>Reais (R$)</span>
            </p>
          </div>
        </div>

        {/* Pedidos Recentes Table */}
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Pedidos Recentes</h3>
              <p className={styles.sectionSubtitle}>
                Acompanhamento em tempo real dos últimos pedidos realizados na loja.
              </p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="Tabela de Pedidos Recentes">
              <thead>
                <tr>
                  <th className={styles.th}>ID do Pedido</th>
                  <th className={styles.th}>Usuário que Comprou</th>
                  <th className={styles.th}>Valor</th>
                  <th className={styles.th}>Data</th>
                  <th className={styles.th}>Status</th>
                  <th className={`${styles.th} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={styles.tableRow}>
                    <td className={`${styles.td} ${styles.orderIdCell}`}>
                      {order.id}
                    </td>
                    <td className={styles.td}>
                      <div className={styles.customerInfo}>
                        <span className={styles.customerName}>{order.customerName}</span>
                        <span className={styles.customerEmail}>{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} font-semibold tabular-nums`}>
                      {formatCurrency(order.total)}
                    </td>
                    <td className={`${styles.td} text-xs text-[#94a3b8]`}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td className={styles.td}>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className={`${styles.td} text-right`}>
                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(order)}
                        className={styles.updateButton}
                        aria-label={`Atualizar status do pedido ${order.id}`}
                      >
                        <RotateCw size={13} aria-hidden="true" />
                        <span>Atualizar Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {/* Modal para Atualizar Status */}
        <Dialog.Root open={isModalOpen} onOpenChange={(details) => setIsModalOpen(details.open)}>
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
                maxWidth="26rem"
                width="100%"
                color="var(--text-primary)"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.35)"
              >
                <Dialog.Header padding="0" marginBottom="1.25rem">
                  <div className={styles.dialogHeaderBar}>
                    <Dialog.Title className={styles.dialogTitle}>
                      Atualizar Status do Pedido
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      aria-label="Fechar modal de status"
                      className={styles.dialogCloseButton}
                    >
                      <X size={20} aria-hidden="true" />
                    </button>
                  </div>
                </Dialog.Header>

                <Dialog.Body padding="0">
                  {selectedOrder && (
                    <div className={styles.modalContentBody}>
                      <div className={styles.orderInfoCard}>
                        <p>
                          <span className={styles.orderInfoLabel}>Pedido:</span>{' '}
                          <strong className={styles.orderInfoValue}>{selectedOrder.id}</strong>
                        </p>
                        <p>
                          <span className={styles.orderInfoLabel}>Cliente:</span>{' '}
                          <strong className={styles.orderInfoValue}>{selectedOrder.customerName}</strong>
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="order-status-select"
                          className={styles.statusFieldLabel}
                        >
                          Novo Status
                        </label>
                        <select
                          id="order-status-select"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                          className={styles.statusSelect}
                        >
                          {ALL_STATUSES.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.modalActions}>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className={styles.modalCancelButton}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveStatus}
                          className={styles.modalSaveButton}
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </div>
    </Layout>
  )
}

export default HomePage
