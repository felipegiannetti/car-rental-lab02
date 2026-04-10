import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Car, AlertCircle } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
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

const MARCAS = [
  'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep',
  'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'Outra',
]

const currentYear = new Date().getFullYear()

export default function AutomovelFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [outraMarca, setOutraMarca] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      marca: '', marcaOutro: '', modelo: '', placa: '',
      matricula: '', ano: currentYear, disponivel: true,
    },
  })

  const marcaVal = watch('marca')

  useEffect(() => {
    if (!isEdit) return
    automovelApi.getById(id)
      .then(a => {
        const isOutra = !MARCAS.slice(0, -1).includes(a.marca)
        setOutraMarca(isOutra)
        reset({
          marca: isOutra ? 'Outra' : a.marca,
          marcaOutro: isOutra ? a.marca : '',
          modelo: a.modelo,
          placa: a.placa,
          matricula: a.matricula,
          ano: a.ano,
          disponivel: a.disponivel,
        })
      })
      .catch(() => toast.error('Automóvel não encontrado.'))
      .finally(() => setFetchLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    const marcaFinal = data.marca === 'Outra' ? (data.marcaOutro || 'Outra') : data.marca
    const payload = {
      marca: marcaFinal,
      modelo: data.modelo,
      placa: data.placa.toUpperCase(),
      matricula: data.matricula,
      ano: parseInt(data.ano),
      disponivel: data.disponivel,
    }
    try {
      if (isEdit) {
        await automovelApi.update(id, payload)
        toast.success('Automóvel atualizado!')
        navigate('/automoveis')
      } else {
        await automovelApi.create(payload)
        toast.success('Automóvel cadastrado!')
        navigate('/automoveis')
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar.')
    }
  }

  if (fetchLoading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm animate-pulse">Carregando…</div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Link to="/automoveis" className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {isEdit ? 'Editar Automóvel' : 'Novo Automóvel'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isEdit ? 'Atualize os dados do veículo' : 'Preencha os dados do veículo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Section icon={Car} title="Dados do Veículo">
          <div className="space-y-4">
            {/* Marca */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Marca" required error={errors.marca?.message}>
                <select
                  {...register('marca', { required: 'Obrigatório' })}
                  className={inputCls(errors.marca) + ' appearance-none'}
                  onChange={e => {
                    setValue('marca', e.target.value)
                    setOutraMarca(e.target.value === 'Outra')
                  }}
                >
                  <option value="">Selecione…</option>
                  {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              {(marcaVal === 'Outra' || outraMarca) ? (
                <Field label="Qual marca?" required error={errors.marcaOutro?.message}>
                  <input {...register('marcaOutro', { required: marcaVal === 'Outra' ? 'Obrigatório' : false })}
                    className={inputCls(errors.marcaOutro)} placeholder="Nome da marca" />
                </Field>
              ) : (
                <Field label="Modelo" required error={errors.modelo?.message}>
                  <input {...register('modelo', { required: 'Obrigatório' })}
                    className={inputCls(errors.modelo)} placeholder="Ex: Corolla, Civic, HB20…" />
                </Field>
              )}
            </div>

            {(marcaVal === 'Outra' || outraMarca) && (
              <Field label="Modelo" required error={errors.modelo?.message}>
                <input {...register('modelo', { required: 'Obrigatório' })}
                  className={inputCls(errors.modelo)} placeholder="Ex: Corolla, Civic, HB20…" />
              </Field>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Placa" required error={errors.placa?.message}>
                <input
                  {...register('placa', {
                    required: 'Obrigatório',
                    minLength: { value: 7, message: 'Placa inválida' },
                  })}
                  className={inputCls(errors.placa)}
                  placeholder="ABC-1234"
                  maxLength={8}
                  style={{ textTransform: 'uppercase' }}
                />
              </Field>
              <Field label="Matrícula" required error={errors.matricula?.message}>
                <input {...register('matricula', { required: 'Obrigatório' })}
                  className={inputCls(errors.matricula)} placeholder="Ex: 12345-SP" />
              </Field>
              <Field label="Ano" required error={errors.ano?.message}>
                <input
                  type="number"
                  {...register('ano', {
                    required: 'Obrigatório',
                    min: { value: 1950, message: 'Ano inválido' },
                    max: { value: currentYear + 1, message: 'Ano inválido' },
                  })}
                  className={inputCls(errors.ano)}
                  placeholder={String(currentYear)}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit py-2">
              <input type="checkbox" {...register('disponivel')}
                className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm text-slate-700 font-medium">Disponível para aluguel</span>
            </label>
          </div>
        </Section>

        {/* Rodapé */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-8">
          <Link to="/automoveis" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50 px-6 py-2.5">
            {isSubmitting
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Salvando…</>
              : <><Save className="w-4 h-4" />{isEdit ? 'Atualizar' : 'Cadastrar'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
