import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Car, AlertCircle, Camera, X, Gauge, KeyRound, ShoppingBag } from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
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
      {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3 shrink-0" />{error}</p>}
    </div>
  )
}

function FotoUpload({ fotoUrl, onFoto, onRemove }) {
  const inputRef = useRef()
  const [preview, setPreview] = useState(fotoUrl || null)
  const [drag, setDrag] = useState(false)

  useEffect(() => {
    setPreview(fotoUrl || null)
  }, [fotoUrl])

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target.result)
      onFoto(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]) }}
        className={`relative w-full max-w-md aspect-[16/10] rounded-3xl cursor-pointer overflow-hidden ring-2 transition-all duration-200 ${drag ? 'ring-blue-400 scale-[1.01]' : 'ring-slate-200 shadow-sm hover:ring-blue-300'}`}
      >
        {preview ? (
          <img src={preview} alt="Foto do automovel" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
              <Car className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium">Clique ou arraste a foto do anuncio</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-white flex items-center gap-2">
            <Camera className="w-4 h-4" /> Alterar imagem
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-slate-400">A imagem sera salva em bytes no banco de dados.</span>
        {preview && <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-600 inline-flex items-center gap-1"><X className="w-3 h-3" /> Remover foto</button>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => processFile(e.target.files[0])} />
    </div>
  )
}

function ModeCard({ icon: Icon, title, description, checked, registerKey, register }) {
  return (
    <label className={`rounded-2xl border p-4 cursor-pointer transition-all ${checked ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <input type="checkbox" {...register(registerKey)} className="sr-only" />
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </label>
  )
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${err ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`

const MARCAS = ['Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'Outra']
const currentYear = new Date().getFullYear()

export default function AutomovelFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { user, isAdmin, isAuthenticated } = useAuth()
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [outraMarca, setOutraMarca] = useState(false)
  const [fotoBase64, setFotoBase64] = useState(null)
  const [removeFoto, setRemoveFoto] = useState(false)
  const [anuncianteId, setAnuncianteId] = useState(null)
  const [forbidden, setForbidden] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      marca: '',
      marcaOutro: '',
      modelo: '',
      placa: '',
      matricula: '',
      quilometragem: 0,
      ano: currentYear,
      disponivel: true,
      aceitaAluguel: true,
      aceitaCompra: true,
    },
  })

  const marcaVal = watch('marca')
  const aceitaAluguel = watch('aceitaAluguel')
  const aceitaCompra = watch('aceitaCompra')

  useEffect(() => {
    if (!isEdit) return
    automovelApi.getById(id)
      .then((automovel) => {
        const isOutra = !MARCAS.slice(0, -1).includes(automovel.marca)
        const canEdit = isAdmin || (user?.id && automovel.anuncianteId === user.id)
        if (!canEdit) {
          setForbidden(true)
          toast.error('Voce nao pode editar este anuncio.')
          return
        }

        setAnuncianteId(automovel.anuncianteId)
        setOutraMarca(isOutra)
        reset({
          marca: isOutra ? 'Outra' : automovel.marca,
          marcaOutro: isOutra ? automovel.marca : '',
          modelo: automovel.modelo,
          placa: automovel.placa,
          matricula: automovel.matricula,
          quilometragem: automovel.quilometragem ?? 0,
          ano: automovel.ano,
          disponivel: automovel.disponivel,
          aceitaAluguel: automovel.aceitaAluguel,
          aceitaCompra: automovel.aceitaCompra,
        })
        if (automovel.temFoto) setFotoBase64(`${automovelApi.fotoUrl(id)}?t=${Date.now()}`)
      })
      .catch(() => toast.error('Automovel nao encontrado.'))
      .finally(() => setFetchLoading(false))
  }, [id, isAdmin, isEdit, reset, user?.id])

  useEffect(() => {
    if (aceitaAluguel || aceitaCompra) clearErrors('modalidades')
  }, [aceitaAluguel, aceitaCompra, clearErrors])

  const onSubmit = async (data) => {
    if (!data.aceitaAluguel && !data.aceitaCompra) {
      setError('modalidades', { type: 'manual', message: 'Selecione pelo menos uma modalidade.' })
      toast.error('Selecione pelo menos uma modalidade para o anuncio.')
      return
    }

    const marcaFinal = data.marca === 'Outra' ? (data.marcaOutro || 'Outra') : data.marca
    const payload = {
      marca: marcaFinal,
      modelo: data.modelo,
      placa: data.placa.toUpperCase(),
      matricula: data.matricula,
      quilometragem: parseInt(data.quilometragem, 10),
      ano: parseInt(data.ano, 10),
      disponivel: data.disponivel,
      aceitaAluguel: data.aceitaAluguel,
      aceitaCompra: data.aceitaCompra,
      fotoBase64: typeof fotoBase64 === 'string' && fotoBase64.startsWith('data:') ? fotoBase64 : null,
      removerFoto: removeFoto,
    }

    try {
      if (isEdit) {
        await automovelApi.update(id, payload)
        toast.success('Anuncio atualizado!')
        navigate(`/automoveis/${id}`)
      } else {
        const created = await automovelApi.create(payload)
        toast.success('Anuncio cadastrado!')
        navigate(`/automoveis/${created.id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar.')
    }
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (fetchLoading) return <div className="flex items-center justify-center h-64 text-slate-400 text-sm animate-pulse">Carregando...</div>
  if (forbidden) return <Navigate to="/automoveis" replace />

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to={isEdit ? `/automoveis/${id}` : '/automoveis'} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">{isEdit ? 'Editar anuncio' : 'Novo anuncio de carro'}</h1>
          <p className="text-xs sm:text-sm text-slate-400">{isEdit ? 'Atualize os dados e a imagem do anuncio' : 'Preencha os dados do carro e publique o anuncio'}</p>
        </div>
      </div>

      {isEdit && anuncianteId && !isAdmin && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Este anuncio pertence a sua conta e pode ser editado ou excluido por voce.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Section icon={Camera} title="Imagem do anuncio">
          <FotoUpload
            fotoUrl={typeof fotoBase64 === 'string' && fotoBase64.startsWith('data:') ? fotoBase64 : (fotoBase64 || null)}
            onFoto={(value) => { setRemoveFoto(false); setFotoBase64(value) }}
            onRemove={() => { setFotoBase64(null); setRemoveFoto(true) }}
          />
        </Section>

        <Section icon={Car} title="Dados do veiculo">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Marca" required error={errors.marca?.message}>
                <select
                  {...register('marca', { required: 'Obrigatorio' })}
                  className={inputCls(errors.marca) + ' appearance-none'}
                  onChange={(e) => { setValue('marca', e.target.value); setOutraMarca(e.target.value === 'Outra') }}
                >
                  <option value="">Selecione...</option>
                  {MARCAS.map((marca) => <option key={marca} value={marca}>{marca}</option>)}
                </select>
              </Field>
              {(marcaVal === 'Outra' || outraMarca)
                ? <Field label="Qual marca?" required error={errors.marcaOutro?.message}><input {...register('marcaOutro', { required: marcaVal === 'Outra' ? 'Obrigatorio' : false })} className={inputCls(errors.marcaOutro)} placeholder="Nome da marca" /></Field>
                : <Field label="Modelo" required error={errors.modelo?.message}><input {...register('modelo', { required: 'Obrigatorio' })} className={inputCls(errors.modelo)} placeholder="Ex: Corolla, Civic, HB20..." /></Field>}
            </div>

            {(marcaVal === 'Outra' || outraMarca) && (
              <Field label="Modelo" required error={errors.modelo?.message}>
                <input {...register('modelo', { required: 'Obrigatorio' })} className={inputCls(errors.modelo)} placeholder="Ex: Corolla, Civic, HB20..." />
              </Field>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Field label="Placa" required error={errors.placa?.message}>
                <input {...register('placa', { required: 'Obrigatorio', minLength: { value: 7, message: 'Placa invalida' } })} className={inputCls(errors.placa)} placeholder="ABC-1234" maxLength={8} style={{ textTransform: 'uppercase' }} />
              </Field>
              <Field label="Matricula" required error={errors.matricula?.message}>
                <input {...register('matricula', { required: 'Obrigatorio' })} className={inputCls(errors.matricula)} placeholder="12345-SP" />
              </Field>
              <Field label="Ano" required error={errors.ano?.message}>
                <input type="number" {...register('ano', { required: 'Obrigatorio', min: { value: 1950, message: 'Ano invalido' }, max: { value: currentYear + 1, message: 'Ano invalido' } })} className={inputCls(errors.ano)} placeholder={String(currentYear)} />
              </Field>
              <Field label="Km" required error={errors.quilometragem?.message}>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min="0" {...register('quilometragem', { required: 'Obrigatorio', min: { value: 0, message: 'Km invalida' } })} className={inputCls(errors.quilometragem) + ' pl-10'} placeholder="0" />
                </div>
              </Field>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit py-2">
              <input type="checkbox" {...register('disponivel')} className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm text-slate-700 font-medium">Disponivel para novos pedidos</span>
            </label>
          </div>
        </Section>

        <Section icon={KeyRound} title="Modalidades do anuncio">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ModeCard
                icon={KeyRound}
                title="Aceita aluguel"
                description="O carro pode receber pedidos com periodo de uso."
                checked={!!aceitaAluguel}
                registerKey="aceitaAluguel"
                register={register}
              />
              <ModeCard
                icon={ShoppingBag}
                title="Aceita compra"
                description="O carro pode receber pedidos de compra e negociacao."
                checked={!!aceitaCompra}
                registerKey="aceitaCompra"
                register={register}
              />
            </div>
            {errors.modalidades?.message && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.modalidades.message}
              </p>
            )}
            <p className="text-sm text-slate-500">
              Voce pode publicar o mesmo anuncio para aluguel, compra ou ambos.
            </p>
          </div>
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-3 pb-8">
          <Link to={isEdit ? `/automoveis/${id}` : '/automoveis'} className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Cancelar</Link>
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50 px-6 py-2.5">
            {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Salvando...</> : <><Save className="w-4 h-4" />{isEdit ? 'Atualizar anuncio' : 'Publicar anuncio'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
