import { useState } from 'react'
import { Dialog } from '@chakra-ui/react'
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  RotateCw,
  X,
  CheckCircle2,
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
            className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-sm font-medium"
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
              <div className={`${styles.metricIconWrapper} bg-emerald-500/10 text-emerald-400`}>
                <TrendingUp size={20} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.metricValue}>1.428</p>
            <p className={styles.metricSubtext}>
              <span className="text-emerald-400 font-semibold">+14,2%</span> em relação ao mês anterior
            </p>
          </div>

          {/* Total de Pedidos */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Total de Pedidos</span>
              <div className={`${styles.metricIconWrapper} bg-blue-500/10 text-blue-400`}>
                <ShoppingBag size={20} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.metricValue}>352</p>
            <p className={styles.metricSubtext}>
              <span className="text-blue-400 font-semibold">98,5%</span> taxa de entrega com sucesso
            </p>
          </div>

          {/* Volume em Reais */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Receita de Vendas</span>
              <div className={`${styles.metricIconWrapper} bg-purple-500/10 text-purple-400`}>
                <DollarSign size={20} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.metricValue}>{formatCurrency(284950.0)}</p>
            <p className={styles.metricSubtext}>
              Moeda oficial: <span className="text-purple-400 font-semibold">Reais (R$)</span>
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
                  <tr key={order.id} className="hover:bg-[#1e293b]/50 transition-colors">
                    <td className={`${styles.td} font-mono font-semibold text-blue-400`}>
                      {order.id}
                    </td>
                    <td className={styles.td}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#f8fafc]">{order.customerName}</span>
                        <span className="text-xs text-[#64748b]">{order.customerEmail}</span>
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

        {/* Modal para Atualizar Status */}
        <Dialog.Root open={isModalOpen} onOpenChange={(details) => setIsModalOpen(details.open)}>
          <Dialog.Backdrop backgroundColor="rgba(0, 0, 0, 0.75)" backdropFilter="blur(4px)" />
          <Dialog.Positioner>
            <Dialog.Content
              backgroundColor="#0f172a"
              border="1px solid #334155"
              borderRadius="0.75rem"
              padding="1.5rem"
              maxWidth="26rem"
              width="100%"
              color="#f8fafc"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            >
              <Dialog.Header padding="0" marginBottom="1.25rem">
                <div className="flex justify-between items-center w-full">
                  <Dialog.Title fontSize="1.125rem" fontWeight="700" color="#f8fafc">
                    Atualizar Status do Pedido
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Fechar modal de status"
                    className="text-[#94a3b8] hover:text-[#f8fafc] p-1 rounded-md transition-colors"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </Dialog.Header>

              <Dialog.Body padding="0">
                {selectedOrder && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-[#1e293b] border border-[#334155] text-xs space-y-1">
                      <p>
                        <span className="text-[#94a3b8]">Pedido:</span>{' '}
                        <strong className="text-white">{selectedOrder.id}</strong>
                      </p>
                      <p>
                        <span className="text-[#94a3b8]">Cliente:</span>{' '}
                        <strong className="text-white">{selectedOrder.customerName}</strong>
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="order-status-select"
                        className="block text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider"
                      >
                        Novo Status
                      </label>
                      <select
                        id="order-status-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                        className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        {ALL_STATUSES.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#94a3b8] hover:text-white rounded-lg border border-[#334155] transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveStatus}
                        className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </div>
    </Layout>
  )
}

export default HomePage
