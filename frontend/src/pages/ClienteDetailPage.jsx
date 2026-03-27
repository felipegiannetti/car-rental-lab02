import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { clienteApi } from '../api/clienteApi'
import ConfirmModal from '../components/ConfirmModal'
import { displayCPF, displayRG } from '../utils/masks'
import { ArrowLeft, Pencil, Trash2, User, DollarSign, Lock, BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800 break-words">{value || <span className="text-slate-300 italic">—</span>}</p>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-50 bg-slate-50/70">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-slate-700">{title}</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}

const fmt = (n) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ClienteDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    clienteApi.getById(id)
      .then(setCliente)
      .catch(() => { toast.error('Cliente não encontrado.'); navigate('/clientes') })
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      await clienteApi.remove(id)
      toast.success('Cliente excluído.')
      navigate('/clientes')
    } catch { toast.error('Erro ao excluir.'); setDeleting(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-300 text-sm animate-pulse">
      Carregando…
    </div>
  )
  if (!cliente) return null

  const total = (cliente.rendas ?? []).reduce((s, r) => s + r.valorRendimento, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Cabeçalho com foto */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Capa azul */}
        <div className="h-20 sm:h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />

        {/* Avatar — sobrepõe a capa */}
        <div className="px-5 sm:px-6 -mt-10">
          {cliente.temFoto && !imgError ? (
            <img
              src={`${clienteApi.fotoUrl(id)}?t=${Date.now()}`}
              alt={cliente.nome}
              onError={() => setImgError(true)}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600
              flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
              {cliente.nome.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Nome + botões — sempre dentro da área branca */}
        <div className="px-5 sm:px-6 pt-2 pb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 break-words">{cliente.nome}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">@{cliente.nomeUsuario}</span>
              <span className="text-slate-200">·</span>
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                <BadgeCheck className="w-3 h-3" />{cliente.tipoUsuario}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to={`/clientes/${id}/editar`} className="btn-secondary text-xs px-3 py-1.5">
              <Pencil className="w-3.5 h-3.5" /> Editar
            </Link>
            <button onClick={() => setShowDelete(true)}
              className="btn-danger text-xs px-3 py-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Excluir
            </button>
          </div>
        </div>
      </div>

      {/* Dados Pessoais */}
      <Section icon={User} title="Dados Pessoais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoField label="Nome Completo" value={cliente.nome} />
          <InfoField label="Profissão" value={cliente.profissao} />
          <InfoField label="CPF" value={displayCPF(cliente.cpf)} />
          <InfoField label="RG" value={displayRG(cliente.rg)} />
          <div className="sm:col-span-2">
            <InfoField label="Endereço" value={cliente.endereco} />
          </div>
        </div>
      </Section>

      {/* Acesso */}
      <Section icon={Lock} title="Acesso ao Sistema">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoField label="Usuário" value={cliente.nomeUsuario} />
          <InfoField label="Tipo de Conta" value={cliente.tipoUsuario} />
        </div>
      </Section>

      {/* Rendimentos */}
      <Section icon={DollarSign} title="Rendimentos">
        {!cliente.rendas?.length ? (
          <p className="text-sm text-slate-300 italic text-center py-4">Nenhum rendimento cadastrado.</p>
        ) : (
          <div className="rounded-xl overflow-hidden border border-slate-100 overflow-x-auto">
            <table className="w-full text-sm min-w-[280px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Entidade</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cliente.rendas.map((r, i) => (
                  <tr key={r.idRenda} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-300 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{r.entidadeEmpregadora}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{fmt(r.valorRendimento)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-200">
                  <td colSpan={2} className="px-4 py-3 text-right text-sm font-bold text-blue-700">Total</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">{fmt(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Section>

      <div className="pb-8">
        <Link to="/clientes" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Voltar à lista
        </Link>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Excluir cliente"
        message={`Tem certeza que deseja excluir "${cliente.nome}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
