import {
  AlertCircle,
  Bell,
  Car,
  CheckCircle2,
  ClipboardList,
  Copy,
  Filter,
  FolderKanban,
  Gauge,
  HandCoins,
  KeyRound,
  Layers,
  MousePointerClick,
  Palette,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Type,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const brand = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  900: '#1e3a8a',
}

function Section({ id, icon: Icon, title, subtitle, children }) {
  return (
    <section id={id} className="space-y-5 scroll-mt-8">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: brand[50], border: `1px solid ${brand[100]}` }}
        >
          <Icon className="h-5 w-5" style={{ color: brand[600] }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white ${className}`}
      style={{ boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}
    >
      {children}
    </div>
  )
}

function Swatch({ name, hex }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      onClick={handleCopy}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5"
      style={{ boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)' }}
    >
      <div className="flex h-24 items-end p-3" style={{ backgroundColor: hex }}>
        <span className="rounded-lg bg-black/30 px-2 py-1 text-xs font-semibold text-white">
          {copied ? 'Copiado' : hex}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-slate-800">{name}</p>
        <p className="mt-1 text-xs text-slate-500">{hex}</p>
      </div>
    </button>
  )
}

function Token({ name, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
      <code className="text-xs text-slate-500">{name}</code>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  )
}

function PrimaryButton({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px"
      style={{ backgroundColor: brand[600], boxShadow: '0 8px 20px rgba(37, 99, 235, 0.28)' }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-px hover:bg-slate-50"
    >
      {children}
    </button>
  )
}

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-14 pb-20 text-slate-900">
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-10 sm:px-12 sm:py-12"
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #1e3a8a 100%)',
          boxShadow: '0 16px 40px rgba(37, 99, 235, 0.24)',
        }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/10" />

        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
            <Sparkles className="h-4 w-4" />
            Car Rental Design System
          </div>
          <h1
            className="mb-3 text-4xl text-white sm:text-5xl"
            style={{ fontFamily: '"Racing Sans One", sans-serif' }}
          >
            Design System
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-blue-100">
            Guia visual com cores, tipografia, componentes e tokens usados no sistema.
            Esta versao foi deixada com estilos explicitos para ficar legivel mesmo quando o Tailwind customizado falhar no dev server.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#colors" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">Cores</a>
            <a href="#typography" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">Tipografia</a>
            <a href="#components" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">Componentes</a>
            <a href="#tokens" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">Tokens</a>
          </div>
        </div>
      </div>

      <Section id="colors" icon={Palette} title="Paleta de cores" subtitle="Base visual do produto">
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <Swatch name="Brand 50" hex={brand[50]} />
            <Swatch name="Brand 100" hex={brand[100]} />
            <Swatch name="Brand 300" hex={brand[300]} />
            <Swatch name="Brand 600" hex={brand[600]} />
            <Swatch name="Brand 900" hex={brand[900]} />
            <Swatch name="Success" hex="#22c55e" />
            <Swatch name="Warning" hex="#f59e0b" />
            <Swatch name="Danger" hex="#dc2626" />
            <Swatch name="Sidebar" hex="#080d1a" />
            <Swatch name="Surface" hex="#f0f4ff" />
          </div>
        </Card>
      </Section>

      <Section id="typography" icon={Type} title="Tipografia" subtitle="Hierarquia e fontes">
        <div className="space-y-5">
          <Card className="p-6">
            <p className="mb-4 text-sm font-semibold text-slate-800">Fontes usadas no site</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Fonte principal</p>
                <p className="text-2xl text-slate-900" style={{ fontFamily: '"Manrope", sans-serif' }}>Manrope</p>
                <p className="mt-2 text-sm text-slate-600">
                  Usada no corpo do site, formulários, menu lateral, botões, badges e textos em geral.
                </p>
              </div>
              <div className="rounded-2xl border p-5" style={{ borderColor: brand[100], backgroundColor: brand[50] }}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: brand[700] }}>Fonte de títulos</p>
                <p className="text-2xl" style={{ fontFamily: '"Racing Sans One", sans-serif', color: brand[900] }}>Racing Sans One</p>
                <p className="mt-2 text-sm text-slate-600">
                  Mantida para títulos, headings e elementos de identidade visual como a marca do sistema.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: brand[50], color: brand[700] }}>
              Titulos
            </div>
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h1 className="text-5xl leading-none text-slate-900" style={{ fontFamily: '"Racing Sans One", sans-serif' }}>Heading 1</h1>
              <h2 className="text-4xl leading-none text-slate-800" style={{ fontFamily: '"Racing Sans One", sans-serif' }}>Heading 2</h2>
              <h3 className="text-3xl leading-none text-slate-700" style={{ fontFamily: '"Racing Sans One", sans-serif' }}>Heading 3</h3>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Texto corrido
            </div>
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <p className="text-xl font-bold text-slate-800" style={{ fontFamily: '"Manrope", sans-serif' }}>XL Bold - 20px</p>
              <p className="text-lg font-semibold text-slate-700" style={{ fontFamily: '"Manrope", sans-serif' }}>LG Semibold - 18px</p>
              <p className="text-base font-medium text-slate-700" style={{ fontFamily: '"Manrope", sans-serif' }}>Base Medium - 16px</p>
              <p className="text-sm text-slate-600" style={{ fontFamily: '"Manrope", sans-serif' }}>SM Regular - 14px</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Label - 12px</p>
            </div>
          </Card>
        </div>
        </div>
      </Section>

      <Section id="components" icon={Layers} title="Componentes" subtitle="Elementos recorrentes da interface">
        <div className="space-y-5">
          <Card className="p-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <MousePointerClick className="h-4 w-4" style={{ color: brand[600] }} />
              Botoes
            </p>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton><Plus className="h-4 w-4" /> Novo anuncio</PrimaryButton>
              <SecondaryButton><Pencil className="h-4 w-4" /> Editar</SecondaryButton>
              <SecondaryButton><Search className="h-4 w-4" /> Buscar</SecondaryButton>
              <SecondaryButton><Filter className="h-4 w-4" /> Filtrar</SecondaryButton>
              <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white">
                <Trash2 className="h-4 w-4" /> Excluir
              </button>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-6">
              <p className="mb-4 text-sm font-semibold text-slate-800">Campos</p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">Modelo</label>
                  <input className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500" placeholder="Toyota Corolla" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">Tipo</label>
                  <select className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500">
                    <option>Aluguel</option>
                    <option>Compra</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="mb-4 text-sm font-semibold text-slate-800">Badges</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Disponivel
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <HandCoins className="h-3.5 w-3.5" /> Em negociacao
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  <KeyRound className="h-3.5 w-3.5" /> Aluguel
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                  <XCircle className="h-3.5 w-3.5" /> Indisponivel
                </span>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5 text-blue-700" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs font-medium text-blue-700/80">Automoveis</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 text-emerald-700" style={{ backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' }}>
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs font-medium text-emerald-700/80">Anuncios ativos</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 text-amber-700" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-xs font-medium text-amber-700/80">Pedidos pendentes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section id="tokens" icon={Gauge} title="Tokens" subtitle="Referencia rapida">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <p className="mb-3 text-sm font-semibold text-slate-800">Cores</p>
            <Token name="brand-600" value={brand[600]} />
            <Token name="brand-700" value={brand[700]} />
            <Token name="surface" value="#f0f4ff" />
            <Token name="sidebar" value="#080d1a" />
          </Card>
          <Card className="p-5">
            <p className="mb-3 text-sm font-semibold text-slate-800">Componentes e feedback</p>
            <Token name="radius-card" value="16px" />
            <Token name="shadow-card" value="0 8px 24px rgba(15,23,42,0.06)" />
            <Token name="font-display" value="Racing Sans One" />
            <Token name="toast" value="react-hot-toast" />
          </Card>
        </div>
      </Section>

      <Section id="toast" icon={Bell} title="Notificacoes" subtitle="Exemplos de feedback visual">
        <Card className="p-6">
          <p className="mb-4 text-sm text-slate-600">
            Botoes de demonstracao para testar os toasts do frontend e confirmar contraste e legibilidade.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton onClick={() => toast.success('Operacao realizada com sucesso!')}>
              <CheckCircle2 className="h-4 w-4" /> Toast success
            </PrimaryButton>
            <button
              type="button"
              onClick={() => toast.error('Ocorreu um erro inesperado.')}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <AlertCircle className="h-4 w-4" /> Toast error
            </button>
            <SecondaryButton onClick={() => toast('Informacao importante aqui.')}>
              <Copy className="h-4 w-4" /> Toast info
            </SecondaryButton>
          </div>
        </Card>
      </Section>

      <Section id="extra" icon={ShoppingBag} title="Icones base" subtitle="Conjunto visual principal da pagina">
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-8">
            {[Car, Bell, Palette, Type, Layers, Search, Star, Gauge, HandCoins, KeyRound, ShoppingBag, Sparkles].map((Icon, index) => (
              <div key={index} className="flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-slate-50">
                <Icon className="h-5 w-5 text-slate-600" />
                <span className="text-[11px] text-slate-500">Icone</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  )
}
