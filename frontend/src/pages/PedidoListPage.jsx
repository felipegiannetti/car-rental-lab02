import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Plus, Eye, XCircle, Search, Clock, CheckCircle2, Ban } from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  PENDENTE:   { label: 'Pendente',    cls: 'bg-amber-50 text-amber-700 border-amber-200',  icon: Clock },
  EM_ANALISE: { label: 'Em Análise',  cls: 'bg-blue-50 text-blue-700 border-blue-200',     icon: Search },
  APROVADO:   { label: 'Aprovado',    cls: 'bg-green-50 text-green-700 border-green-200',  icon: CheckCircle2 },
  REPROVADO:  { label: 'Reprovado',   cls: 'bg-red-50 text-red-700 border-red-200',        icon: XCircle },
  CANCELADO:  { label: 'Cancelado',   cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: Ban },
}

export function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.PENDENTE
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${m.cls}`}>
      <Icon className="w-3 h-3" /> {m.label}
    </span>
  )
}

function StatCard({ label, value, color, status }) {
  const m = STATUS_META[status] || {}
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    amber:  'bg-amber-50 text-amber-600 border-amber-100',
    green:  'bg-green-50 text-green-600 border-green-100',
    slate:  'bg-slate-50 text-slate-500 border-slate-100',
  }
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${colors[color]}`}>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs font-medium opacity-70">{label}</p>
      </div>
    </div>
  )
}

const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—'

export default function PedidoListPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => { fetchPedidos() }, [])

  async function fetchPedidos() {
    setLoading(true)
    try {
      const data = user ? await pedidoApi.getByCliente(user.id) : await pedidoApi.getAll()
      setPedidos(data)
    } catch { toast.error('Erro ao carregar pedidos.') }
    finally { setLoading(false) }
  }

  async function handleCancel() {
    setCanceling(true)
    try {
      const updated = await pedidoApi.cancelar(cancelTarget.id)
      setPedidos(prev => prev.map(p => p.id === updated.id ? updated : p))
      toast.success('Pedido cancelado.')
      setCancelTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao cancelar.')
    } finally { setCanceling(false) }
  }

  const filtered = pedidos.filter(p =>
    `${p.automovelInfo ?? ''} ${p.status}`.toLowerCase().includes(search.toLowerCase())
  )

  const total = pedidos.length
  const pendentes = pedidos.filter(p => p.status === 'PENDENTE').length
  const aprovados = pedidos.filter(p => p.status === 'APROVADO').length

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Meus Pedidos</h1>
          <p className="text-sm text-slate-400 mt-0.5">Acompanhe o status dos seus pedidos de aluguel</p>
        </div>
        <Link to="/pedidos/novo" className="btn-primary shadow-sm">
          <Plus className="w-4 h-4" /> Novo Pedido
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={total}    color="blue" />
        <StatCard label="Pendentes" value={pendentes} color="amber" />
        <StatCard label="Aprovados" value={aprovados}  color="green" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por veículo, status…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl
                text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-300 text-sm animate-pulse">
            Carregando pedidos…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">Nenhum pedido encontrado.</p>
            {!search && (
              <Link to="/pedidos/novo" className="btn-primary text-xs">
                <Plus className="w-3.5 h-3.5" /> Criar primeiro pedido
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['#', 'Veículo', 'Período', 'Status', 'Data do Pedido', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id}
                      className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group
                        ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                      <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{p.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800 text-sm">{p.automovelInfo ?? '—'}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs font-mono whitespace-nowrap">
                        {fmt(p.dataInicio)} → {fmt(p.dataFim)}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {p.dataCriacao ? new Date(p.dataCriacao).toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/pedidos/${p.id}`}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="Ver detalhes">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {['PENDENTE', 'EM_ANALISE'].includes(p.status) && (
                            <button onClick={() => setCancelTarget(p)}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors" title="Cancelar">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden p-4 space-y-3">
              {filtered.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-800 text-sm">{p.automovelInfo ?? '—'}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{fmt(p.dataInicio)} → {fmt(p.dataFim)}</p>
                  <div className="flex gap-2 pt-2 border-t border-slate-50">
                    <Link to={`/pedidos/${p.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50
                        hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors">
                      <Eye className="w-3.5 h-3.5" /> Ver
                    </Link>
                    {['PENDENTE', 'EM_ANALISE'].includes(p.status) && (
                      <button onClick={() => setCancelTarget(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50
                          hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!cancelTarget}
        title="Cancelar pedido"
        message={`Deseja cancelar o pedido #${cancelTarget?.id} (${cancelTarget?.automovelInfo})? Esta ação não pode ser desfeita.`}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
        loading={canceling}
      />
    </div>
  )
}
