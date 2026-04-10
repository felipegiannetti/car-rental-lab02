import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Plus, Eye, XCircle, Search, Clock, CheckCircle2, Ban, User, ShieldCheck, ShoppingBag, Car, Trash2 } from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  PENDENTE: { label: 'Pendente', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  EM_ANALISE: { label: 'Em analise', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Search },
  APROVADO: { label: 'Aprovado', cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  REPROVADO: { label: 'Reprovado', cls: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  CANCELADO: { label: 'Cancelado', cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: Ban },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDENTE
  const Icon = meta.icon
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.cls}`}><Icon className="w-3 h-3" /> {meta.label}</span>
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  }
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${colors[color]}`}>
      <div><p className="text-2xl font-bold">{value}</p><p className="text-xs font-medium opacity-70">{label}</p></div>
    </div>
  )
}

const fmt = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString('pt-BR') : '---'

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

  useEffect(() => { fetchPedidos() }, [])

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
      setMeusPedidos(prev => prev.map((pedido) => pedido.id === updated.id ? updated : pedido))
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
      setPedidosRecebidos(prev => prev.map((pedido) => pedido.id === updated.id ? updated : pedido))
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
      setMeusPedidos(prev => prev.filter((pedido) => pedido.id !== deleteTarget.id))
      setPedidosRecebidos(prev => prev.filter((pedido) => pedido.id !== deleteTarget.id))
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

  const filtered = dataset.filter((pedido) =>
    `${pedido.automovelInfo ?? ''} ${pedido.status} ${pedido.clienteNome ?? ''} ${pedido.anuncianteNome ?? ''} ${pedido.tipoPedido ?? ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const total = dataset.length
  const pendentes = dataset.filter((pedido) => pedido.status === 'PENDENTE').length
  const aprovados = dataset.filter((pedido) => pedido.status === 'APROVADO').length

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pedidos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{isAdmin ? 'Acompanhe e gerencie todas as solicitacoes do sistema' : 'Gerencie os pedidos que voce fez e os que chegaram para seus anuncios'}</p>
        </div>
        {!isAdmin && <Link to="/pedidos/novo" className="btn-primary shadow-sm"><Plus className="w-4 h-4" /> Novo pedido</Link>}
      </div>

      {!isAdmin && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTab('meus')} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${tab === 'meus' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>Meus pedidos</button>
          <button onClick={() => setTab('recebidos')} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${tab === 'recebidos' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>Pedidos recebidos</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={total} color="blue" />
        <StatCard label="Pendentes" value={pendentes} color="amber" />
        <StatCard label="Aprovados" value={aprovados} color="green" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por veiculo, status ou pessoas..." className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all" />
          </div>
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-300 text-sm animate-pulse">Carregando pedidos...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center"><ClipboardList className="w-8 h-8 text-slate-300" /></div>
            <p className="text-sm text-slate-400">Nenhum pedido encontrado.</p>
            {!search && !isAdmin && tab === 'meus' && <Link to="/pedidos/novo" className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" /> Criar primeiro pedido</Link>}
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['#', 'Tipo', 'Veiculo', isAdmin || tab === 'recebidos' ? 'Solicitante' : 'Anunciante', 'Periodo', 'Status', ''].map((header) => <th key={header} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pedido, index) => {
                    const canCancel = !isAdmin && tab === 'meus' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
                    const canDecide = !isAdmin && tab === 'recebidos' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
                    const canDelete = isAdmin
                    return (
                      <tr key={pedido.id} className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group ${index % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                        <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{pedido.id}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                            {pedido.tipoPedido === 'COMPRA' ? <ShoppingBag className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                            {pedido.tipoPedido}
                          </span>
                        </td>
                        <td className="px-5 py-3.5"><p className="font-semibold text-slate-800 text-sm">{pedido.automovelInfo ?? '---'}</p></td>
                        <td className="px-5 py-3.5 text-slate-600 text-sm"><span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-300" />{isAdmin || tab === 'recebidos' ? pedido.clienteNome : pedido.anuncianteNome}</span></td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs font-mono whitespace-nowrap">{pedido.tipoPedido === 'ALUGUEL' ? `${fmt(pedido.dataInicio)} -> ${fmt(pedido.dataFim)}` : 'Negociacao direta'}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={pedido.status} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/pedidos/${pedido.id}`} className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="Ver detalhes"><Eye className="w-4 h-4" /></Link>
                            {canCancel && <button onClick={() => setCancelTarget(pedido)} className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors" title="Cancelar"><XCircle className="w-4 h-4" /></button>}
                            {canDelete && <button onClick={() => setDeleteTarget(pedido)} className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>}
                            {canDecide && <>
                              <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('REPROVADO') }} className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors" title="Recusar"><XCircle className="w-4 h-4" /></button>
                              <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('APROVADO') }} className="p-1.5 rounded-lg hover:bg-green-100 text-slate-400 hover:text-green-600 transition-colors" title="Aprovar"><ShieldCheck className="w-4 h-4" /></button>
                            </>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden p-4 space-y-3">
              {filtered.map((pedido) => {
                const canCancel = !isAdmin && tab === 'meus' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
                const canDecide = !isAdmin && tab === 'recebidos' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
                const canDelete = isAdmin
                return (
                  <div key={pedido.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{pedido.automovelInfo ?? '---'}</p>
                        <p className="text-xs text-slate-400 mt-1">{isAdmin || tab === 'recebidos' ? pedido.clienteNome : pedido.anuncianteNome}</p>
                      </div>
                      <StatusBadge status={pedido.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{pedido.tipoPedido}</span>
                      <span>{pedido.tipoPedido === 'ALUGUEL' ? `${fmt(pedido.dataInicio)} -> ${fmt(pedido.dataFim)}` : 'Negociacao direta'}</span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                      <Link to={`/pedidos/${pedido.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors"><Eye className="w-3.5 h-3.5" /> Ver</Link>
                      {canDelete && <button onClick={() => setDeleteTarget(pedido)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>}
                      {canCancel && <button onClick={() => setCancelTarget(pedido)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors"><XCircle className="w-3.5 h-3.5" /> Cancelar</button>}
                      {canDecide && <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('APROVADO') }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-green-50 text-slate-500 hover:text-green-600 text-xs font-medium transition-colors"><ShieldCheck className="w-3.5 h-3.5" /> Aprovar</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!cancelTarget}
        title="Cancelar pedido"
        message={`Deseja cancelar o pedido #${cancelTarget?.id}? Esta acao nao pode ser desfeita.`}
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
        onCancel={() => { setDecisionTarget(null); setDecisionStatus(null) }}
        loading={submitting}
        confirmLabel={decisionStatus === 'APROVADO' ? 'Aprovar' : 'Recusar'}
        loadingLabel="Processando..."
        tone={decisionStatus === 'APROVADO' ? 'primary' : 'danger'}
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir pedido"
        message={`Deseja excluir o pedido #${deleteTarget?.id}? Esta acao nao pode ser desfeita.`}
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
