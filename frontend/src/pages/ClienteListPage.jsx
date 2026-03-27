import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clienteApi } from '../api/clienteApi'
import ConfirmModal from '../components/ConfirmModal'
import { displayCPF } from '../utils/masks'
import {
  Users, Plus, Eye, Pencil, Trash2, Search,
  UserCheck, UserX,
} from 'lucide-react'
import toast from 'react-hot-toast'

function Avatar({ cliente }) {
  if (cliente.temFoto) {
    return (
      <img
        src={clienteApi.fotoUrl(cliente.id)}
        alt={cliente.nome}
        className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow shrink-0"
      />
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
      flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow shrink-0">
      {(cliente.nome ?? '?').charAt(0).toUpperCase()}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue:  'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
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

/* Card view for each client on mobile */
function ClienteCard({ c, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar cliente={c} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{c.nome}</p>
          <p className="text-xs text-slate-400 truncate">@{c.nomeUsuario}</p>
        </div>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${c.rendas?.length > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
          {c.rendas?.length ?? 0}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono">{displayCPF(c.cpf)}</span>
        <span className="truncate ml-2">{c.profissao || '—'}</span>
      </div>
      <div className="mt-3 flex gap-2 pt-3 border-t border-slate-50">
        <Link to={`/clientes/${c.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50
            hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors">
          <Eye className="w-3.5 h-3.5" /> Ver
        </Link>
        <Link to={`/clientes/${c.id}/editar`}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50
            hover:bg-amber-50 text-slate-500 hover:text-amber-600 text-xs font-medium transition-colors">
          <Pencil className="w-3.5 h-3.5" /> Editar
        </Link>
        <button onClick={() => onDelete(c)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50
            hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Excluir
        </button>
      </div>
    </div>
  )
}

export default function ClienteListPage() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchClientes() }, [])

  async function fetchClientes() {
    setLoading(true)
    try { setClientes(await clienteApi.getAll()) }
    catch { toast.error('Erro ao carregar clientes.') }
    finally { setLoading(false) }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await clienteApi.remove(deleteTarget.id)
      setClientes(prev => prev.filter(c => c.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.nome}" removido.`)
      setDeleteTarget(null)
    } catch { toast.error('Erro ao excluir.') }
    finally { setDeleting(false) }
  }

  const filtered = clientes.filter(c =>
    `${c.nome} ${c.cpf} ${c.profissao ?? ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const comRenda = clientes.filter(c => c.rendas?.length > 0).length

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-400 mt-0.5">Gerencie os clientes cadastrados no sistema</p>
        </div>
        <Link to="/clientes/novo" className="btn-primary shadow-sm">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Users}     label="Total de Clientes"    value={clientes.length} color="blue" />
        <StatCard icon={UserCheck} label="Com Renda Cadastrada" value={comRenda}         color="green" />
        <StatCard icon={UserX}     label="Sem Renda"            value={clientes.length - comRenda} color="amber" />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, CPF…"
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
            Carregando clientes…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">Nenhum cliente encontrado.</p>
            {!search && (
              <Link to="/clientes/novo" className="btn-primary text-xs">
                <Plus className="w-3.5 h-3.5" /> Cadastrar primeiro cliente
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['#', 'Cliente', 'CPF', 'Profissão', 'Rendas', ''].map(h => (
                      <th key={h} className={`px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${h === '' ? 'text-center' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id}
                      className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group
                        ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                      <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{c.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar cliente={c} />
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{c.nome}</p>
                            <p className="text-xs text-slate-400">@{c.nomeUsuario}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500 text-xs">{displayCPF(c.cpf)}</td>
                      <td className="px-5 py-3.5 text-slate-600 text-sm">{c.profissao || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                          ${c.rendas?.length > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                          {c.rendas?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/clientes/${c.id}`}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="Ver">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link to={`/clientes/${c.id}/editar`}
                            className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteTarget(c)}
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

            {/* Mobile card list */}
            <div className="sm:hidden p-4 space-y-3">
              {filtered.map(c => (
                <ClienteCard key={c.id} c={c} onDelete={setDeleteTarget} />
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir cliente"
        message={`Deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
