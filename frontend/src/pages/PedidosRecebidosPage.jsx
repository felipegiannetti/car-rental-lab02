import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ClipboardList, Search, CheckCircle2, XCircle, Clock, ShieldCheck, ShoppingBag, Car, Eye, Filter } from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  PENDENTE: { label: 'Pendente', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  EM_ANALISE: { label: 'Em analise', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Search },
  APROVADO: { label: 'Aprovado', cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  REPROVADO: { label: 'Recusado', cls: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDENTE
  const Icon = meta.icon
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.cls}`}><Icon className="w-3 h-3" /> {meta.label}</span>
}

const fmt = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString('pt-BR') : '---'

export default function PedidosRecebidosPage() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const [decisionTarget, setDecisionTarget] = useState(null)
  const [decisionStatus, setDecisionStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const automovelId = searchParams.get('automovelId')

  useEffect(() => {
    if (!user) return
    fetchPedidos()
  }, [user])

  async function fetchPedidos() {
    setLoading(true)
    try {
      setPedidos(await pedidoApi.getByAnunciante(user.id))
    } catch {
      toast.error('Erro ao carregar pedidos recebidos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDecision() {
    setSubmitting(true)
    try {
      const updated = await pedidoApi.atualizarStatus(decisionTarget.id, decisionStatus)
      setPedidos((prev) => prev.map((pedido) => pedido.id === updated.id ? updated : pedido))
      toast.success(decisionStatus === 'APROVADO' ? 'Pedido aprovado.' : 'Pedido recusado.')
      setDecisionTarget(null)
      setDecisionStatus(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao atualizar pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = useMemo(() => {
    return pedidos.filter((pedido) => {
      const matchesSearch = `${pedido.automovelInfo ?? ''} ${pedido.clienteNome ?? ''} ${pedido.tipoPedido ?? ''}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'TODOS' || pedido.status === statusFilter
      const matchesAutomovel = !automovelId || String(pedido.automovelId) === String(automovelId)
      return matchesSearch && matchesStatus && matchesAutomovel
    })
  }, [pedidos, search, statusFilter, automovelId])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/pedidos" replace />

  const pendentes = pedidos.filter((pedido) => ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)).length
  const aprovados = pedidos.filter((pedido) => pedido.status === 'APROVADO').length

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pedidos dos meus anuncios</h1>
          <p className="text-sm text-slate-400 mt-0.5">Aprove ou recuse as solicitacoes relacionadas aos carros que voce publicou.</p>
        </div>
        <Link to="/meus-anuncios" className="btn-secondary"><Car className="w-4 h-4" /> Meus anuncios</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><p className="text-2xl font-bold text-blue-600">{pedidos.length}</p><p className="text-xs text-blue-500 mt-1">Total recebidos</p></div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4"><p className="text-2xl font-bold text-amber-600">{pendentes}</p><p className="text-xs text-amber-500 mt-1">Aguardando decisao</p></div>
        <div className="rounded-2xl border border-green-100 bg-green-50 p-4"><p className="text-2xl font-bold text-green-600">{aprovados}</p><p className="text-xs text-green-500 mt-1">Aprovados</p></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por carro, cliente ou tipo..." className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all" />
          </div>
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="TODOS">Todos os status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="APROVADO">Aprovados</option>
              <option value="REPROVADO">Recusados</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-300 animate-pulse">Carregando pedidos recebidos...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center"><ClipboardList className="w-8 h-8 text-slate-300" /></div>
            <p className="text-sm text-slate-400">Nenhum pedido recebido encontrado.</p>
            {automovelId && <button onClick={() => setSearchParams({})} className="btn-secondary text-xs">Limpar filtro do anuncio</button>}
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-3">
            {filtered.map((pedido) => {
              const canDecide = ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
              return (
                <div key={pedido.id} className="rounded-2xl border border-slate-100 p-4 shadow-sm bg-white">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{pedido.automovelInfo}</p>
                      <p className="text-sm text-slate-400 mt-1">Solicitante: {pedido.clienteNome}</p>
                    </div>
                    <StatusBadge status={pedido.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Tipo</p>
                      <p className="mt-1 font-medium text-slate-800 inline-flex items-center gap-1">{pedido.tipoPedido === 'COMPRA' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}{pedido.tipoPedido}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Periodo</p>
                      <p className="mt-1 font-medium text-slate-800">{pedido.tipoPedido === 'ALUGUEL' ? `${fmt(pedido.dataInicio)} -> ${fmt(pedido.dataFim)}` : 'Negociacao direta'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Contato liberado</p>
                      <p className="mt-1 font-medium text-slate-800">{pedido.tipoPedido === 'COMPRA' && pedido.status === 'APROVADO' ? 'Sim' : 'Aguardando decisao'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-50">
                    <Link to={`/pedidos/${pedido.id}`} className="btn-secondary text-xs"><Eye className="w-3.5 h-3.5" /> Ver detalhes</Link>
                    {canDecide && <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('REPROVADO') }} className="btn-secondary text-xs text-red-600 border-red-200 hover:bg-red-50"><XCircle className="w-3.5 h-3.5" /> Recusar</button>}
                    {canDecide && <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('APROVADO') }} className="btn-primary text-xs"><ShieldCheck className="w-3.5 h-3.5" /> Aprovar</button>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!decisionTarget}
        title={decisionStatus === 'APROVADO' ? 'Aprovar pedido' : 'Recusar pedido'}
        message={decisionStatus === 'APROVADO'
          ? `Ao aprovar ${decisionTarget?.tipoPedido === 'COMPRA' ? 'este pedido de compra' : 'este pedido'}, o solicitante recebera a atualizacao do status${decisionTarget?.tipoPedido === 'COMPRA' ? ' e, no caso de compra, tambem seu nome completo, email e telefone.' : '.'}`
          : 'Deseja recusar este pedido? O solicitante sera notificado.'}
        onConfirm={handleDecision}
        onCancel={() => { setDecisionTarget(null); setDecisionStatus(null) }}
        loading={submitting}
        confirmLabel={decisionStatus === 'APROVADO' ? 'Aprovar' : 'Recusar'}
        loadingLabel="Processando..."
        tone={decisionStatus === 'APROVADO' ? 'primary' : 'danger'}
      />
    </div>
  )
}
