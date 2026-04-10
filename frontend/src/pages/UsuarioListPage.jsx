import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Shield, User, Plus, Eye, Pencil, Trash2, Search } from 'lucide-react'
import { userApi } from '../api/userApi'
import { displayCPF } from '../utils/masks'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
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

function RoleBadge({ tipoUsuario }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${tipoUsuario === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {tipoUsuario === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
      {tipoUsuario}
    </span>
  )
}

function Avatar({ nome, tipoUsuario }) {
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow shrink-0 ${tipoUsuario === 'ADMIN' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
      {(nome ?? '?').charAt(0).toUpperCase()}
    </div>
  )
}

export default function UsuarioListPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    setLoading(true)
    try {
      setUsuarios(await userApi.getAll())
    } catch {
      toast.error('Erro ao carregar usuarios.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await userApi.remove(deleteTarget.tipoRegistro, deleteTarget.id)
      setUsuarios(prev => prev.filter(usuario => !(usuario.id === deleteTarget.id && usuario.tipoRegistro === deleteTarget.tipoRegistro)))
      toast.success(`"${deleteTarget.nome}" removido.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir usuario.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = usuarios.filter((usuario) =>
    `${usuario.nome} ${usuario.nomeUsuario} ${usuario.cpf ?? ''} ${usuario.tipoUsuario}`.toLowerCase().includes(search.toLowerCase())
  )

  const admins = usuarios.filter(usuario => usuario.tipoUsuario === 'ADMIN').length
  const clientes = usuarios.length - admins

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-400 mt-0.5">Crie, visualize, edite e remova contas do sistema</p>
        </div>
        <Link to="/usuarios/novo" className="btn-primary shadow-sm">
          <Plus className="w-4 h-4" /> Novo usuario
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Total de usuarios" value={usuarios.length} color="blue" />
        <StatCard icon={Shield} label="Admins" value={admins} color="green" />
        <StatCard icon={User} label="Clientes" value={clientes} color="amber" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, login, CPF..."
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
            Carregando usuarios...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">Nenhum usuario encontrado.</p>
            {!search && (
              <Link to="/usuarios/novo" className="btn-primary text-xs">
                <Plus className="w-3.5 h-3.5" /> Cadastrar primeiro usuario
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['#', 'Usuario', 'Login', 'Tipo', 'CPF', ''].map((header) => (
                      <th key={header} className={`px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${header === '' ? 'text-center' : ''}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((usuario, index) => (
                    <tr key={`${usuario.tipoRegistro}-${usuario.id}`} className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group ${index % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                      <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{usuario.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar nome={usuario.nome} tipoUsuario={usuario.tipoUsuario} />
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{usuario.nome}</p>
                            <p className="text-xs text-slate-400">{usuario.tipoRegistro}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 text-sm">@{usuario.nomeUsuario}</td>
                      <td className="px-5 py-3.5"><RoleBadge tipoUsuario={usuario.tipoUsuario} /></td>
                      <td className="px-5 py-3.5 text-slate-500 text-sm">{usuario.cpf ? displayCPF(usuario.cpf) : '—'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/usuarios/${usuario.tipoRegistro}/${usuario.id}`} className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="Ver">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link to={`/usuarios/${usuario.tipoRegistro}/${usuario.id}/editar`} className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteTarget(usuario)} className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden p-4 space-y-3">
              {filtered.map((usuario) => (
                <div key={`${usuario.tipoRegistro}-${usuario.id}`} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar nome={usuario.nome} tipoUsuario={usuario.tipoUsuario} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{usuario.nome}</p>
                      <p className="text-xs text-slate-400 truncate">@{usuario.nomeUsuario}</p>
                    </div>
                    <RoleBadge tipoUsuario={usuario.tipoUsuario} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{usuario.cpf ? displayCPF(usuario.cpf) : 'Sem CPF'}</span>
                    <span>{usuario.tipoRegistro}</span>
                  </div>
                  <div className="mt-3 flex gap-2 pt-3 border-t border-slate-50">
                    <Link to={`/usuarios/${usuario.tipoRegistro}/${usuario.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors">
                      <Eye className="w-3.5 h-3.5" /> Ver
                    </Link>
                    <Link to={`/usuarios/${usuario.tipoRegistro}/${usuario.id}/editar`} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 text-xs font-medium transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> Editar
                    </Link>
                    <button onClick={() => setDeleteTarget(usuario)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir usuario"
        message={`Deseja excluir "${deleteTarget?.nome}"? Esta acao nao pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
