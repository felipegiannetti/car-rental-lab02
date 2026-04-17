import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Car, Calendar, AlertCircle, FileText, ShieldAlert, ShoppingBag, KeyRound, Gauge } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

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

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3 shrink-0" />{error}</p>}
    </div>
  )
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#78de1f] focus:border-transparent transition-all ${err ? 'border-red-300 bg-red-50/30' : 'border-[#d6d6d6]'}`

export default function PedidoFormPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [automoveis, setAutomoveis] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      automovelId: searchParams.get('automovelId') || '',
      tipoPedido: 'ALUGUEL',
      dataInicio: '',
      dataFim: '',
      observacao: '',
    },
  })

  const dataInicio = watch('dataInicio')
  const tipoPedido = watch('tipoPedido')
  const automovelId = watch('automovelId')

  useEffect(() => {
    automovelApi.getAll()
      .then(setAutomoveis)
      .catch(() => toast.error('Erro ao carregar automoveis.'))
      .finally(() => setLoadingCars(false))
  }, [])

  const automoveisDisponiveis = useMemo(
    () => automoveis.filter((automovel) => automovel.statusAnuncio !== 'EM_NEGOCIACAO'),
    [automoveis]
  )

  const automovelSelecionado = useMemo(
    () => automoveisDisponiveis.find((automovel) => String(automovel.id) === String(automovelId)),
    [automoveisDisponiveis, automovelId]
  )

  useEffect(() => {
    if (!automovelSelecionado) return

    if (tipoPedido === 'ALUGUEL' && !automovelSelecionado.aceitaAluguel && automovelSelecionado.aceitaCompra) {
      setValue('tipoPedido', 'COMPRA')
    }

    if (tipoPedido === 'COMPRA' && !automovelSelecionado.aceitaCompra && automovelSelecionado.aceitaAluguel) {
      setValue('tipoPedido', 'ALUGUEL')
    }
  }, [automovelSelecionado, setValue, tipoPedido])

  const onSubmit = async (data) => {
    if (!user || isAdmin) {
      toast.error('Apenas clientes podem criar pedidos.')
      return
    }

    try {
      const pedido = await pedidoApi.create({
        clienteId: user.id,
        automovelId: parseInt(data.automovelId, 10),
        tipoPedido: data.tipoPedido,
        dataInicio: data.tipoPedido === 'ALUGUEL' ? data.dataInicio : null,
        dataFim: data.tipoPedido === 'ALUGUEL' ? data.dataFim : null,
        observacao: data.observacao || null,
      })
      toast.success('Pedido criado com sucesso!')
      navigate(`/pedidos/${pedido.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao criar pedido.')
    }
  }

  if (isAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Link to="/pedidos" className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">Novo pedido</h1>
            <p className="text-xs sm:text-sm text-slate-400">Administradores nao criam pedidos de aluguel ou compra</p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0"><ShieldAlert className="w-5 h-5 text-amber-700" /></div>
          <div>
            <p className="text-sm font-semibold text-amber-800">Area exclusiva para clientes</p>
            <p className="text-sm text-amber-700 mt-1">Entre com uma conta de cliente para solicitar aluguel ou compra. Como admin, voce continua acompanhando os pedidos pela lista.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/pedidos" className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Novo pedido</h1>
          <p className="text-xs sm:text-sm text-slate-400">Escolha entre aluguel ou compra do carro anunciado</p>
        </div>
      </div>

      <div className="rounded-2xl px-5 py-4 flex items-center gap-3" style={{ background: '#f2fde0', border: '1px solid #c9f485' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: '#004521' }}>{user.nome?.charAt(0).toUpperCase()}</div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#004521' }}>{user.nome}</p>
          <p className="text-xs" style={{ color: '#62b818' }}>@{user.nomeUsuario} - Solicitante do pedido</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Section icon={ShoppingBag} title="Tipo do pedido">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${automovelSelecionado && !automovelSelecionado.aceitaAluguel ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={tipoPedido === 'ALUGUEL' ? { borderColor: '#78de1f', background: '#f2fde0' } : { borderColor: '#e2e8f0', background: '#fff' }}
            >
              <input type="radio" value="ALUGUEL" {...register('tipoPedido', { required: 'Obrigatorio' })} className="sr-only" disabled={automovelSelecionado && !automovelSelecionado.aceitaAluguel} />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}><KeyRound className="w-5 h-5" style={{ color: '#004521' }} /></div>
                <div>
                  <p className="font-semibold text-slate-900">Alugar</p>
                  <p className="text-sm text-slate-500">{automovelSelecionado && !automovelSelecionado.aceitaAluguel ? 'Este anuncio nao aceita aluguel.' : 'Seleciona um periodo e aguarda aprovacao do dono do anuncio.'}</p>
                </div>
              </div>
            </label>
            <label
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${automovelSelecionado && !automovelSelecionado.aceitaCompra ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={tipoPedido === 'COMPRA' ? { borderColor: '#78de1f', background: '#f2fde0' } : { borderColor: '#e2e8f0', background: '#fff' }}
            >
              <input type="radio" value="COMPRA" {...register('tipoPedido', { required: 'Obrigatorio' })} className="sr-only" disabled={automovelSelecionado && !automovelSelecionado.aceitaCompra} />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}><ShoppingBag className="w-5 h-5" style={{ color: '#004521' }} /></div>
                <div>
                  <p className="font-semibold text-slate-900">Comprar</p>
                  <p className="text-sm text-slate-500">{automovelSelecionado && !automovelSelecionado.aceitaCompra ? 'Este anuncio nao aceita compra.' : 'Se o dono aprovar, voce recebe os dados de contato para negociar.'}</p>
                </div>
              </div>
            </label>
          </div>
        </Section>

        <Section icon={Car} title="Veiculo desejado">
          <Field label="Selecione o automovel" required error={errors.automovelId?.message}>
            {loadingCars ? (
              <div className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-300 animate-pulse">Carregando veiculos...</div>
            ) : automoveisDisponiveis.length === 0 ? (
              <div className="text-sm text-slate-400 py-2">Nenhum automovel disponivel para pedidos no momento.</div>
            ) : (
              <select {...register('automovelId', { required: 'Selecione um automovel' })} className={inputCls(errors.automovelId) + ' appearance-none'}>
                <option value="">Selecione um veiculo...</option>
                {automoveisDisponiveis.map((automovel) => (
                  <option key={automovel.id} value={automovel.id}>
                    {automovel.marca} {automovel.modelo} - {automovel.placa} ({automovel.ano}) - {Number(automovel.quilometragem ?? 0).toLocaleString('pt-BR')} km - {automovel.statusAnuncio}
                  </option>
                ))}
              </select>
            )}
          </Field>
          {automovelSelecionado && (
            <p className="mt-3 text-sm text-slate-500">
              Este anuncio aceita {[
                automovelSelecionado.aceitaAluguel ? 'aluguel' : null,
                automovelSelecionado.aceitaCompra ? 'compra' : null,
              ].filter(Boolean).join(' e ')}.
            </p>
          )}
        </Section>

        {tipoPedido === 'ALUGUEL' && (
          <Section icon={Calendar} title="Periodo do aluguel">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Data de inicio" required error={errors.dataInicio?.message}>
                <input type="date" {...register('dataInicio', { required: 'Obrigatorio', min: { value: new Date().toISOString().split('T')[0], message: 'Nao pode ser no passado' } })} className={inputCls(errors.dataInicio)} />
              </Field>
              <Field label="Data de fim" required error={errors.dataFim?.message}>
                <input type="date" {...register('dataFim', { required: 'Obrigatorio', validate: v => !dataInicio || v >= dataInicio || 'Deve ser apos a data de inicio' })} min={dataInicio || undefined} className={inputCls(errors.dataFim)} />
              </Field>
            </div>
          </Section>
        )}

        {tipoPedido === 'COMPRA' && (
          <Section icon={Gauge} title="Fluxo de compra">
            <p className="text-sm text-slate-600 leading-relaxed">
              Ao aprovar um pedido de compra, o dono do anuncio libera nome, email, CPF e telefone para voce negociar diretamente.
            </p>
          </Section>
        )}

        <Section icon={FileText} title="Observacoes">
          <textarea {...register('observacao')} rows={3} placeholder="Informacoes adicionais sobre o pedido (opcional)..." className={inputCls(false) + ' resize-none'} />
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-3 pb-8">
          <Link to="/pedidos" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Cancelar</Link>
          <button type="submit" disabled={isSubmitting || loadingCars || automoveisDisponiveis.length === 0} className="btn-primary disabled:opacity-50 px-6 py-2.5">
            {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</> : <><Save className="w-4 h-4" /> {tipoPedido === 'COMPRA' ? 'Solicitar compra' : 'Solicitar aluguel'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
