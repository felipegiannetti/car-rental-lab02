import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Plus, Eye, XCircle, Search, Clock, CheckCircle2, Ban, User, ShieldCheck, ShoppingBag, Car, Trash2 } from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  PENDENTE:   { label: 'Pendente',   cls: 'bg-amber-50 text-amber-700 border-amber-200',   icon: Clock },
  EM_ANALISE: { label: 'Em analise', cls: 'bg-[#f2fde0] text-[#004521] border-[#c9f485]', icon: Search },
  APROVADO:   { label: 'Aprovado',   cls: 'bg-green-50 text-green-700 border-green-200',   icon: CheckCircle2 },
  REPROVADO:  { label: 'Reprovado',  cls: 'bg-red-50 text-red-700 border-red-200',         icon: XCircle },
  CANCELADO:  { label: 'Cancelado',  cls: 'bg-slate-100 text-slate-500 border-slate-200',  icon: Ban },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDENTE
  const Icon = meta.icon
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.cls}`}><Icon className="w-3 h-3" /> {meta.label}</span>
}

function StatCard({ label, value, color }) {
  const colors = {
    blue:  { wrap: 'border-[#c9f485] bg-[#f2fde0]', text: 'text-[#004521]' },
    amber: { wrap: 'border-amber-200 bg-amber-50',   text: 'text-amber-700' },
    green: { wrap: 'border-green-200 bg-green-50',   text: 'text-green-700' },
  }
  const c = colors[color] ?? colors.blue
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${c.wrap}`}>
      <div className={c.text}><p className="text-2xl font-bold">{value}</p><p className="text-xs font-medium opacity-70">{label}</p></div>
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
    } catch { toast.error('Erro ao carregar pedidos.') }
    finally { setLoading(false) }
  }

  async function handleCancel() {
    setSubmitting(true)
    try {
      const updated = await pedidoApi.cancelar(cancelTarget.id)
      setMeusPedidos(prev => prev.map((p) => p.id === updated.id ? updated : p))
      toast.success('Pedido cancelado.')
      setCancelTarget(null)
    } catch (err) { toast.error(err.response?.data?.message ?? 'Erro ao cancelar.') }
    finally { setSubmitting(false) }
  }

  async function handleDecision() {
    setSubmitting(true)
    try {
      const updated = await pedidoApi.atualizarStatus(decisionTarget.id, decisionStatus)
      setPedidosRecebidos(prev => prev.map((p) => p.id === updated.id ? updated : p))
      toast.success(decisionStatus === 'APROVADO' ? 'Pedido aprovado.' : 'Pedido recusado.')
      setDecisionTarget(null)
      setDecisionStatus(null)
    } catch (err) { toast.error(err.response?.data?.message ?? 'Erro ao decidir pedido.') }
    finally { setSubmitting(false) }
  }

  async function handleDelete() {
    setSubmitting(true)
    try {
      await pedidoApi.remove(deleteTarget.id)
      setMeusPedidos(prev => prev.filter((p) => p.id !== deleteTarget.id))
      setPedidosRecebidos(prev => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('Pedido excluido.')
      setDeleteTarget(null)
    } catch (err) { toast.error(err.response?.data?.message ?? 'Erro ao excluir pedido.') }
    finally { setSubmitting(false) }
  }

  const dataset = useMemo(() => {
    if (isAdmin) return meusPedidos
    return tab === 'recebidos' ? pedidosRecebidos : meusPedidos
  }, [isAdmin, meusPedidos, pedidosRecebidos, tab])

  const filtered = dataset.filter((p) =>
    `${p.automovelInfo ?? ''} ${p.status} ${p.clienteNome ?? ''} ${p.anuncianteNome ?? ''} ${p.tipoPedido ?? ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const total    = dataset.length
  const pendentes = dataset.filter((p) => p.status === 'PENDENTE').length
  const aprovados = dataset.filter((p) => p.status === 'APROVADO').length

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#383838]">Pedidos</h1>
          <p className="text-sm text-[#5e5e5e] mt-0.5">{isAdmin ? 'Acompanhe e gerencie todas as solicitacoes do sistema' : 'Gerencie os pedidos que voce fez e os que chegaram para seus anuncios'}</p>
        </div>
        {!isAdmin && <Link to="/pedidos/novo" className="btn-primary"><Plus className="w-4 h-4" /> Novo pedido</Link>}
      </div>

      {!isAdmin && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTab('meus')}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition-all ${tab === 'meus' ? 'text-[#004521] border-[#c9f485]' : 'bg-white text-[#5e5e5e] border-[#d6d6d6] hover:bg-[#f5f5f5]'}`}
            style={tab === 'meus' ? { background: '#78de1f' } : {}}
          >
            Meus pedidos
          </button>
          <button
            onClick={() => setTab('recebidos')}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition-all ${tab === 'recebidos' ? 'text-[#004521] border-[#c9f485]' : 'bg-white text-[#5e5e5e] border-[#d6d6d6] hover:bg-[#f5f5f5]'}`}
            style={tab === 'recebidos' ? { background: '#78de1f' } : {}}
          >
            Pedidos recebidos
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={total} color="blue" />
        <StatCard label="Pendentes" value={pendentes} color="amber" />
        <StatCard label="Aprovados" value={aprovados} color="green" />
      </div>

      <div className="bg-white rounded-2xl border border-[#d6d6d6] overflow-hidden" style={{ boxShadow: '0 2px 4px 1px rgba(15,23,42,0.06)' }}>
        <div className="px-4 sm:px-5 py-4 border-b border-[#efefef] flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#919191]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por veiculo, status ou pessoas..." className="input-field pl-9" />
          </div>
          <span className="text-xs text-[#5e5e5e] ml-auto whitespace-nowrap">{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#919191] text-sm animate-pulse">Carregando pedidos...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#f5f5f5] flex items-center justify-center"><ClipboardList className="w-8 h-8 text-[#d6d6d6]" /></div>
            <p className="text-sm text-[#5e5e5e]">Nenhum pedido encontrado.</p>
            {!search && !isAdmin && tab === 'meus' && <Link to="/pedidos/novo" className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" /> Criar primeiro pedido</Link>}
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#efefef]">
                    {['#', 'Tipo', 'Veículo', isAdmin || tab === 'recebidos' ? 'Solicitante' : 'Anunciante', 'Período', 'Status', ''].map((header) => (
                      <th key={header} className="px-5 py-3 text-left text-xs font-semibold text-[#919191] uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pedido, index) => {
                    const canCancel = !isAdmin && tab === 'meus' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
                    const canDecide = !isAdmin && tab === 'recebidos' && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
                    const canDelete = isAdmin
                    return (
                      <tr key={pedido.id} className={`border-b border-[#f0f0f0] hover:bg-[#f9fef0] transition-colors group ${index % 2 === 1 ? 'bg-[#fafafa]' : ''}`}>
                        <td className="px-5 py-3.5 text-[#d6d6d6] font-mono text-xs">{pedido.id}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-[#f5f5f5] text-[#5e5e5e]">
                            {pedido.tipoPedido === 'COMPRA' ? <ShoppingBag className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                            {pedido.tipoPedido}
                          </span>
                        </td>
                        <td className="px-5 py-3.5"><p className="font-semibold text-[#383838] text-sm">{pedido.automovelInfo ?? '---'}</p></td>
                        <td className="px-5 py-3.5 text-[#5e5e5e] text-sm"><span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#d6d6d6]" />{isAdmin || tab === 'recebidos' ? pedido.clienteNome : pedido.anuncianteNome}</span></td>
                        <td className="px-5 py-3.5 text-[#919191] text-xs font-mono whitespace-nowrap">{pedido.tipoPedido === 'ALUGUEL' ? `${fmt(pedido.dataInicio)} → ${fmt(pedido.dataFim)}` : 'Negociacao direta'}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={pedido.status} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/pedidos/${pedido.id}`} className="p-1.5 rounded-lg hover:bg-[#f2fde0] text-[#919191] hover:text-[#004521] transition-colors" title="Ver detalhes"><Eye className="w-4 h-4" /></Link>
                            {canCancel && <button onClick={() => setCancelTarget(pedido)} className="p-1.5 rounded-lg hover:bg-red-100 text-[#919191] hover:text-red-600 transition-colors" title="Cancelar"><XCircle className="w-4 h-4" /></button>}
                            {canDelete && <button onClick={() => setDeleteTarget(pedido)} className="p-1.5 rounded-lg hover:bg-red-100 text-[#919191] hover:text-red-600 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>}
                            {canDecide && <>
                              <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('REPROVADO') }} className="p-1.5 rounded-lg hover:bg-red-100 text-[#919191] hover:text-red-600 transition-colors" title="Recusar"><XCircle className="w-4 h-4" /></button>
                              <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('APROVADO') }} className="p-1.5 rounded-lg hover:bg-[#f2fde0] text-[#919191] hover:text-[#004521] transition-colors" title="Aprovar"><ShieldCheck className="w-4 h-4" /></button>
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
                  <div key={pedido.id} className="bg-white rounded-xl border border-[#d6d6d6] p-4 space-y-3" style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#383838] text-sm">{pedido.automovelInfo ?? '---'}</p>
                        <p className="text-xs text-[#919191] mt-1">{isAdmin || tab === 'recebidos' ? pedido.clienteNome : pedido.anuncianteNome}</p>
                      </div>
                      <StatusBadge status={pedido.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#5e5e5e]">
                      <span>{pedido.tipoPedido}</span>
                      <span>{pedido.tipoPedido === 'ALUGUEL' ? `${fmt(pedido.dataInicio)} → ${fmt(pedido.dataFim)}` : 'Negociacao direta'}</span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-[#f0f0f0]">
                      <Link to={`/pedidos/${pedido.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#f5f5f5] hover:bg-[#f2fde0] text-[#5e5e5e] hover:text-[#004521] text-xs font-medium transition-colors"><Eye className="w-3.5 h-3.5" /> Ver</Link>
                      {canDelete && <button onClick={() => setDeleteTarget(pedido)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#f5f5f5] hover:bg-red-50 text-[#5e5e5e] hover:text-red-600 text-xs font-medium transition-colors"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>}
                      {canCancel && <button onClick={() => setCancelTarget(pedido)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#f5f5f5] hover:bg-red-50 text-[#5e5e5e] hover:text-red-600 text-xs font-medium transition-colors"><XCircle className="w-3.5 h-3.5" /> Cancelar</button>}
                      {canDecide && <button onClick={() => { setDecisionTarget(pedido); setDecisionStatus('APROVADO') }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#f5f5f5] hover:bg-[#f2fde0] text-[#5e5e5e] hover:text-[#004521] text-xs font-medium transition-colors"><ShieldCheck className="w-3.5 h-3.5" /> Aprovar</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <ConfirmModal isOpen={!!cancelTarget} title="Cancelar pedido" message={`Deseja cancelar o pedido #${cancelTarget?.id}?`} onConfirm={handleCancel} onCancel={() => setCancelTarget(null)} loading={submitting} confirmLabel="Cancelar pedido" loadingLabel="Cancelando..." tone="danger" />
      <ConfirmModal isOpen={!!decisionTarget} title={decisionStatus === 'APROVADO' ? 'Aprovar pedido' : 'Recusar pedido'} message={`Deseja ${decisionStatus === 'APROVADO' ? 'aprovar' : 'recusar'} o pedido #${decisionTarget?.id}?`} onConfirm={handleDecision} onCancel={() => { setDecisionTarget(null); setDecisionStatus(null) }} loading={submitting} confirmLabel={decisionStatus === 'APROVADO' ? 'Aprovar' : 'Recusar'} loadingLabel="Processando..." tone={decisionStatus === 'APROVADO' ? 'primary' : 'danger'} />
      <ConfirmModal isOpen={!!deleteTarget} title="Excluir pedido" message={`Deseja excluir o pedido #${deleteTarget?.id}?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={submitting} confirmLabel="Excluir" loadingLabel="Excluindo..." tone="danger" />
    </div>
  )
}
