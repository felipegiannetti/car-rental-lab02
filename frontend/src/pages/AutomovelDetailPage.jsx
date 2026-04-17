import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Car, Gauge, CalendarDays, User, Pencil, Trash2, CheckCircle2, XCircle, HandCoins, KeyRound, ShoppingBag } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  DISPONIVEL: { label: 'Disponivel', cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  EM_USO: { label: 'Em uso', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Car },
  EM_NEGOCIACAO: { label: 'Em negociacao', cls: 'bg-[#f2fde0] text-[#004521] border-[#c9f485]', icon: HandCoins },
  INDISPONIVEL: { label: 'Indisponivel', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.DISPONIVEL
  const Icon = meta.icon
  return <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${meta.cls}`}><Icon className="w-4 h-4" /> {meta.label}</span>
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800 break-words">{value || <span className="text-slate-300 italic">---</span>}</p>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#d6d6d6] overflow-hidden" style={{ boxShadow: '0 2px 4px 1px rgba(15,23,42,0.06)' }}>
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-[#efefef] bg-[#fafafa]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}><Icon className="w-4 h-4" style={{ color: '#004521' }} /></div>
        <span className="text-sm font-semibold text-[#383838]">{title}</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}

export default function AutomovelDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, isAuthenticated } = useAuth()
  const [automovel, setAutomovel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    automovelApi.getById(id)
      .then(setAutomovel)
      .catch(() => {
        toast.error('Anuncio nao encontrado.')
        navigate('/automoveis')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleDelete() {
    setDeleting(true)
    try {
      await automovelApi.remove(id)
      toast.success('Anuncio removido.')
      navigate('/automoveis')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir.')
      setDeleting(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-300 text-sm animate-pulse">Carregando...</div>
  if (!automovel) return null

  const canEdit = !!user && (isAdmin || automovel.anuncianteId === user.id)
  const canDelete = canEdit
  const modalidades = [
    automovel.aceitaAluguel ? 'Aluguel' : null,
    automovel.aceitaCompra ? 'Compra' : null,
  ].filter(Boolean)
  const canRequest = isAuthenticated
    && user?.tipoUsuario === 'CLIENTE'
    && automovel.anuncianteId !== user.id
    && automovel.statusAnuncio !== 'EM_NEGOCIACAO'
    && modalidades.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="relative aspect-[16/8] bg-slate-100">
          {automovel.temFoto
            ? <img src={`${automovelApi.fotoUrl(id)}?t=${Date.now()}`} alt={`${automovel.marca} ${automovel.modelo}`} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center"><Car className="w-20 h-20 text-slate-400" /></div>}
          <div className="absolute top-4 right-4"><StatusBadge status={automovel.statusAnuncio} /></div>
        </div>

        <div className="p-5 sm:p-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/automoveis" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all"><ArrowLeft className="w-5 h-5" /></Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{automovel.marca} {automovel.modelo}</h1>
                <p className="text-sm text-slate-400">{automovel.ano} - {automovel.placa}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canRequest && <Link to={`/pedidos/novo?automovelId=${automovel.id}`} className="btn-primary">Fazer pedido</Link>}
            {!isAuthenticated && <Link to="/login" className="btn-primary">Entrar para pedir</Link>}
            {canEdit && <Link to={`/automoveis/${automovel.id}/editar`} className="btn-secondary"><Pencil className="w-4 h-4" /> Editar</Link>}
            {canDelete && <button onClick={() => setShowDelete(true)} className="btn-danger"><Trash2 className="w-4 h-4" /> Excluir</button>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Section icon={Car} title="Detalhes do anuncio">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoField label="Marca" value={automovel.marca} />
              <InfoField label="Modelo" value={automovel.modelo} />
              <InfoField label="Ano" value={String(automovel.ano)} />
              <InfoField label="Placa" value={automovel.placa} />
              <InfoField label="Matricula" value={automovel.matricula} />
              <InfoField label="Quilometragem" value={`${Number(automovel.quilometragem ?? 0).toLocaleString('pt-BR')} km`} />
              <InfoField label="Modalidades" value={modalidades.join(' / ')} />
            </div>
          </Section>
        </div>

        <div className="space-y-5">
          <Section icon={User} title="Anunciante">
            <InfoField label="Nome" value={automovel.anuncianteNome || 'Sistema'} />
          </Section>

          <Section icon={CalendarDays} title="Pedidos">
            <p className="text-sm text-slate-600 leading-relaxed">
              {modalidades.length > 0
                ? `Este carro aceita ${modalidades.map((item) => item.toLowerCase()).join(' e ')}. O dono do anuncio sera o responsavel por aprovar ou recusar os pedidos.`
                : 'Este anuncio nao aceita novos pedidos neste momento.'}
            </p>
          </Section>

          <Section icon={Gauge} title="Resumo">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Km:</span> {Number(automovel.quilometragem ?? 0).toLocaleString('pt-BR')} km</p>
              <p><span className="font-semibold">Status:</span> {STATUS_META[automovel.statusAnuncio]?.label || automovel.statusAnuncio}</p>
              <p className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-slate-400" /><span><span className="font-semibold">Aceita aluguel:</span> {automovel.aceitaAluguel ? 'Sim' : 'Nao'}</span></p>
              <p className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-slate-400" /><span><span className="font-semibold">Aceita compra:</span> {automovel.aceitaCompra ? 'Sim' : 'Nao'}</span></p>
            </div>
          </Section>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Excluir anuncio"
        message={`Deseja excluir "${automovel?.marca} ${automovel?.modelo} (${automovel?.placa})"? Esta acao nao pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
        confirmLabel="Excluir"
        loadingLabel="Excluindo..."
        tone="danger"
      />
    </div>
  )
}
