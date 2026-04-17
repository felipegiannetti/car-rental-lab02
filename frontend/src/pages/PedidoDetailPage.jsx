import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Car, Calendar, User, FileText, Clock, CheckCircle2, XCircle, Search, Ban, ShoppingBag, Phone, ShieldCheck, Trash2 } from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  PENDENTE: { label: 'Pendente', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', icon: Clock },
  EM_ANALISE: { label: 'Em analise', cls: 'bg-[#f2fde0] text-[#004521] border-[#c9f485]', dot: 'bg-[#78de1f]', icon: Search },
  APROVADO: { label: 'Aprovado', cls: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500', icon: CheckCircle2 },
  REPROVADO: { label: 'Reprovado', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', icon: XCircle },
  CANCELADO: { label: 'Cancelado', cls: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', icon: Ban },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDENTE
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

const fmt = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '---'
const fmtShort = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '---'

export default function PedidoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCancel, setShowCancel] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    pedidoApi.getById(id)
      .then(setPedido)
      .catch(() => { toast.error('Pedido nao encontrado.'); navigate('/pedidos') })
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleCancel() {
    setSubmitting(true)
    try {
      const updated = await pedidoApi.cancelar(id)
      setPedido(updated)
      toast.success('Pedido cancelado.')
      setShowCancel(false)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao cancelar.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDecision(status) {
    setSubmitting(true)
    try {
      const updated = await pedidoApi.atualizarStatus(id, status)
      setPedido(updated)
      toast.success(status === 'APROVADO' ? 'Pedido aprovado.' : 'Pedido recusado.')
      setShowApprove(false)
      setShowReject(false)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao decidir pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setSubmitting(true)
    try {
      await pedidoApi.remove(id)
      toast.success('Pedido excluido.')
      navigate('/pedidos')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir pedido.')
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-300 text-sm animate-pulse">Carregando...</div>
  if (!pedido) return null

  const canCancel = user && !isAdmin && user.id === pedido.clienteId && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
  const canDecide = user && (isAdmin || user.id === pedido.anuncianteId) && ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
  const canDelete = isAdmin
  const isCompra = pedido.tipoPedido === 'COMPRA'

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className={`h-16 ${pedido.status === 'APROVADO' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : pedido.status === 'REPROVADO' ? 'bg-gradient-to-r from-red-500 to-rose-600' : pedido.status === 'CANCELADO' ? 'bg-gradient-to-r from-slate-400 to-slate-500' : pedido.status === 'EM_ANALISE' ? 'bg-gradient-to-r from-[#78de1f] to-[#4b8d12]' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`} />
        <div className="px-5 sm:px-6 -mt-6 flex items-end justify-between gap-4 pb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white ${pedido.status === 'APROVADO' ? 'bg-green-500' : pedido.status === 'REPROVADO' ? 'bg-red-500' : pedido.status === 'CANCELADO' ? 'bg-slate-400' : pedido.status === 'EM_ANALISE' ? 'bg-[#78de1f]' : 'bg-amber-500'}`}>
            {isCompra ? <ShoppingBag className="w-6 h-6 text-white" /> : <Car className="w-6 h-6 text-white" />}
          </div>
          <div className="flex items-center gap-2 mt-8">
            {canDecide && (
              <>
                <button onClick={() => setShowReject(true)} className="btn-secondary text-xs px-3 py-1.5 text-red-600 border-red-200 hover:bg-red-50"><XCircle className="w-3.5 h-3.5" /> Recusar</button>
                <button onClick={() => setShowApprove(true)} className="btn-primary text-xs px-3 py-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Aprovar</button>
              </>
            )}
            {canCancel && <button onClick={() => setShowCancel(true)} className="btn-danger text-xs px-3 py-1.5"><XCircle className="w-3.5 h-3.5" /> Cancelar pedido</button>}
            {canDelete && <button onClick={() => setShowDelete(true)} className="btn-danger text-xs px-3 py-1.5"><Trash2 className="w-3.5 h-3.5" /> Excluir pedido</button>}
          </div>
        </div>
        <div className="px-5 sm:px-6 pb-5 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900">Pedido #{pedido.id}</h1>
            <StatusBadge status={pedido.status} />
            <span className="inline-flex items-center gap-1 text-xs rounded-full bg-slate-100 text-slate-600 px-2 py-1 font-semibold">
              {isCompra ? <ShoppingBag className="w-3 h-3" /> : <Car className="w-3 h-3" />}
              {pedido.tipoPedido}
            </span>
          </div>
          <p className="text-sm text-slate-400">Solicitado em {fmtShort(pedido.dataCriacao)}</p>
        </div>
      </div>

      <Section icon={Car} title="Veiculo">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoField label="Automovel" value={pedido.automovelInfo} />
          <InfoField label="Status do anuncio" value={pedido.automovelStatus} />
        </div>
      </Section>

      <Section icon={User} title="Participantes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoField label="Solicitante" value={pedido.clienteNome} />
          <InfoField label="Dono do anuncio" value={pedido.anuncianteNome} />
        </div>
      </Section>

      {pedido.tipoPedido === 'ALUGUEL' ? (
        <Section icon={Calendar} title="Periodo do aluguel">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoField label="Data de inicio" value={fmt(pedido.dataInicio)} />
            <InfoField label="Data de fim" value={fmt(pedido.dataFim)} />
          </div>
        </Section>
      ) : (
        <Section icon={ShoppingBag} title="Fluxo de compra">
          <p className="text-sm text-slate-700 leading-relaxed">
            Se o pedido for aprovado, os dados de contato do dono do anuncio ficam disponiveis para a negociacao.
          </p>
        </Section>
      )}

      {pedido.contatoAnunciante && (
        <Section icon={Phone} title="Contato do anunciante">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoField label="Nome" value={pedido.contatoAnunciante.nome} />
            <InfoField label="CPF" value={pedido.contatoAnunciante.cpf} />
            <InfoField label="Email" value={pedido.contatoAnunciante.email} />
            <InfoField label="Telefone" value={pedido.contatoAnunciante.telefone} />
          </div>
        </Section>
      )}

      {pedido.observacao && (
        <Section icon={FileText} title="Observacoes">
          <p className="text-sm text-slate-700 leading-relaxed">{pedido.observacao}</p>
        </Section>
      )}

      <div className="pb-8">
        <Link to="/pedidos" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Voltar aos pedidos</Link>
      </div>

      <ConfirmModal
        isOpen={showCancel}
        title="Cancelar pedido"
        message={`Tem certeza que deseja cancelar o pedido #${pedido.id}? Esta acao nao pode ser desfeita.`}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
        loading={submitting}
        confirmLabel="Cancelar pedido"
        loadingLabel="Cancelando..."
        tone="danger"
      />
      <ConfirmModal
        isOpen={showApprove}
        title="Aprovar pedido"
        message={`Deseja aprovar o pedido #${pedido.id}?`}
        onConfirm={() => handleDecision('APROVADO')}
        onCancel={() => setShowApprove(false)}
        loading={submitting}
        confirmLabel="Aprovar"
        loadingLabel="Aprovando..."
        tone="primary"
      />
      <ConfirmModal
        isOpen={showReject}
        title="Recusar pedido"
        message={`Deseja recusar o pedido #${pedido.id}?`}
        onConfirm={() => handleDecision('REPROVADO')}
        onCancel={() => setShowReject(false)}
        loading={submitting}
        confirmLabel="Recusar"
        loadingLabel="Recusando..."
        tone="danger"
      />
      <ConfirmModal
        isOpen={showDelete}
        title="Excluir pedido"
        message={`Deseja excluir o pedido #${pedido.id}? Esta acao nao pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={submitting}
        confirmLabel="Excluir"
        loadingLabel="Excluindo..."
        tone="danger"
      />
    </div>
  )
}
