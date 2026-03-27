import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { clienteApi } from '../api/clienteApi'
import { formatCPF, formatRG, rawDigits, PROFISSOES } from '../utils/masks'
import {
  ArrowLeft, Save, Camera, User, Lock, MapPin,
  DollarSign, X, AlertCircle, ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Avatar / foto upload ─────────────────────────────────────────────────────
function FotoUpload({ fotoUrl, onFoto }) {
  const inputRef = useRef()
  const [preview, setPreview] = useState(fotoUrl || null)
  const [drag, setDrag] = useState(false)

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      onFoto(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]) }}
        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-pointer overflow-hidden ring-4 transition-all duration-200
          ${drag ? 'ring-blue-400 scale-105' : 'ring-white shadow-lg hover:ring-blue-300'}`}
      >
        {preview ? (
          <img src={preview} alt="Foto" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <User className="w-9 h-9 sm:w-10 sm:h-10 text-slate-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-xs text-slate-400">Clique ou arraste uma imagem</p>
      {preview && (
        <button type="button" onClick={() => { setPreview(null); onFoto(null) }}
          className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" /> Remover foto
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => processFile(e.target.files[0])} />
    </div>
  )
}

// ── Seção do formulário ───────────────────────────────────────────────────────
function Section({ icon: Icon, title, children, badge }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-50 bg-slate-50/70">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        {badge && <span className="ml-auto text-xs text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap">{badge}</span>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}

// ── Campo com erro inline ─────────────────────────────────────────────────────
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
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150
   ${err ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ClienteFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [fotoBase64, setFotoBase64] = useState(null)
  const [cpfStatus, setCpfStatus] = useState(null)
  const cpfTimerRef = useRef(null)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      nomeUsuario: '', senha: '', nome: '', rg: '', cpf: '',
      endereco: '', profissao: '', semProfissao: false,
      renda1Entidade: '', renda1Valor: '', renda2Entidade: '',
      renda2Valor: '', renda3Entidade: '', renda3Valor: '',
    },
  })

  const semProfissao = watch('semProfissao')
  const profissaoValue = watch('profissao')
  const [outrosProfissao, setOutrosProfissao] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    clienteApi.getById(id)
      .then(c => {
        const prof = c.profissao ?? ''
        const isOutros = prof && !PROFISSOES.includes(prof) && prof !== 'Sem profissão'
        setOutrosProfissao(isOutros)
        reset({
          nomeUsuario: c.nomeUsuario ?? '',
          senha: '',
          nome: c.nome ?? '',
          rg: formatRG(c.rg ?? ''),
          cpf: formatCPF(c.cpf ?? ''),
          endereco: c.endereco ?? '',
          profissao: isOutros ? 'Outros' : (prof || ''),
          semProfissao: prof === 'Sem profissão',
          outrosProfissaoTexto: isOutros ? prof : '',
          renda1Entidade: c.rendas?.[0]?.entidadeEmpregadora ?? '',
          renda1Valor:    c.rendas?.[0]?.valorRendimento ?? '',
          renda2Entidade: c.rendas?.[1]?.entidadeEmpregadora ?? '',
          renda2Valor:    c.rendas?.[1]?.valorRendimento ?? '',
          renda3Entidade: c.rendas?.[2]?.entidadeEmpregadora ?? '',
          renda3Valor:    c.rendas?.[2]?.valorRendimento ?? '',
        })
        if (c.temFoto) setFotoBase64(clienteApi.fotoUrl(id) + '?t=' + Date.now())
      })
      .catch(() => toast.error('Cliente não encontrado.'))
      .finally(() => setFetchLoading(false))
  }, [id])

  const handleCpfChange = useCallback((raw) => {
    const digits = rawDigits(raw)
    if (digits.length !== 11) { setCpfStatus(null); return }
    setCpfStatus('checking')
    clearTimeout(cpfTimerRef.current)
    cpfTimerRef.current = setTimeout(async () => {
      try {
        const res = await clienteApi.buscarPorCpf(digits)
        if (res.encontrado && (!isEdit || String(res.id) !== id)) {
          setCpfStatus(res)
        } else {
          setCpfStatus(null)
        }
      } catch { setCpfStatus(null) }
    }, 600)
  }, [isEdit, id])

  const onSubmit = async (data) => {
    let profissaoFinal = data.semProfissao
      ? 'Sem profissão'
      : (data.profissao === 'Outros' ? (data.outrosProfissaoTexto || 'Outros') : data.profissao)

    const payload = {
      nomeUsuario: data.nomeUsuario,
      nome: data.nome,
      rg: rawDigits(data.rg),
      cpf: rawDigits(data.cpf),
      endereco: data.endereco,
      profissao: profissaoFinal,
      fotoBase64: typeof fotoBase64 === 'string' && fotoBase64.startsWith('data:') ? fotoBase64 : null,
      renda1Entidade: data.renda1Entidade || null,
      renda1Valor:    data.renda1Valor ? parseFloat(data.renda1Valor) : null,
      renda2Entidade: data.renda2Entidade || null,
      renda2Valor:    data.renda2Valor ? parseFloat(data.renda2Valor) : null,
      renda3Entidade: data.renda3Entidade || null,
      renda3Valor:    data.renda3Valor ? parseFloat(data.renda3Valor) : null,
    }
    if (data.senha) payload.senha = data.senha

    try {
      if (isEdit) {
        await clienteApi.update(id, payload)
        toast.success('Cliente atualizado!')
        navigate(`/clientes/${id}`)
      } else {
        const created = await clienteApi.create(payload)
        toast.success('Cliente cadastrado!')
        navigate(`/clientes/${created.id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar.')
    }
  }

  if (fetchLoading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm animate-pulse">
      Carregando…
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Link to="/clientes" className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isEdit ? 'Atualize os dados do cadastro' : 'Preencha os dados para cadastrar um novo cliente'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Foto */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex justify-center">
          <FotoUpload
            fotoUrl={typeof fotoBase64 === 'string' && fotoBase64.startsWith('data:') ? fotoBase64 : (fotoBase64 || null)}
            onFoto={setFotoBase64}
          />
        </div>

        {/* Acesso */}
        <Section icon={Lock} title="Dados de Acesso">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Usuário" required error={errors.nomeUsuario?.message}>
              <input {...register('nomeUsuario', { required: 'Obrigatório' })}
                className={inputCls(errors.nomeUsuario)} placeholder="login" />
            </Field>
            <Field label={isEdit ? 'Senha (opcional)' : 'Senha'} error={errors.senha?.message}>
              <input type="password"
                {...register('senha', {
                  required: !isEdit ? 'Obrigatório' : false,
                  validate: v => !v || v.length >= 6 || 'Mínimo 6 caracteres',
                })}
                className={inputCls(errors.senha)}
                placeholder={isEdit ? 'Deixe em branco para manter' : 'mínimo 6 caracteres'} />
            </Field>
          </div>
        </Section>

        {/* Pessoais */}
        <Section icon={User} title="Dados Pessoais">
          <div className="space-y-4">
            <Field label="Nome Completo" required error={errors.nome?.message}>
              <input {...register('nome', { required: 'Obrigatório' })}
                className={inputCls(errors.nome)} placeholder="Nome completo" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CPF */}
              <Field label="CPF" required error={errors.cpf?.message}>
                <div className="relative">
                  <input
                    {...register('cpf', {
                      required: 'Obrigatório',
                      validate: v => rawDigits(v).length === 11 || 'CPF inválido (11 dígitos)',
                    })}
                    className={inputCls(errors.cpf) + ' pr-8'}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value)
                      setValue('cpf', formatted, { shouldValidate: false })
                      handleCpfChange(formatted)
                    }}
                  />
                  {cpfStatus === 'checking' && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {cpfStatus && cpfStatus !== 'checking' && (
                    <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                  )}
                </div>
                {cpfStatus && cpfStatus !== 'checking' && (
                  <p className="flex items-center gap-1 text-xs text-amber-600 mt-1 font-medium flex-wrap">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    CPF já cadastrado: <span className="font-bold">{cpfStatus.nome}</span>
                    <Link to={`/clientes/${cpfStatus.id}/editar`} className="underline ml-1">ver cadastro</Link>
                  </p>
                )}
              </Field>

              {/* RG */}
              <Field label="RG" required error={errors.rg?.message}>
                <input
                  {...register('rg', { required: 'Obrigatório' })}
                  className={inputCls(errors.rg)}
                  placeholder="00.000.000-0"
                  maxLength={12}
                  onChange={(e) => setValue('rg', formatRG(e.target.value), { shouldValidate: false })}
                />
              </Field>
            </div>

            <Field label="Endereço" required error={errors.endereco?.message}>
              <input {...register('endereco', { required: 'Obrigatório' })}
                className={inputCls(errors.endereco)} placeholder="Rua, número, cidade — UF" />
            </Field>

            {/* Profissão */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                <input type="checkbox" {...register('semProfissao')}
                  className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm text-slate-600">Não possuo profissão</span>
              </label>

              {!semProfissao && (
                <Field label="Profissão" error={errors.profissao?.message}>
                  <div className="relative">
                    <select
                      {...register('profissao', { required: !semProfissao && 'Selecione a profissão' })}
                      className={inputCls(errors.profissao) + ' appearance-none pr-8'}
                      onChange={(e) => {
                        setValue('profissao', e.target.value)
                        setOutrosProfissao(e.target.value === 'Outros')
                      }}
                    >
                      <option value="">Selecione…</option>
                      {PROFISSOES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {(profissaoValue === 'Outros' || outrosProfissao) && (
                    <input
                      {...register('outrosProfissaoTexto')}
                      className={inputCls(false) + ' mt-2'}
                      placeholder="Descreva a profissão…"
                    />
                  )}
                </Field>
              )}
            </div>
          </div>
        </Section>

        {/* Rendimentos */}
        <Section icon={DollarSign} title="Rendimentos" badge="máx. 3 entidades">
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Entidade {n}
                  </label>
                  <input {...register(`renda${n}Entidade`)}
                    className={inputCls(false)} placeholder="Nome da empresa / órgão" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Valor (R$)
                  </label>
                  <input type="number" step="0.01" min="0"
                    {...register(`renda${n}Valor`)}
                    className={inputCls(false)} placeholder="0,00" />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Rodapé */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-8">
          <Link to="/clientes" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 px-6 py-2.5">
            {isSubmitting
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Salvando…</>
              : <><Save className="w-4 h-4" />{isEdit ? 'Atualizar' : 'Cadastrar'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
