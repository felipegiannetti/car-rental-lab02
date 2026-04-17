import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Ban,
  Car,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  User,
  XCircle,
} from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  PENDENTE: {
    label: 'Pendente',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    panel: '#fff8eb',
    border: '#f4d38c',
    accent: '#d97706',
    subtle: '#92400e',
  },
  EM_ANALISE: {
    label: 'Em analise',
    badge: 'bg-[#f2fde0] text-[#004521] border-[#c9f485]',
    icon: Search,
    panel: '#f6fee9',
    border: '#c9f485',
    accent: '#01602a',
    subtle: '#356b2e',
  },
  APROVADO: {
    label: 'Aprovado',
    badge: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
    panel: '#eefdf4',
    border: '#b6efc7',
    accent: '#15803d',
    subtle: '#166534',
  },
  REPROVADO: {
    label: 'Reprovado',
    badge: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
    panel: '#fff3f1',
    border: '#fecaca',
    accent: '#dc2626',
    subtle: '#991b1b',
  },
  CANCELADO: {
    label: 'Cancelado',
    badge: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: Ban,
    panel: '#f7f7f8',
    border: '#dfe3e8',
    accent: '#64748b',
    subtle: '#475569',
  },
}

const TYPE_META = {
  COMPRA: {
    label: 'Compra',
    icon: ShoppingBag,
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  ALUGUEL: {
    label: 'Aluguel',
    icon: Car,
    cls: 'bg-[#f2fde0] text-[#004521] border-[#c9f485]',
  },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDENTE
  const Icon = meta.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  )
}

function TypeBadge({ tipo }) {
  const meta = TYPE_META[tipo] || TYPE_META.ALUGUEL
  const Icon = meta.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, tone = 'lime' }) {
  const tones = {
    lime: {
      wrap: { background: '#f2fde0', borderColor: '#c9f485' },
      icon: { background: '#ffffff', color: '#004521' },
      value: '#004521',
      label: '#01602a',
    },
    white: {
      wrap: { background: 'rgba(255,255,255,0.11)', borderColor: 'rgba(255,255,255,0.18)' },
      icon: { background: 'rgba(255,255,255,0.12)', color: '#ffffff' },
      value: '#ffffff',
      label: 'rgba(255,255,255,0.72)',
    },
    amber: {
      wrap: { background: '#fff8eb', borderColor: '#f4d38c' },
      icon: { background: '#ffffff', color: '#d97706' },
      value: '#92400e',
      label: '#b45309',
    },
    green: {
      wrap: { background: '#eefdf4', borderColor: '#b6efc7' },
      icon: { background: '#ffffff', color: '#15803d' },
      value: '#166534',
      label: '#15803d',
    },
  }
  const meta = tones[tone] || tones.lime

  return (
    <div className="rounded-[28px] border p-4 sm:p-5" style={meta.wrap}>
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={meta.icon}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-extrabold" style={{ color: meta.value }}>{value}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: meta.label }}>{label}</p>
        </div>
      </div>
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e8ebdf] bg-[#fbfcf8] px-3.5 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a8f82]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#383838]">{value || '---'}</p>
    </div>
  )
}

function ActionButton({ as: Component = 'button', className = '', children, ...props }) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 transition ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

function OrderCard({
  pedido,
  counterpartLabel,
  canCancel,
  canDelete,
  canDecide,
  onCancel,
  onDelete,
  onApprove,
  onReject,
}) {
  const statusMeta = STATUS_META[pedido.status] || STATUS_META.PENDENTE
  const StatusIcon = statusMeta.icon

  return (
    <article
      className="overflow-hidden rounded-[32px] border bg-white shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.10)]"
      style={{ borderColor: statusMeta.border }}
    >
      <div
        className="px-5 py-4 sm:px-6"
        style={{ background: `linear-gradient(135deg, ${statusMeta.panel} 0%, #ffffff 100%)` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge tipo={pedido.tipoPedido} />
              <StatusBadge status={pedido.status} />
            </div>
            <h2 className="mt-4 text-2xl leading-tight text-[#17331a]" style={{ fontFamily: '"Racing Sans One", sans-serif' }}>
              {pedido.automovelInfo ?? 'Veiculo sem descricao'}
            </h2>
            <p className="mt-1 text-sm text-[#5e5e5e]">
              Ref. {String(pedido.id).padStart(4, '0')} · {pedido.tipoPedido === 'ALUGUEL' ? 'Pedido com periodo definido' : 'Negociacao direta de compra'}
            </p>
          </div>

          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white"
            style={{ borderColor: statusMeta.border, color: statusMeta.accent }}
          >
            <StatusIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <InfoTile label={counterpartLabel} value={pedido.clienteNome ?? pedido.anuncianteNome} />
          <InfoTile
            label={pedido.tipoPedido === 'ALUGUEL' ? 'Periodo' : 'Fluxo'}
            value={pedido.tipoPedido === 'ALUGUEL' ? formatPeriod(pedido) : 'Contato apos aprovacao'}
          />
          <InfoTile
            label="Situacao"
            value={statusMeta.label}
          />
        </div>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div className="rounded-[24px] border border-[#ecefe6] bg-[#fafbf8] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a8f82]">Resumo</p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: statusMeta.subtle }}>
            {pedido.tipoPedido === 'ALUGUEL'
              ? 'Pedido orientado a datas, com acompanhamento rapido do periodo solicitado e do status da analise.'
              : 'Pedido de compra com fluxo direto entre cliente e anunciante depois da aprovacao.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton as={Link} to={`/pedidos/${pedido.id}`} className="btn-primary">
            <Eye className="h-4 w-4" />
            Ver detalhes
          </ActionButton>

          {canCancel && (
            <ActionButton onClick={() => onCancel(pedido)} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
              <XCircle className="h-4 w-4" />
              Cancelar
            </ActionButton>
          )}

          {canDelete && (
            <ActionButton onClick={() => onDelete(pedido)} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              Excluir
            </ActionButton>
          )}

          {canDecide && (
            <ActionButton onClick={() => onReject(pedido)} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
              <XCircle className="h-4 w-4" />
              Recusar
            </ActionButton>
          )}

          {canDecide && (
            <ActionButton onClick={() => onApprove(pedido)} className="btn-secondary border-[#c9f485] bg-[#f2fde0] text-[#004521] hover:bg-[#e8f8ca]">
              <ShieldCheck className="h-4 w-4" />
              Aprovar
            </ActionButton>
          )}
        </div>
      </div>
    </article>
  )
}

function formatDate(date) {
  return date ? new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR') : '---'
}

function formatPeriod(pedido) {
  if (pedido.tipoPedido !== 'ALUGUEL') return 'Negociacao direta'
  return `${formatDate(pedido.dataInicio)} -> ${formatDate(pedido.dataFim)}`
}

export default function PedidoListPage() {
  const { user, isAdmin } = useAuth()
  const [meusPedidos, setMeusPedidos] = useState([])
  const [pedidosRecebidos, setPedidosRecebidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('meus')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [decisionTarget, setDecisionTarget] = useState(null)
  const [decisionStatus, setDecisionStatus] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPedidos()
  }, [])

  async function fetchPedidos() {
    setLoading(true)
    try {
      if (isAdmin) {
        setMeusPedidos(await pedidoApi.getAll())
        setPedidosRecebidos([])
      } else {
        const [meus, recebidos] = await Promise.all([
          pedidoApi.getByCliente(user.id),
          pedidoApi.getByAnunciante(user.id),
        ])
        setMeusPedidos(meus)
        setPedidosRecebidos(recebidos)
      }
    } catch {
      toast.error('Erro ao carregar pedidos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    setSubmitting(true)
    try {
      const updated = await pedidoApi.cancelar(cancelTarget.id)
      setMeusPedidos((prev) => prev.map((pedido) => pedido.id === updated.id ? updated : pedido))
      toast.success('Pedido cancelado.')
      setCancelTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao cancelar.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDecision() {
    setSubmitting(true)
    try {
      const updated = await pedidoApi.atualizarStatus(decisionTarget.id, decisionStatus)
      setPedidosRecebidos((prev) => prev.map((pedido) => pedido.id === updated.id ? updated : pedido))
      toast.success(decisionStatus === 'APROVADO' ? 'Pedido aprovado.' : 'Pedido recusado.')
      setDecisionTarget(null)
      setDecisionStatus(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao decidir pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setSubmitting(true)
    try {
      await pedidoApi.remove(deleteTarget.id)
      setMeusPedidos((prev) => prev.filter((pedido) => pedido.id !== deleteTarget.id))
      setPedidosRecebidos((prev) => prev.filter((pedido) => pedido.id !== deleteTarget.id))
      toast.success('Pedido excluido.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  const dataset = useMemo(() => {
    if (isAdmin) return meusPedidos
    return tab === 'recebidos' ? pedidosRecebidos : meusPedidos
  }, [isAdmin, meusPedidos, pedidosRecebidos, tab])

  const filtered = useMemo(() => (
    dataset.filter((pedido) =>
      `${pedido.automovelInfo ?? ''} ${pedido.status} ${pedido.clienteNome ?? ''} ${pedido.anuncianteNome ?? ''} ${pedido.tipoPedido ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  ), [dataset, search])

  const total = dataset.length
  const pendentes = dataset.filter((pedido) => ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)).length
  const aprovados = dataset.filter((pedido) => pedido.status === 'APROVADO').length
  const counterpartLabel = isAdmin || tab === 'recebidos' ? 'Solicitante' : 'Anunciante'

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section
        className="relative overflow-hidden rounded-[40px] px-6 py-7 sm:px-8 sm:py-8"
        style={{
          background: 'linear-gradient(160deg, #ffffff 0%, #f7f7f7 100%)',
          border: '1px solid #d8d8d8',
          boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
        }}
      >
        <div className="absolute left-[-4%] top-[10%] h-44 w-44 rounded-[48%]" style={{ background: '#96ea55' }} />
        <div className="absolute right-[-6%] top-[18%] h-44 w-44 rounded-[48%]" style={{ background: '#96ea55' }} />
        <div className="absolute right-[24%] top-[-8%] h-52 w-52 rounded-[48%]" style={{ background: '#8fe84c' }} />

        <div className="relative space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f2fde0] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#01602a]">
                <Sparkles className="h-3.5 w-3.5" />
                central de pedidos
              </div>
              <h1 className="mt-4 text-4xl leading-none text-[#004521] sm:text-5xl">Pedidos</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5e5e5e]">
                Acompanhe cada solicitacao com leitura mais direta, mantendo a mesma estrutura de busca, aprovacao, recusa, cancelamento e detalhes.
              </p>
            </div>

            {!isAdmin && (
              <Link to="/pedidos/novo" className="btn-primary">
                <Plus className="h-4 w-4" />
                Novo pedido
              </Link>
            )}
          </div>

          {!isAdmin && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTab('meus')}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${tab === 'meus' ? 'border-[#c9f485] bg-[#78de1f] text-[#004521]' : 'border-[#d6d6d6] bg-white text-[#5e5e5e] hover:bg-[#f5f5f5]'}`}
              >
                Meus pedidos
              </button>
              <button
                type="button"
                onClick={() => setTab('recebidos')}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${tab === 'recebidos' ? 'border-[#c9f485] bg-[#78de1f] text-[#004521]' : 'border-[#d6d6d6] bg-white text-[#5e5e5e] hover:bg-[#f5f5f5]'}`}
              >
                Pedidos recebidos
              </button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard icon={ClipboardList} label="Total" value={total} tone="lime" />
            <StatCard icon={Clock} label="Em aberto" value={pendentes} tone="amber" />
            <StatCard icon={CheckCircle2} label="Aprovados" value={aprovados} tone="green" />
          </div>

          <div className="rounded-[28px] border border-[#dfe4d5] bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919191]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por veiculo, tipo, status ou pessoas..."
                  className="input-field pl-9"
                />
              </div>
              <div className="rounded-2xl border border-[#ecefe6] bg-[#fafbf8] px-4 py-3 text-sm font-medium text-[#5e5e5e]">
                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-[32px] border border-[#d8d8d8] bg-white text-sm text-[#919191] shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          Carregando pedidos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[32px] border border-[#d8d8d8] bg-white px-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#f2fde0]">
            <ClipboardList className="h-10 w-10 text-[#004521]" />
          </div>
          <h2 className="mt-5 text-2xl text-[#004521]">Nenhum pedido encontrado</h2>
          <p className="mt-2 max-w-md text-sm text-[#5e5e5e]">
            Ajuste a busca ou publique uma nova solicitacao para alimentar este painel.
          </p>
          {!search && !isAdmin && tab === 'meus' && (
            <Link to="/pedidos/novo" className="btn-primary mt-5">
              <Plus className="h-4 w-4" />
              Criar primeiro pedido
            </Link>
          )}
        </div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((pedido) => {
            const canCancel = !isAdmin && tab === 'meus' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
            const canDecide = !isAdmin && tab === 'recebidos' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
            const canDelete = isAdmin

            return (
              <OrderCard
                key={pedido.id}
                pedido={pedido}
                counterpartLabel={counterpartLabel}
                canCancel={canCancel}
                canDelete={canDelete}
                canDecide={canDecide}
                onCancel={setCancelTarget}
                onDelete={setDeleteTarget}
                onApprove={(item) => {
                  setDecisionTarget(item)
                  setDecisionStatus('APROVADO')
                }}
                onReject={(item) => {
                  setDecisionTarget(item)
                  setDecisionStatus('REPROVADO')
                }}
              />
            )
          })}
        </section>
      )}

      <ConfirmModal
        isOpen={!!cancelTarget}
        title="Cancelar pedido"
        message={`Deseja cancelar o pedido #${cancelTarget?.id}?`}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
        loading={submitting}
        confirmLabel="Cancelar pedido"
        loadingLabel="Cancelando..."
        tone="danger"
      />
      <ConfirmModal
        isOpen={!!decisionTarget}
        title={decisionStatus === 'APROVADO' ? 'Aprovar pedido' : 'Recusar pedido'}
        message={`Deseja ${decisionStatus === 'APROVADO' ? 'aprovar' : 'recusar'} o pedido #${decisionTarget?.id}?`}
        onConfirm={handleDecision}
        onCancel={() => {
          setDecisionTarget(null)
          setDecisionStatus(null)
        }}
        loading={submitting}
        confirmLabel={decisionStatus === 'APROVADO' ? 'Aprovar' : 'Recusar'}
        loadingLabel="Processando..."
        tone={decisionStatus === 'APROVADO' ? 'primary' : 'danger'}
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir pedido"
        message={`Deseja excluir o pedido #${deleteTarget?.id}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={submitting}
        confirmLabel="Excluir"
        loadingLabel="Excluindo..."
        tone="danger"
      />
    </div>
  )
}
