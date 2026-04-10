import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Car, Calendar, AlertCircle, FileText } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
import { pedidoApi } from '../api/pedidoApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

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

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle className="w-3 h-3 shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-300
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
   ${err ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`

export default function PedidoFormPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [automoveis, setAutomoveis] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      automovelId: '', dataInicio: '', dataFim: '', observacao: '',
    },
  })

  const dataInicio = watch('dataInicio')

  useEffect(() => {
    automovelApi.getAll()
      .then(setAutomoveis)
      .catch(() => toast.error('Erro ao carregar automóveis.'))
      .finally(() => setLoadingCars(false))
  }, [])

  const onSubmit = async (data) => {
    if (!user) { toast.error('Você precisa estar logado.'); return }
    try {
      const pedido = await pedidoApi.create({
        clienteId: user.id,
        automovelId: parseInt(data.automovelId),
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        observacao: data.observacao || null,
      })
      toast.success('Pedido criado com sucesso!')
      navigate(`/pedidos/${pedido.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao criar pedido.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Link to="/pedidos" className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Novo Pedido de Aluguel</h1>
          <p className="text-xs sm:text-sm text-slate-400">Solicite o aluguel de um veículo</p>
        </div>
      </div>

      {/* Info do solicitante */}
      {user && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user.nome?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800">{user.nome}</p>
            <p className="text-xs text-blue-500">@{user.nomeUsuario} · Solicitante do pedido</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Veículo */}
        <Section icon={Car} title="Veículo Desejado">
          <Field label="Selecione o automóvel" required error={errors.automovelId?.message}>
            {loadingCars ? (
              <div className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-300 animate-pulse">
                Carregando veículos…
              </div>
            ) : automoveis.length === 0 ? (
              <div className="text-sm text-slate-400 py-2">
                Nenhum automóvel cadastrado.{' '}
                <Link to="/automoveis/novo" className="text-blue-500 underline">Cadastrar agora</Link>
              </div>
            ) : (
              <select
                {...register('automovelId', { required: 'Selecione um automóvel' })}
                className={inputCls(errors.automovelId) + ' appearance-none'}
              >
                <option value="">Selecione um veículo…</option>
                {automoveis.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.marca} {a.modelo} — {a.placa} ({a.ano}){!a.disponivel ? ' · Indisponível' : ''}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </Section>

        {/* Período */}
        <Section icon={Calendar} title="Período do Aluguel">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Data de Início" required error={errors.dataInicio?.message}>
              <input
                type="date"
                {...register('dataInicio', {
                  required: 'Obrigatório',
                  min: { value: new Date().toISOString().split('T')[0], message: 'Não pode ser no passado' },
                })}
                className={inputCls(errors.dataInicio)}
              />
            </Field>
            <Field label="Data de Fim" required error={errors.dataFim?.message}>
              <input
                type="date"
                {...register('dataFim', {
                  required: 'Obrigatório',
                  validate: v => !dataInicio || v >= dataInicio || 'Deve ser após a data de início',
                })}
                min={dataInicio || undefined}
                className={inputCls(errors.dataFim)}
              />
            </Field>
          </div>
        </Section>

        {/* Observação */}
        <Section icon={FileText} title="Observações">
          <textarea
            {...register('observacao')}
            rows={3}
            placeholder="Informações adicionais sobre o pedido (opcional)…"
            className={inputCls(false) + ' resize-none'}
          />
        </Section>

        {/* Rodapé */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-8">
          <Link to="/pedidos" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting || loadingCars || automoveis.length === 0}
            className="btn-primary disabled:opacity-50 px-6 py-2.5">
            {isSubmitting
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando…</>
              : <><Save className="w-4 h-4" /> Solicitar Aluguel</>}
          </button>
        </div>
      </form>
    </div>
  )
}
