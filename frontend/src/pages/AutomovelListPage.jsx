import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Plus, Pencil, Trash2, Search, CheckCircle2, XCircle, User, Gauge, HandCoins, Filter, KeyRound, ShoppingBag, RotateCcw, CalendarRange } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STATUS_META = {
  DISPONIVEL: { label: 'Disponivel', cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  EM_USO: { label: 'Em uso', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Car },
  EM_NEGOCIACAO: { label: 'Em negociacao', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: HandCoins },
  INDISPONIVEL: { label: 'Indisponivel', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  }
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 flex items-center gap-4 ${colors[color]}`}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/70 flex items-center justify-center shadow-sm shrink-0"><Icon className="w-5 h-5" /></div>
      <div><p className="text-xl sm:text-2xl font-bold">{value}</p><p className="text-xs font-medium opacity-70">{label}</p></div>
    </div>
  )
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.DISPONIVEL
  const Icon = meta.icon
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${meta.cls}`}><Icon className="w-3 h-3" /> {meta.label}</span>
}

function CarThumb({ automovel }) {
  if (automovel.temFoto) {
    return <img src={`${automovelApi.fotoUrl(automovel.id)}?t=${automovel.id}`} alt={`${automovel.marca} ${automovel.modelo}`} className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0" />
  }
  const colors = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-violet-500 to-purple-600']
  const idx = automovel.marca.charCodeAt(0) % colors.length
  return <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-bold text-lg shadow shrink-0`}>{automovel.marca.charAt(0).toUpperCase()}</div>
}

function ModeBadge({ automovel }) {
  return (
    <div className="flex flex-wrap gap-1">
      {automovel.aceitaAluguel && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700"><KeyRound className="w-3 h-3" /> Aluguel</span>}
      {automovel.aceitaCompra && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700"><ShoppingBag className="w-3 h-3" /> Compra</span>}
    </div>
  )
}

export default function AutomovelListPage() {
  const { user, isAdmin, isAuthenticated } = useAuth()
  const [automoveis, setAutomoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [marca, setMarca] = useState('')
  const [maxKm, setMaxKm] = useState('')
  const [anoMin, setAnoMin] = useState('')
  const [anoMax, setAnoMax] = useState('')
  const [modalidade, setModalidade] = useState('TODOS')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchAutomoveis() }, [])

  async function fetchAutomoveis() {
    setLoading(true)
    try { setAutomoveis(await automovelApi.getAll()) }
    catch { toast.error('Erro ao carregar automoveis.') }
    finally { setLoading(false) }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await automovelApi.remove(deleteTarget.id)
      setAutomoveis(prev => prev.filter((automovel) => automovel.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.marca} ${deleteTarget.modelo}" removido.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir.')
    } finally {
      setDeleting(false)
    }
  }

  function resetFilters() {
    setSearch('')
    setMarca('')
    setMaxKm('')
    setAnoMin('')
    setAnoMax('')
    setModalidade('TODOS')
  }

  const marcas = [...new Set(automoveis.map((automovel) => automovel.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b))

  const filtered = automoveis.filter((automovel) => {
    const searchable = `${automovel.marca} ${automovel.modelo} ${automovel.placa} ${automovel.matricula} ${automovel.anuncianteNome ?? ''}`.toLowerCase()
    if (!searchable.includes(search.toLowerCase())) return false
    if (marca && automovel.marca !== marca) return false
    if (maxKm && Number(automovel.quilometragem ?? 0) > Number(maxKm)) return false
    if (anoMin && Number(automovel.ano) < Number(anoMin)) return false
    if (anoMax && Number(automovel.ano) > Number(anoMax)) return false
    if (modalidade === 'ALUGUEL' && !automovel.aceitaAluguel) return false
    if (modalidade === 'COMPRA' && !automovel.aceitaCompra) return false
    if (modalidade === 'AMBOS' && (!automovel.aceitaAluguel || !automovel.aceitaCompra)) return false
    return true
  })

  const disponiveis = automoveis.filter((automovel) => automovel.statusAnuncio === 'DISPONIVEL').length

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Automoveis</h1>
          <p className="text-sm text-slate-400 mt-0.5">{isAdmin ? 'Gerencie os anuncios e a frota anunciada no sistema' : 'Explore os carros publicados pelos usuarios'}</p>
        </div>
        {isAuthenticated && <Link to="/automoveis/novo" className="btn-primary shadow-sm"><Plus className="w-4 h-4" /> Novo anuncio</Link>}
      </div>

      {!isAuthenticated && <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">Voce pode navegar pelos anuncios sem login. Clientes autenticados podem cadastrar novos carros no sistema.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Car} label="Total de anuncios" value={automoveis.length} color="blue" />
        <StatCard icon={CheckCircle2} label="Disponiveis" value={disponiveis} color="green" />
        <StatCard icon={XCircle} label="Ocupados / indisponiveis" value={automoveis.length - disponiveis} color="rose" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por marca, modelo, placa ou anunciante..." className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all" />
          </div>
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</span>
        </div>

        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 bg-slate-50/40">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Filter className="w-4 h-4 text-slate-400" />
              Filtrar anuncios
            </div>
            <button type="button" onClick={resetFilters} className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            <select value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas as marcas</option>
              {marcas.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <div className="relative">
              <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input value={maxKm} onChange={(e) => setMaxKm(e.target.value)} type="number" min="0" placeholder="Ate quantos km?" className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative">
              <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input value={anoMin} onChange={(e) => setAnoMin(e.target.value)} type="number" min="1950" placeholder="Ano minimo" className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative">
              <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input value={anoMax} onChange={(e) => setAnoMax(e.target.value)} type="number" min="1950" placeholder="Ano maximo" className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={modalidade} onChange={(e) => setModalidade(e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="TODOS">Compra e aluguel</option>
              <option value="ALUGUEL">Aceita aluguel</option>
              <option value="COMPRA">Aceita compra</option>
              <option value="AMBOS">Aceita ambos</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-300 text-sm animate-pulse">Carregando automoveis...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center"><Car className="w-8 h-8 text-slate-300" /></div>
            <p className="text-sm text-slate-400">Nenhum automovel encontrado.</p>
            {!search && isAuthenticated && <Link to="/automoveis/novo" className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" /> Publicar primeiro anuncio</Link>}
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['#', 'Veiculo', 'Placa', 'Km / modalidades', 'Anunciante', 'Status', ''].map((header) => <th key={header} className={`px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${header === '' ? 'text-center' : ''}`}>{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((automovel, index) => {
                    const canEdit = !!user && (isAdmin || automovel.anuncianteId === user.id)
                    const canDelete = canEdit
                    return (
                      <tr key={automovel.id} className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group ${index % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                        <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{automovel.id}</td>
                        <td className="px-5 py-3.5">
                          <Link to={`/automoveis/${automovel.id}`} className="flex items-center gap-3">
                            <CarThumb automovel={automovel} />
                            <div>
                              <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{automovel.marca} {automovel.modelo}</p>
                              <p className="text-xs text-slate-400">{automovel.ano}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-600 text-sm font-semibold">{automovel.placa}</td>
                        <td className="px-5 py-3.5 text-slate-500 text-sm">
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-slate-300" />{Number(automovel.quilometragem ?? 0).toLocaleString('pt-BR')} km</span>
                            <ModeBadge automovel={automovel} />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 text-sm"><span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-300" />{automovel.anuncianteNome || 'Sistema'}</span></td>
                        <td className="px-5 py-3.5"><StatusBadge status={automovel.statusAnuncio} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canEdit && <Link to={`/automoveis/${automovel.id}/editar`} className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors" title="Editar"><Pencil className="w-4 h-4" /></Link>}
                            {canDelete && <button onClick={() => setDeleteTarget(automovel)} className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden p-4 space-y-3">
              {filtered.map((automovel) => {
                const canEdit = !!user && (isAdmin || automovel.anuncianteId === user.id)
                const canDelete = canEdit
                return (
                  <div key={automovel.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <Link to={`/automoveis/${automovel.id}`} className="flex items-center gap-3">
                      <CarThumb automovel={automovel} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{automovel.marca} {automovel.modelo}</p>
                        <p className="text-xs text-slate-400 truncate">{automovel.anuncianteNome || 'Sistema'}</p>
                      </div>
                      <StatusBadge status={automovel.statusAnuncio} />
                    </Link>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{automovel.placa}</span>
                      <span>{Number(automovel.quilometragem ?? 0).toLocaleString('pt-BR')} km</span>
                    </div>
                    <div className="mt-2">
                      <ModeBadge automovel={automovel} />
                    </div>
                    {(canEdit || canDelete) && (
                      <div className="mt-3 flex gap-2 pt-3 border-t border-slate-50">
                        {canEdit && <Link to={`/automoveis/${automovel.id}/editar`} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 text-xs font-medium transition-colors"><Pencil className="w-3.5 h-3.5" /> Editar</Link>}
                        {canDelete && <button onClick={() => setDeleteTarget(automovel)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
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
