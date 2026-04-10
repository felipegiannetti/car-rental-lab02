import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Plus, Eye, Pencil, Trash2, Search, CheckCircle2, XCircle } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue:  'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    rose:  'bg-rose-50 text-rose-600 border-rose-100',
  }
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 flex items-center gap-4 ${colors[color]}`}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/70 flex items-center justify-center shadow-sm shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold">{value}</p>
        <p className="text-xs font-medium opacity-70">{label}</p>
      </div>
    </div>
  )
}

function DisponiBadge({ disponivel }) {
  return disponivel ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
      <CheckCircle2 className="w-3 h-3" /> Disponível
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
      <XCircle className="w-3 h-3" /> Indisponível
    </span>
  )
}

function MarcaAvatar({ marca }) {
  const colors = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-violet-500 to-purple-600']
  const idx = marca.charCodeAt(0) % colors.length
  return (
    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors[idx]}
      flex items-center justify-center text-white font-bold text-sm shadow shrink-0`}>
      {marca.charAt(0).toUpperCase()}
    </div>
  )
}

export default function AutomovelListPage() {
  const [automoveis, setAutomoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchAutomoveis() }, [])

  async function fetchAutomoveis() {
    setLoading(true)
    try { setAutomoveis(await automovelApi.getAll()) }
    catch { toast.error('Erro ao carregar automóveis.') }
    finally { setLoading(false) }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await automovelApi.remove(deleteTarget.id)
      setAutomoveis(prev => prev.filter(a => a.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.marca} ${deleteTarget.modelo}" removido.`)
      setDeleteTarget(null)
    } catch { toast.error('Erro ao excluir.') }
    finally { setDeleting(false) }
  }

  const filtered = automoveis.filter(a =>
    `${a.marca} ${a.modelo} ${a.placa} ${a.matricula}`.toLowerCase().includes(search.toLowerCase())
  )

  const disponiveis = automoveis.filter(a => a.disponivel).length

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Automóveis</h1>
          <p className="text-sm text-slate-400 mt-0.5">Gerencie a frota de veículos disponíveis</p>
        </div>
        <Link to="/automoveis/novo" className="btn-primary shadow-sm">
          <Plus className="w-4 h-4" /> Novo Automóvel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Car}         label="Total de Veículos"  value={automoveis.length} color="blue" />
        <StatCard icon={CheckCircle2} label="Disponíveis"        value={disponiveis}       color="green" />
        <StatCard icon={XCircle}      label="Indisponíveis"      value={automoveis.length - disponiveis} color="rose" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por marca, modelo, placa…"
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
            Carregando automóveis…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Car className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">Nenhum automóvel encontrado.</p>
            {!search && (
              <Link to="/automoveis/novo" className="btn-primary text-xs">
                <Plus className="w-3.5 h-3.5" /> Cadastrar primeiro automóvel
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  {['#', 'Veículo', 'Placa', 'Matrícula', 'Ano', 'Status', ''].map(h => (
                    <th key={h} className={`px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${h === '' ? 'text-center' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id}
                    className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group
                      ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{a.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <MarcaAvatar marca={a.marca} />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{a.marca} {a.modelo}</p>
                          <p className="text-xs text-slate-400">{a.ano}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 text-sm font-semibold">{a.placa}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-sm font-mono">{a.matricula}</td>
                    <td className="px-5 py-3.5 text-slate-600 text-sm">{a.ano}</td>
                    <td className="px-5 py-3.5"><DisponiBadge disponivel={a.disponivel} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/automoveis/${a.id}/editar`}
                          className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteTarget(a)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir automóvel"
        message={`Deseja excluir "${deleteTarget?.marca} ${deleteTarget?.modelo} (${deleteTarget?.placa})"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
