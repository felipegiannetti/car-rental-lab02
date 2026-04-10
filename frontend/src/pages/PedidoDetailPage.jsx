import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Car, Calendar, User, FileText,
  Clock, CheckCircle2, XCircle, Search, Ban,
} from 'lucide-react'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_META = {
  PENDENTE:   { label: 'Pendente',   cls: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-400',  icon: Clock },
  EM_ANALISE: { label: 'Em Análise', cls: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-400',   icon: Search },
  APROVADO:   { label: 'Aprovado',   cls: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500',  icon: CheckCircle2 },
  REPROVADO:  { label: 'Reprovado',  cls: 'bg-red-50 text-red-700 border-red-200',        dot: 'bg-red-500',    icon: XCircle },
  CANCELADO:  { label: 'Cancelado',  cls: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400',  icon: Ban },
}

const FLOW = ['PENDENTE', 'EM_ANALISE', 'APROVADO']

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.PENDENTE
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${m.cls}`}>
      <Icon className="w-4 h-4" /> {m.label}
    </span>
  )
}

function StatusTimeline({ status }) {
  const isReprovado = status === 'REPROVADO'
  const isCancelado = status === 'CANCELADO'

  return (
    <div className="flex items-center gap-0 w-full max-w-sm">
      {FLOW.map((s, i) => {
        const m = STATUS_META[s]
        const isDone = FLOW.indexOf(status) >= i && !isReprovado && !isCancelado
        const isCurrent = status === s
        const isLast = i === FLOW.length - 1
        return (
          <div key={s} className="flex items-center flex-1">
            <div className={`relative flex flex-col items-center gap-1 flex-1`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${isDone ? 'border-green-500 bg-green-500' : isCurrent ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                {isDone
                  ? <CheckCircle2 className="w-4 h-4 text-white" />
                  : <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-slate-300'}`} />
                }
              </div>
              <span className={`text-xs font-medium whitespace-nowrap
                ${isDone ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                {m.label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-0.5 flex-1 mb-4 mx-1 transition-all
                ${FLOW.indexOf(status) > i && !isReprovado && !isCancelado ? 'bg-green-400' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function InfoField({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-medium text-slate-800 break-words ${mono ? 'font-mono' : ''}`}>
        {value || <span className="text-slate-300 italic">—</span>}
      </p>
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

const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'
const fmtShort = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

export default function PedidoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCancel, setShowCancel] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    pedidoApi.getById(id)
      .then(setPedido)
      .catch(() => { toast.error('Pedido não encontrado.'); navigate('/pedidos') })
      .finally(() => setLoading(false))
  }, [id])

  async function handleCancel() {
    setCanceling(true)
    try {
      const updated = await pedidoApi.cancelar(id)
      setPedido(updated)
      toast.success('Pedido cancelado.')
      setShowCancel(false)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao cancelar.')
    } finally { setCanceling(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-300 text-sm animate-pulse">Carregando…</div>
  )
  if (!pedido) return null

  const canCancel = ['PENDENTE', 'EM_ANALISE'].includes(pedido.status)
  const m = STATUS_META[pedido.status] || STATUS_META.PENDENTE

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className={`h-16 ${
          pedido.status === 'APROVADO' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
          pedido.status === 'REPROVADO' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
          pedido.status === 'CANCELADO' ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
          pedido.status === 'EM_ANALISE' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
          'bg-gradient-to-r from-amber-500 to-orange-500'
        }`} />
        <div className="px-5 sm:px-6 -mt-6 flex items-end justify-between gap-4 pb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white
            ${m.cls.includes('green') ? 'bg-green-500' : m.cls.includes('blue') ? 'bg-blue-500' :
              m.cls.includes('red') ? 'bg-red-500' : m.cls.includes('amber') ? 'bg-amber-500' : 'bg-slate-400'}`}>
            <m.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 mt-8">
            {canCancel && (
              <button onClick={() => setShowCancel(true)}
                className="btn-danger text-xs px-3 py-1.5">
                <XCircle className="w-3.5 h-3.5" /> Cancelar Pedido
              </button>
            )}
          </div>
        </div>
        <div className="px-5 sm:px-6 pb-5 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900">Pedido #{pedido.id}</h1>
            <StatusBadge status={pedido.status} />
          </div>
          <p className="text-sm text-slate-400">Solicitado em {fmtShort(pedido.dataCriacao)}</p>
        </div>
      </div>

      {/* Status timeline */}
      {!['REPROVADO', 'CANCELADO'].includes(pedido.status) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Andamento do Pedido</p>
          <StatusTimeline status={pedido.status} />
        </div>
      )}

      {['REPROVADO', 'CANCELADO'].includes(pedido.status) && (
        <div className={`rounded-2xl border p-5 flex items-center gap-4
          ${pedido.status === 'REPROVADO' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <m.icon className={`w-8 h-8 shrink-0 ${pedido.status === 'REPROVADO' ? 'text-red-400' : 'text-slate-400'}`} />
          <div>
            <p className={`font-semibold text-sm ${pedido.status === 'REPROVADO' ? 'text-red-700' : 'text-slate-600'}`}>
              Pedido {m.label}
            </p>
            <p className={`text-xs mt-0.5 ${pedido.status === 'REPROVADO' ? 'text-red-500' : 'text-slate-400'}`}>
              Este pedido não pode mais ser alterado.
            </p>
          </div>
        </div>
      )}

      {/* Veículo */}
      <Section icon={Car} title="Veículo">
        <InfoField label="Automóvel" value={pedido.automovelInfo} />
      </Section>

      {/* Período */}
      <Section icon={Calendar} title="Período do Aluguel">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoField label="Data de Início" value={fmt(pedido.dataInicio)} />
          <InfoField label="Data de Fim" value={fmt(pedido.dataFim)} />
        </div>
      </Section>

      {/* Cliente */}
      <Section icon={User} title="Solicitante">
        <InfoField label="Cliente" value={pedido.clienteNome} />
      </Section>

      {/* Observação */}
      {pedido.observacao && (
        <Section icon={FileText} title="Observações">
          <p className="text-sm text-slate-700 leading-relaxed">{pedido.observacao}</p>
        </Section>
      )}

      <div className="pb-8">
        <Link to="/pedidos" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Voltar aos pedidos
        </Link>
      </div>

      <ConfirmModal
        isOpen={showCancel}
        title="Cancelar pedido"
        message={`Tem certeza que deseja cancelar o Pedido #${pedido.id}? Esta ação não pode ser desfeita.`}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
        loading={canceling}
      />
    </div>
  )
}
