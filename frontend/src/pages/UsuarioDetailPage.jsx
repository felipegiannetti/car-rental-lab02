import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, User, DollarSign, Lock, BadgeCheck, MapPin, Shield } from 'lucide-react'
import { userApi } from '../api/userApi'
import { displayCPF, displayRG } from '../utils/masks'
import ConfirmModal from '../components/ConfirmModal'
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
    <div className="bg-white rounded-2xl border border-[#d6d6d6] overflow-hidden" style={{ boxShadow: '0 2px 4px 1px rgba(15,23,42,0.06)' }}>
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-[#efefef] bg-[#fafafa]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}>
          <Icon className="w-4 h-4" style={{ color: '#004521' }} />
        </div>
        <span className="text-sm font-semibold text-[#383838]">{title}</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}

function RoleBadge({ tipoUsuario }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
      style={tipoUsuario === 'ADMIN' ? { background: '#f2fde0', color: '#004521' } : { background: '#f0fdf4', color: '#16a34a' }}
    >
      <BadgeCheck className="w-3 h-3" /> {tipoUsuario}
    </span>
  )
}

const fmt = (n) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function UsuarioDetailPage() {
  const { tipo, id } = useParams()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    userApi.getById(tipo, id)
      .then(setUsuario)
      .catch(() => {
        toast.error('Usuario nao encontrado.')
        navigate('/usuarios')
      })
      .finally(() => setLoading(false))
  }, [id, navigate, tipo])

  async function handleDelete() {
    setDeleting(true)
    try {
      await userApi.remove(tipo, id)
      toast.success('Usuario excluido.')
      navigate('/usuarios')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-300 text-sm animate-pulse">
        Carregando...
      </div>
    )
  }

  if (!usuario) return null

  const total = (usuario.rendas ?? []).reduce((soma, renda) => soma + renda.valorRendimento, 0)
  const fotoUrl = usuario.tipoRegistro === 'cliente' ? userApi.fotoUrl('cliente', id) : null

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className={`h-20 sm:h-24 ${usuario.tipoUsuario === 'ADMIN' ? 'bg-gradient-to-r from-[#004521] to-[#012910]' : 'bg-gradient-to-r from-[#78de1f] to-[#4b8d12]'}`} />
        <div className="px-5 sm:px-6 -mt-10">
          {usuario.temFoto && fotoUrl && !imgError ? (
            <img
              src={`${fotoUrl}?t=${Date.now()}`}
              alt={usuario.nome}
              onError={() => setImgError(true)}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
            />
          ) : (
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg ${usuario.tipoUsuario === 'ADMIN' ? 'bg-gradient-to-br from-[#004521] to-[#012910]' : 'bg-gradient-to-br from-[#78de1f] to-[#4b8d12]'}`}>
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="px-5 sm:px-6 pt-2 pb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 break-words">{usuario.nome}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">@{usuario.nomeUsuario}</span>
              <span className="text-slate-200">·</span>
              <RoleBadge tipoUsuario={usuario.tipoUsuario} />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to={`/usuarios/${usuario.tipoRegistro}/${id}/editar`} className="btn-secondary text-xs px-3 py-1.5">
              <Pencil className="w-3.5 h-3.5" /> Editar
            </Link>
            <button onClick={() => setShowDelete(true)} className="btn-danger text-xs px-3 py-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Excluir
            </button>
          </div>
        </div>
      </div>

      <Section icon={User} title="Dados principais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoField label="Nome completo" value={usuario.nome} />
          <InfoField label="Login" value={usuario.nomeUsuario} />
          <InfoField label="Tipo de conta" value={usuario.tipoUsuario} />
          {usuario.tipoUsuario === 'ADMIN' && <InfoField label="Permissao" value="Gerenciamento completo de usuarios" />}
          {usuario.tipoUsuario === 'CLIENTE' && (
            <>
              <InfoField label="CPF" value={displayCPF(usuario.cpf)} />
              <InfoField label="RG" value={displayRG(usuario.rg)} />
              <InfoField label="Email" value={usuario.email} />
              <InfoField label="Telefone" value={usuario.telefone} />
            </>
          )}
        </div>
      </Section>

      {usuario.tipoUsuario === 'CLIENTE' ? (
        <>
          <Section icon={MapPin} title="Cadastro do cliente">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoField label="Profissao" value={usuario.profissao} />
              <InfoField label="Endereco" value={usuario.endereco} />
            </div>
          </Section>

          <Section icon={DollarSign} title="Rendimentos">
            {!usuario.rendas?.length ? (
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
                    {usuario.rendas.map((renda, index) => (
                      <tr key={renda.idRenda} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-300 text-xs">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{renda.entidadeEmpregadora}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-700">{fmt(renda.valorRendimento)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2" style={{ background: '#f2fde0', borderColor: '#c9f485' }}>
                      <td colSpan={2} className="px-4 py-3 text-right text-sm font-bold" style={{ color: '#004521' }}>Total</td>
                      <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: '#004521' }}>{fmt(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </Section>
        </>
      ) : (
        <Section icon={Shield} title="Perfil administrativo">
          <p className="text-sm text-slate-700 leading-relaxed">
            Esta conta pode acessar a area de gerenciamento de usuarios, cadastrar novos administradores e manter as contas de clientes do sistema.
          </p>
        </Section>
      )}

      <Section icon={Lock} title="Acesso ao sistema">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoField label="Usuario" value={usuario.nomeUsuario} />
          <InfoField label="Tipo de conta" value={usuario.tipoUsuario} />
        </div>
      </Section>

      <div className="pb-8">
        <Link to="/usuarios" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Voltar aos usuarios
        </Link>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Excluir usuario"
        message={`Tem certeza que deseja excluir "${usuario.nome}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
