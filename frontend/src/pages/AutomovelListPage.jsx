import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarRange,
  Car,
  CheckCircle2,
  Filter,
  Gauge,
  HandCoins,
  KeyRound,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Trash2,
  User,
  XCircle,
} from 'lucide-react'
import { automovelApi } from '../api/automovelApi'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../context/AuthContext'
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
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, tone = 'lime' }) {
  const tones = {
    lime: {
      wrap: { background: '#f2fde0', borderColor: '#c9f485' },
      icon: { background: '#ffffff', color: '#004521' },
      text: '#004521',
      sub: '#01602a',
    },
    white: {
      wrap: { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.16)' },
      icon: { background: 'rgba(255,255,255,0.12)', color: '#ffffff' },
      text: '#ffffff',
      sub: 'rgba(255,255,255,0.68)',
    },
  }
  const meta = tones[tone] || tones.lime

  return (
    <div className="rounded-[28px] border p-4 sm:p-5" style={meta.wrap}>
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={meta.icon}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-extrabold" style={{ color: meta.text }}>{value}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: meta.sub }}>{label}</p>
        </div>
      </div>
    </div>
  )
}

function ModePills({ automovel }) {
  return (
    <div className="flex flex-wrap gap-2">
      {automovel.aceitaAluguel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2fde0] px-2.5 py-1 text-[11px] font-semibold text-[#004521]">
          <KeyRound className="h-3.5 w-3.5" />
          Aluguel
        </span>
      )}
      {automovel.aceitaCompra && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <ShoppingBag className="h-3.5 w-3.5" />
          Compra
        </span>
      )}
    </div>
  )
}

function VehicleVisual({ automovel }) {
  if (automovel.temFoto) {
    const fotoVersion = encodeURIComponent(automovel.fotoVersao || automovel.dataAtualizacao || automovel.id)
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[28px]">
        <img
          src={`${automovelApi.fotoUrl(automovel.id)}?v=${fotoVersion}`}
          alt={`${automovel.marca} ${automovel.modelo}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
    )
  }

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-[28px]"
      style={{ background: 'linear-gradient(135deg, #f7f7f7 0%, #ececec 100%)' }}
    >
      <div className="absolute left-[-6%] top-[14%] h-48 w-48 rounded-[46%]" style={{ background: '#96ea55' }} />
      <div className="absolute left-[32%] top-[6%] h-56 w-56 rounded-[48%]" style={{ background: '#8fe84c' }} />
      <div className="absolute right-[-8%] top-[16%] h-48 w-48 rounded-[46%]" style={{ background: '#96ea55' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-white/70 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur">
          <Car className="h-12 w-12 text-[#004521]" />
        </div>
      </div>
      <div className="absolute bottom-5 left-5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#004521] shadow-sm">
        {automovel.marca}
      </div>
    </div>
  )
}

function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#e7e7e7] bg-[#fafafa] px-3 py-2.5">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b8b8b]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="text-sm font-semibold text-[#383838]">{value}</p>
    </div>
  )
}

function VehicleCard({ automovel, canEdit, canDelete, onDelete }) {
  return (
    <article
      className="overflow-hidden rounded-[32px] border border-[#d8d8d8] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.10)]"
    >
      <div className="relative">
        <VehicleVisual automovel={automovel} />
        <div className="absolute left-4 top-4">
          <ModePills automovel={automovel} />
        </div>
        <div className="absolute right-4 top-4">
          <StatusBadge status={automovel.statusAnuncio} />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/automoveis/${automovel.id}`} className="block">
              <h2 className="text-2xl leading-tight text-[#17331a]" style={{ fontFamily: '"Racing Sans One", sans-serif' }}>
                {automovel.marca} {automovel.modelo}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-[#5e5e5e]">
              Visualizacao rapida do anuncio, com destaque para disponibilidade e forma de negociacao.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoChip icon={CalendarRange} label="Ano" value={String(automovel.ano)} />
          <InfoChip icon={Gauge} label="Km" value={`${Number(automovel.quilometragem ?? 0).toLocaleString('pt-BR')} km`} />
          <InfoChip icon={Car} label="Placa" value={automovel.placa} />
          <InfoChip icon={User} label="Anunciante" value={automovel.anuncianteNome || 'Sistema'} />
        </div>

        <div className="rounded-[26px] border border-[#e6efd6] bg-[#fbfef4] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#688164]">Matricula</p>
          <p className="mt-1 text-sm font-semibold text-[#383838]">{automovel.matricula}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link to={`/automoveis/${automovel.id}`} className="btn-primary">
            Ver detalhes
          </Link>
          {canEdit && (
            <Link to={`/automoveis/${automovel.id}/editar`} className="btn-secondary">
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          )}
          {canDelete && (
            <button onClick={() => onDelete(automovel)} className="btn-danger">
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function AutomovelListPage() {
  const { user, isAdmin, isAuthenticated } = useAuth()
  const [automoveis, setAutomoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [marca, setMarca] = useState('')
  const [maxKm, setMaxKm] = useState('')
  const [anoMin, setAnoMin] = useState('')
  const [anoMax, setAnoMax] = useState('')
  const [modalidade, setModalidade] = useState('TODOS')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    fetchAutomoveis()
  }, [])

  async function fetchAutomoveis() {
    setLoading(true)
    try {
      setAutomoveis(await automovelApi.getAll())
    } catch {
      toast.error('Erro ao carregar automoveis.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await automovelApi.remove(deleteTarget.id)
      setAutomoveis((prev) => prev.filter((automovel) => automovel.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.marca} ${deleteTarget.modelo}" removido.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir.')
    } finally {
      setDeleting(false)
    }
  }

  function resetFilters() {
    setSearch('')
    setMarca('')
    setMaxKm('')
    setAnoMin('')
    setAnoMax('')
    setModalidade('TODOS')
  }

  const marcas = [...new Set(automoveis.map((automovel) => automovel.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b))

  const filtered = useMemo(() => (
    automoveis.filter((automovel) => {
      const searchable = `${automovel.marca} ${automovel.modelo} ${automovel.placa} ${automovel.matricula} ${automovel.anuncianteNome ?? ''}`.toLowerCase()
      if (!searchable.includes(search.toLowerCase())) return false
      if (marca && automovel.marca !== marca) return false
      if (maxKm && Number(automovel.quilometragem ?? 0) > Number(maxKm)) return false
      if (anoMin && Number(automovel.ano) < Number(anoMin)) return false
      if (anoMax && Number(automovel.ano) > Number(anoMax)) return false
      if (modalidade === 'ALUGUEL' && !automovel.aceitaAluguel) return false
      if (modalidade === 'COMPRA' && !automovel.aceitaCompra) return false
      if (modalidade === 'AMBOS' && (!automovel.aceitaAluguel || !automovel.aceitaCompra)) return false
      return true
    })
  ), [anoMax, anoMin, automoveis, marca, maxKm, modalidade, search])

  const disponiveis = automoveis.filter((automovel) => automovel.statusAnuncio === 'DISPONIVEL').length
  const negociacao = automoveis.filter((automovel) => automovel.statusAnuncio === 'EM_NEGOCIACAO').length
  const heroSlides = useMemo(() => {
    const porschesDisponiveis = automoveis.filter((automovel) =>
      automovel.temFoto
      && automovel.statusAnuncio === 'DISPONIVEL'
      && String(automovel.marca || '').toLowerCase().includes('porsche')
    )
    if (porschesDisponiveis.length > 0) return porschesDisponiveis

    const porsches = automoveis.filter((automovel) =>
      automovel.temFoto && String(automovel.marca || '').toLowerCase().includes('porsche')
    )
    if (porsches.length > 0) return porsches

    return []
  }, [automoveis])
  const heroActive = heroSlides[heroIndex] || null

  useEffect(() => {
    if (heroSlides.length <= 1) {
      setHeroIndex(0)
      return
    }

    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [heroSlides.length])

  useEffect(() => {
    if (heroIndex >= heroSlides.length && heroSlides.length > 0) {
      setHeroIndex(0)
    }
  }, [heroIndex, heroSlides.length])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section
        className="relative overflow-hidden rounded-[40px] px-6 py-7 sm:px-8 sm:py-9"
        style={{
          background: 'linear-gradient(165deg, #ffffff 0%, #f7f7f7 100%)',
          border: '1px solid #d8d8d8',
          boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
        }}
      >
        <div className="absolute left-[-3%] top-[14%] h-48 w-48 rounded-[48%]" style={{ background: '#96ea55' }} />
        <div className="absolute left-[28%] top-[4%] h-60 w-60 rounded-[48%]" style={{ background: '#8fe84c' }} />
        <div className="absolute right-[-5%] top-[14%] h-52 w-52 rounded-[48%]" style={{ background: '#96ea55' }} />
        <div className="absolute bottom-4 left-0 right-0 mx-auto h-2.5 w-24 rounded-full bg-white/70" />
        <div className="absolute bottom-4 left-0 right-0 mx-auto flex w-24 items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
          <span className="h-2.5 w-10 rounded-full bg-[#004521]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
        </div>

        <div className="relative grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex rounded-full bg-[#f2fde0] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#01602a]">
              voce tem
            </div>
            <div>
              <h1 className="text-4xl leading-none text-[#004521] sm:text-5xl">Automoveis</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5e5e5e]">
                Visualize seus anuncios em cards mais claros, com destaque imediato para foto, status, modos de negocio e dados principais.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated && (
                <Link to="/automoveis/novo" className="btn-primary">
                  <Plus className="h-4 w-4" />
                  Novo anuncio
                </Link>
              )}
              <button type="button" onClick={resetFilters} className="btn-secondary">
                <RotateCcw className="h-4 w-4" />
                Limpar filtros
              </button>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[560px] items-center justify-center">
            <div className="relative w-full">
              <div className="mx-auto w-full max-w-[430px] overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${heroIndex * 100}%)` }}
                >
                  {heroSlides.length > 0 ? heroSlides.map((automovel) => (
                    <div key={automovel.id} className="flex w-full shrink-0 justify-center">
                      {automovel.temFoto ? (
                        <img
                          src={`${automovelApi.fotoUrl(automovel.id)}?v=${encodeURIComponent(automovel.fotoVersao || automovel.dataAtualizacao || automovel.id)}`}
                          alt={`${automovel.marca} ${automovel.modelo}`}
                          className="relative z-10 max-h-[290px] object-contain"
                        />
                      ) : (
                        <div className="relative z-10 flex h-[250px] w-full items-center justify-center">
                          <div className="rounded-[34px] bg-white/76 p-10 shadow-[0_18px_36px_rgba(0,0,0,0.12)]">
                            <Car className="h-24 w-24 text-[#004521]" />
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="relative z-10 flex h-[250px] w-full items-center justify-center">
                      <div className="rounded-[34px] bg-white/76 p-10">
                        <Car className="h-24 w-24 text-[#004521]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {heroActive && (
                <p className="mt-5 text-center text-[15px] font-medium text-[#4e5a5a]">
                  {heroActive.marca} {heroActive.modelo}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <div className="rounded-[28px] border border-[#c9f485] bg-[#f2fde0] px-5 py-4 text-sm text-[#004521] shadow-[0_8px_22px_rgba(120,222,31,0.12)]">
          Voce pode navegar pelos anuncios sem login. Clientes autenticados podem cadastrar carros e acompanhar pedidos.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Car} label="Total" value={automoveis.length} />
        <StatCard icon={CheckCircle2} label="Disponiveis" value={disponiveis} />
        <StatCard icon={HandCoins} label="Negociacao" value={negociacao} />
      </div>

      <section
        className="rounded-[32px] border border-[#d8d8d8] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f8ef] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#5d6d59]">
            <Filter className="h-3.5 w-3.5" />
            filtros
          </div>
          <span className="ml-auto text-xs font-semibold uppercase tracking-[0.16em] text-[#8f8f8f]">
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919191]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por marca, modelo, placa ou anunciante..."
              className="input-field pl-9"
            />
          </div>
          <select value={marca} onChange={(e) => setMarca(e.target.value)} className="input-field">
            <option value="">Todas as marcas</option>
            {marcas.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <div className="relative">
            <Gauge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919191]" />
            <input
              value={maxKm}
              onChange={(e) => setMaxKm(e.target.value)}
              type="number"
              min="0"
              placeholder="Ate quantos km?"
              className="input-field pl-9"
            />
          </div>
          <select value={modalidade} onChange={(e) => setModalidade(e.target.value)} className="input-field">
            <option value="TODOS">Compra e aluguel</option>
            <option value="ALUGUEL">Aceita aluguel</option>
            <option value="COMPRA">Aceita compra</option>
            <option value="AMBOS">Aceita ambos</option>
          </select>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <CalendarRange className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919191]" />
            <input
              value={anoMin}
              onChange={(e) => setAnoMin(e.target.value)}
              type="number"
              min="1950"
              placeholder="Ano minimo"
              className="input-field pl-9"
            />
          </div>
          <div className="relative">
            <CalendarRange className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919191]" />
            <input
              value={anoMax}
              onChange={(e) => setAnoMax(e.target.value)}
              type="number"
              min="1950"
              placeholder="Ano maximo"
              className="input-field pl-9"
            />
          </div>
          <div className="xl:col-span-2 flex flex-wrap gap-2">
            <button type="button" onClick={resetFilters} className="btn-secondary">
              <RotateCcw className="h-4 w-4" />
              Limpar
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-[32px] border border-[#d8d8d8] bg-white text-sm text-[#919191] shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          Carregando automoveis...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[32px] border border-[#d8d8d8] bg-white px-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#f2fde0]">
            <Car className="h-10 w-10 text-[#004521]" />
          </div>
          <h2 className="mt-5 text-2xl text-[#004521]">Nenhum automovel encontrado</h2>
          <p className="mt-2 max-w-md text-sm text-[#5e5e5e]">
            Ajuste os filtros ou publique um novo anuncio para preencher a vitrine de carros.
          </p>
          {!search && isAuthenticated && (
            <Link to="/automoveis/novo" className="btn-primary mt-5">
              <Plus className="h-4 w-4" />
              Publicar primeiro anuncio
            </Link>
          )}
        </div>
      ) : (
        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((automovel) => {
            const canEdit = !!user && (isAdmin || automovel.anuncianteId === user.id)
            const canDelete = canEdit
            return (
              <VehicleCard
                key={automovel.id}
                automovel={automovel}
                canEdit={canEdit}
                canDelete={canDelete}
                onDelete={setDeleteTarget}
              />
            )
          })}
        </section>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir anuncio"
        message={`Deseja excluir "${deleteTarget?.marca} ${deleteTarget?.modelo} (${deleteTarget?.placa})"? Esta acao nao pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        confirmLabel="Excluir"
        loadingLabel="Excluindo..."
        tone="danger"
      />
    </div>
  )
}
