import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Car, Plus, Search, Pencil, Trash2, ClipboardList, Gauge, CheckCircle2, HandCoins, XCircle } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  DISPONIVEL: { label: 'Disponivel', cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  EM_USO: { label: 'Em uso', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Car },
  EM_NEGOCIACAO: { label: 'Em negociacao', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: HandCoins },
  INDISPONIVEL: { label: 'Indisponivel', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.DISPONIVEL
  const Icon = meta.icon
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.cls}`}><Icon className="w-3 h-3" /> {meta.label}</span>
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  }
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${colors[color]}`}>
      <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm shrink-0"><Icon className="w-5 h-5" /></div>
      <div><p className="text-2xl font-bold">{value}</p><p className="text-xs font-medium opacity-70">{label}</p></div>
    </div>
  )
}

export default function MeusAnunciosPage() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [automoveis, setAutomoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchAutomoveis()
  }, [user])

  async function fetchAutomoveis() {
    setLoading(true)
    try {
      const all = await automovelApi.getAll()
      setAutomoveis(all.filter((automovel) => automovel.anuncianteId === user.id))
    } catch {
      toast.error('Erro ao carregar seus anuncios.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await automovelApi.remove(deleteTarget.id)
      setAutomoveis((prev) => prev.filter((automovel) => automovel.id !== deleteTarget.id))
      toast.success('Anuncio excluido.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir anuncio.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = useMemo(
    () => automoveis.filter((automovel) =>
      `${automovel.marca} ${automovel.modelo} ${automovel.placa} ${automovel.matricula}`.toLowerCase().includes(search.toLowerCase())
    ),
    [automoveis, search]
  )

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/automoveis" replace />

  const disponiveis = automoveis.filter((automovel) => automovel.statusAnuncio === 'DISPONIVEL').length
  const negociacao = automoveis.filter((automovel) => automovel.statusAnuncio === 'EM_NEGOCIACAO').length

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Meus anuncios</h1>
          <p className="text-sm text-slate-400 mt-0.5">Acompanhe os carros que voce publicou e acesse os pedidos recebidos.</p>
        </div>
        <Link to="/automoveis/novo" className="btn-primary shadow-sm"><Plus className="w-4 h-4" /> Novo anuncio</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={Car} label="Total publicados" value={automoveis.length} color="blue" />
        <StatCard icon={CheckCircle2} label="Disponiveis" value={disponiveis} color="green" />
        <StatCard icon={HandCoins} label="Em negociacao" value={negociacao} color="amber" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por marca, modelo, placa..." className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all" />
          </div>
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{filtered.length} itens</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-300 animate-pulse">Carregando seus anuncios...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center"><Car className="w-8 h-8 text-slate-300" /></div>
            <p className="text-sm text-slate-400">Voce ainda nao publicou anuncios.</p>
            <Link to="/automoveis/novo" className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" /> Publicar primeiro anuncio</Link>
          </div>
        ) : (
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((automovel) => (
              <div key={automovel.id} className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/automoveis/${automovel.id}`} className="text-lg font-semibold text-slate-900 hover:text-blue-700 transition-colors">
                      {automovel.marca} {automovel.modelo}
                    </Link>
                    <p className="text-sm text-slate-400 mt-1">{automovel.ano} - {automovel.placa}</p>
                  </div>
                  <StatusBadge status={automovel.statusAnuncio} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Matricula</p>
                    <p className="font-medium text-slate-800 mt-1">{automovel.matricula}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Km</p>
                    <p className="font-medium text-slate-800 mt-1 inline-flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-slate-400" /> {Number(automovel.quilometragem ?? 0).toLocaleString('pt-BR')} km</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                  <Link to={`/automoveis/${automovel.id}`} className="btn-secondary text-xs"><Car className="w-3.5 h-3.5" /> Ver anuncio</Link>
                  <Link to={`/automoveis/${automovel.id}/editar`} className="btn-secondary text-xs"><Pencil className="w-3.5 h-3.5" /> Editar</Link>
                  <Link to={`/pedidos-recebidos?automovelId=${automovel.id}`} className="btn-secondary text-xs"><ClipboardList className="w-3.5 h-3.5" /> Ver pedidos</Link>
                  <button onClick={() => setDeleteTarget(automovel)} className="btn-danger text-xs"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir anuncio"
        message={`Deseja excluir "${deleteTarget?.marca} ${deleteTarget?.modelo} (${deleteTarget?.placa})"? Esta acao nao pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        confirmLabel="Excluir"
        loadingLabel="Excluindo..."
        tone="danger"
      />
    </div>
  )
}
