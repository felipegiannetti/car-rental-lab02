import {
  AlertCircle, Bell, Car, CheckCircle2, Clock, Copy,
  Filter, FolderKanban, Gauge, HandCoins, KeyRound, Layers,
  LogIn, MousePointerClick, Palette, Pencil, Plus, Search,
  ShoppingBag, Sparkles, Star, Trash2, Type, Users, XCircle, Zap,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

/* ─── Design tokens (single source of truth) ─────────── */
const tokens = {
  /* Brand */
  lime:        '#78de1f',
  limeHover:   '#8fd828',
  limeLight:   '#f2fde0',
  limeBorder:  '#c9f485',
  forest:      '#004521',
  forestMid:   '#01602a',
  teal:        '#018444',

  /* Sidebar */
  sidebarBg:   '#012910',

  /* Neutrals */
  bg:          '#f2f2f2',
  surface:     '#ffffff',
  text:        '#383838',
  textSub:     '#5e5e5e',
  textMuted:   '#919191',
  border:      '#d6d6d6',

  /* Semantic */
  success:     '#018444',
  warning:     '#ffcf33',
  danger:      '#d92020',
  info:        '#007dbb',
}

/* ─── Helpers ─────────────────────────────────────────── */
function Section({ id, icon: Icon, title, subtitle, children }) {
  return (
    <section id={id} className="space-y-5 scroll-mt-8">
      <div className="flex items-center gap-3 pb-4" style={{ borderBottom: `1px solid ${tokens.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tokens.limeLight, border: `1px solid ${tokens.limeBorder}` }}>
          <Icon className="w-5 h-5" style={{ color: tokens.forest }} />
        </div>
        <div>
          <h2 className="text-xl" style={{ color: tokens.text }}>{title}</h2>
          {subtitle && <p className="text-sm mt-0.5" style={{ color: tokens.textSub }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl bg-white ${className}`}
      style={{ border: `1px solid ${tokens.border}`, boxShadow: '0 2px 4px 1px rgba(15,23,42,0.06)' }}
    >
      {children}
    </div>
  )
}

function Swatch({ name, hex, textDark = false }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    await navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <button
      onClick={handleCopy}
      className="overflow-hidden rounded-2xl text-left transition hover:-translate-y-0.5"
      style={{ border: `1px solid ${tokens.border}`, boxShadow: '0 2px 6px rgba(15,23,42,0.05)' }}
    >
      <div className="h-20 flex items-end p-3" style={{ background: hex }}>
        <span className="rounded-lg px-2 py-1 text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.25)', color: textDark ? '#004521' : '#fff' }}>
          {copied ? '✓ Copiado' : hex}
        </span>
      </div>
      <div className="bg-white p-3">
        <p className="text-sm font-semibold" style={{ color: tokens.text }}>{name}</p>
        <p className="mt-0.5 text-xs font-mono" style={{ color: tokens.textMuted }}>{hex}</p>
      </div>
    </button>
  )
}

function Token({ name, value }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${tokens.border}` }}>
      <code className="text-xs font-mono" style={{ color: tokens.textMuted }}>{name}</code>
      <span className="text-sm font-medium" style={{ color: tokens.text }}>{value}</span>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────── */
export default function DesignPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-14 pb-20" style={{ color: tokens.text }}>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-10 sm:px-12 sm:py-14"
        style={{
          background: 'linear-gradient(155deg, #012910 0%, #022015 55%, #011a0d 100%)',
          boxShadow: '0 16px 40px rgba(1,41,16,0.35)',
        }}
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-20" style={{ background: tokens.lime, filter: 'blur(40px)' }} />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full border border-white/[0.08]" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full border border-white/[0.05]" />

        <div className="relative">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(120,222,31,0.15)', color: tokens.lime, border: '1px solid rgba(120,222,31,0.25)' }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Car Rental Design System
          </div>
          <h1 className="text-4xl sm:text-5xl text-white mb-3" style={{ fontFamily: '"Racing Sans One", sans-serif' }}>
            Design System
          </h1>
          <p className="max-w-xl text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Guia visual com cores, tipografia, componentes e tokens. Inspirado no Localiza Meoo — verde lima como primária, verde floresta como dark surface.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {[
              ['#colors', 'Cores'], ['#typography', 'Tipografia'],
              ['#components', 'Componentes'], ['#tokens', 'Tokens'],
            ].map(([href, label]) => (
              <a key={href} href={href}
                className="rounded-2xl px-4 py-2 text-sm font-semibold transition hover:-translate-y-px"
                style={{ background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Colors ── */}
      <Section id="colors" icon={Palette} title="Paleta de Cores" subtitle="Baseada na Localiza Meoo — verde lima como primária">

        {/* Brand swatches */}
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: tokens.forest }}>
            Verde Lima (Primária)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { name: 'Brand 50',  hex: '#f2fde0' },
              { name: 'Brand 100', hex: '#e3fac0' },
              { name: 'Brand 300', hex: '#a8e64e' },
              { name: 'Brand 500', hex: '#78de1f' },
              { name: 'Brand 900', hex: '#004521' },
            ].map(s => <Swatch key={s.hex} {...s} textDark={s.hex === '#f2fde0' || s.hex === '#e3fac0' || s.hex === '#a8e64e'} />)}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: tokens.forest }}>
            Semânticas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Swatch name="Success" hex="#018444" />
            <Swatch name="Warning" hex="#ffcf33" textDark />
            <Swatch name="Danger"  hex="#d92020" />
            <Swatch name="Info"    hex="#007dbb" />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: tokens.forest }}>
            Neutros & Superfícies
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Swatch name="Sidebar BG"  hex="#012910" />
            <Swatch name="Body BG"     hex="#f2f2f2" textDark />
            <Swatch name="Text"        hex="#383838" />
            <Swatch name="Text Sub"    hex="#5e5e5e" />
            <Swatch name="Muted"       hex="#919191" />
            <Swatch name="Border"      hex="#d6d6d6" textDark />
            <Swatch name="Lime Light"  hex="#f2fde0" textDark />
            <Swatch name="Surface"     hex="#ffffff" textDark />
          </div>
        </Card>
      </Section>

      {/* ── Typography ── */}
      <Section id="typography" icon={Type} title="Tipografia" subtitle="Manrope para corpo, Racing Sans One para títulos">
        <div className="space-y-5">
          <Card className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Manrope */}
              <div className="rounded-2xl border p-5" style={{ borderColor: tokens.border, background: '#fafafa' }}>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: tokens.textMuted }}>Fonte de corpo</p>
                <p className="text-2xl font-bold mb-1" style={{ color: tokens.text }}>Manrope</p>
                <p className="text-sm leading-relaxed" style={{ color: tokens.textSub }}>
                  Usada em todo o corpo: formulários, tabelas, labels, botões, navegação e texto geral.
                </p>
                <div className="mt-4 space-y-2 text-sm border-t pt-4" style={{ borderColor: tokens.border }}>
                  {[
                    { w: '800', label: 'ExtraBold — headings' },
                    { w: '700', label: 'Bold — destaques' },
                    { w: '600', label: 'SemiBold — botões, labels' },
                    { w: '500', label: 'Medium — default' },
                    { w: '400', label: 'Regular — body' },
                  ].map(({ w, label }) => (
                    <p key={w} className={`font-[${w}]`} style={{ color: tokens.text, fontWeight: w }}>{label}</p>
                  ))}
                </div>
              </div>
              {/* Racing Sans One */}
              <div className="rounded-2xl border p-5" style={{ borderColor: tokens.limeBorder, background: tokens.limeLight }}>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: tokens.forest }}>Fonte de títulos</p>
                <p className="text-2xl mb-1" style={{ fontFamily: '"Racing Sans One", sans-serif', color: tokens.forest }}>Racing Sans One</p>
                <p className="text-sm leading-relaxed" style={{ color: tokens.forestMid }}>
                  Usada exclusivamente em: h1, h2, h3, logos, headers de página e classe <code className="font-mono text-xs">.font-display</code>.
                </p>
                <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: tokens.limeBorder, fontFamily: '"Racing Sans One", sans-serif' }}>
                  <p className="text-3xl" style={{ color: tokens.forest }}>Heading 1 — 30px</p>
                  <p className="text-2xl" style={{ color: tokens.forest }}>Heading 2 — 24px</p>
                  <p className="text-xl"  style={{ color: tokens.forest }}>Heading 3 — 20px</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Scale */}
          <Card className="p-6">
            <p className="section-title">Escala tipográfica (Manrope)</p>
            {[
              { cls: 'text-3xl font-bold',   label: '3xl Bold — 30px — Títulos de página' },
              { cls: 'text-xl font-semibold', label: 'XL SemiBold — 20px — Sub-títulos' },
              { cls: 'text-base font-medium', label: 'Base Medium — 16px — Corpo padrão' },
              { cls: 'text-sm font-normal',   label: 'SM Regular — 14px — Texto secundário' },
              { cls: 'text-xs font-semibold uppercase tracking-widest', label: 'XS UPPERCASE — Labels' },
            ].map(({ cls, label }) => (
              <p key={label} className={`py-2 border-b last:border-0 ${cls}`} style={{ color: tokens.text, borderColor: tokens.border }}>{label}</p>
            ))}
          </Card>
        </div>
      </Section>

      {/* ── Components ── */}
      <Section id="components" icon={Layers} title="Componentes" subtitle="Botões, inputs, badges, cards e tabelas">

        {/* Buttons */}
        <Card className="p-6 space-y-5">
          <p className="section-title"><MousePointerClick className="w-4 h-4" /> Botões</p>

          <div>
            <p className="label mb-3">Primário (lime verde — texto floresta)</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary"><Plus className="w-4 h-4" /> Primary</button>
              <button className="btn-primary"><Car className="w-4 h-4" /> Novo anúncio</button>
              <button className="btn-primary" disabled>Desabilitado</button>
            </div>
          </div>

          <div>
            <p className="label mb-3">Secundário (branco + borda)</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary"><Pencil className="w-4 h-4" /> Secondary</button>
              <button className="btn-secondary"><Filter className="w-4 h-4" /> Filtrar</button>
              <button className="btn-secondary" disabled>Desabilitado</button>
            </div>
          </div>

          <div>
            <p className="label mb-3">Perigo (vermelho)</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-danger"><Trash2 className="w-4 h-4" /> Excluir</button>
              <button className="btn-danger" disabled>Desabilitado</button>
            </div>
          </div>

          <div className="rounded-xl p-4 text-sm" style={{ background: tokens.limeLight, border: `1px solid ${tokens.limeBorder}` }}>
            <p className="font-semibold mb-1" style={{ color: tokens.forest }}>Classes CSS</p>
            <p style={{ color: tokens.forestMid }}>
              <code className="font-mono text-xs">.btn-primary</code> — lime (#78de1f) bg, forest (#004521) text, border-radius 16px<br />
              <code className="font-mono text-xs">.btn-secondary</code> — white bg, slate border, subtle shadow<br />
              <code className="font-mono text-xs">.btn-danger</code> — #d92020 bg, white text
            </p>
          </div>
        </Card>

        {/* Inputs */}
        <Card className="p-6 space-y-5">
          <p className="section-title">Campos de formulário</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Campo padrão</label>
              <input className="input-field" placeholder="ex: Toyota Corolla" />
            </div>
            <div>
              <label className="label">Com erro</label>
              <input className="input-field input-error" defaultValue="valor inválido" />
              <p className="text-xs mt-1" style={{ color: tokens.danger }}>Campo obrigatório.</p>
            </div>
            <div>
              <label className="label">Select</label>
              <select className="input-field">
                <option>Aluguel</option>
                <option>Compra</option>
              </select>
            </div>
            <div>
              <label className="label">Textarea</label>
              <textarea className="input-field resize-none h-20" placeholder="Observações..." />
            </div>
          </div>
          <div className="rounded-xl p-4 text-sm" style={{ background: tokens.limeLight, border: `1px solid ${tokens.limeBorder}` }}>
            <p style={{ color: tokens.forestMid }}>
              Focus ring: <code className="font-mono text-xs">box-shadow: 0 0 0 2px #78de1f</code> — classe <code className="font-mono text-xs">.input-field</code>
            </p>
          </div>
        </Card>

        {/* Badges */}
        <Card className="p-6 space-y-5">
          <p className="section-title">Badges e Status</p>

          <div>
            <p className="label mb-2">Status de anúncios</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> Disponível</span>
              <span className="badge bg-amber-50 text-amber-700 border-amber-200"><Car className="w-3.5 h-3.5" /> Em uso</span>
              <span className="badge bg-[#f2fde0] text-[#004521] border-[#c9f485]"><HandCoins className="w-3.5 h-3.5" /> Em negociação</span>
              <span className="badge bg-rose-50 text-rose-700 border-rose-200"><XCircle className="w-3.5 h-3.5" /> Indisponível</span>
            </div>
          </div>

          <div>
            <p className="label mb-2">Status de pedidos</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3.5 h-3.5" /> Pendente</span>
              <span className="badge bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> Aprovado</span>
              <span className="badge bg-red-50 text-red-700 border-red-200"><XCircle className="w-3.5 h-3.5" /> Reprovado</span>
              <span className="badge bg-slate-100 text-slate-500 border-slate-200"><AlertCircle className="w-3.5 h-3.5" /> Cancelado</span>
            </div>
          </div>

          <div>
            <p className="label mb-2">Modalidades</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-[#f2fde0] text-[#004521] border-[#c9f485]"><KeyRound className="w-3.5 h-3.5" /> Aluguel</span>
              <span className="badge bg-green-50 text-green-700 border-green-200"><ShoppingBag className="w-3.5 h-3.5" /> Compra</span>
            </div>
          </div>

          <div>
            <p className="label mb-2">Roles</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-[#f2fde0] text-[#004521] border-[#c9f485]"><Users className="w-3.5 h-3.5" /> ADMIN</span>
              <span className="badge bg-slate-50 text-slate-600 border-slate-200"><Users className="w-3.5 h-3.5" /> CLIENTE</span>
            </div>
          </div>
        </Card>

        {/* Stat cards */}
        <Card className="p-6 space-y-5">
          <p className="section-title">Stat Cards</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ background: tokens.limeLight, borderColor: tokens.limeBorder }}>
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shadow-sm shrink-0"><Car className="w-5 h-5" style={{ color: tokens.forest }} /></div>
              <div style={{ color: tokens.forest }}><p className="text-2xl font-bold">42</p><p className="text-xs font-medium opacity-70">Total anúncios</p></div>
            </div>
            <div className="rounded-2xl border bg-green-50 border-green-200 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shadow-sm shrink-0"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <div className="text-green-700"><p className="text-2xl font-bold">31</p><p className="text-xs font-medium opacity-70">Disponíveis</p></div>
            </div>
            <div className="rounded-2xl border bg-rose-50 border-rose-200 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shadow-sm shrink-0"><XCircle className="w-5 h-5 text-rose-500" /></div>
              <div className="text-rose-700"><p className="text-2xl font-bold">11</p><p className="text-xs font-medium opacity-70">Ocupados</p></div>
            </div>
          </div>
        </Card>

        {/* Section card */}
        <Card className="p-6 space-y-4">
          <p className="section-title">Section card com header</p>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: tokens.border }}>
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ background: '#fafafa', borderColor: '#efefef' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: tokens.limeLight }}>
                <Car className="w-4 h-4" style={{ color: tokens.forest }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: tokens.text }}>Cabeçalho da seção</span>
            </div>
            <div className="p-5 bg-white">
              <p className="text-sm" style={{ color: tokens.textSub }}>Conteúdo da seção aqui, com padding e espaçamento padrão do sistema.</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <p className="section-title">Catalogo de automoveis</p>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div
              className="relative overflow-hidden rounded-[32px] p-5"
              style={{
                background: 'linear-gradient(165deg, #ffffff 0%, #f7f7f7 100%)',
                border: `1px solid ${tokens.border}`,
                boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
              }}
            >
              <div className="absolute left-[-8%] top-[18%] h-40 w-40 rounded-[46%]" style={{ background: '#96ea55' }} />
              <div className="absolute left-[34%] top-[6%] h-48 w-48 rounded-[48%]" style={{ background: '#8fe84c' }} />
              <div className="absolute right-[-10%] top-[18%] h-40 w-40 rounded-[46%]" style={{ background: '#96ea55' }} />
              <div className="relative">
                <p className="mb-3 inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ background: tokens.limeLight, color: tokens.forest }}>
                  Hero editorial
                </p>
                <h3 className="text-3xl" style={{ color: tokens.forest }}>Cards em vitrine</h3>
                <p className="mt-2 max-w-md text-sm" style={{ color: tokens.textSub }}>
                  A listagem principal de automoveis deixou de ser tabela e virou vitrine visual com foto grande, blobs lime e dados essenciais bem separados.
                </p>
                <div className="mt-5 rounded-[28px] border bg-white p-4" style={{ borderColor: tokens.border }}>
                  <div className="aspect-[16/10] rounded-[24px]" style={{ background: 'linear-gradient(135deg, #f7f7f7 0%, #ececec 100%)' }} />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border px-3 py-2.5" style={{ borderColor: '#e7e7e7', background: '#fafafa' }}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: tokens.textMuted }}>Ano</p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: tokens.text }}>2024</p>
                    </div>
                    <div className="rounded-2xl border px-3 py-2.5" style={{ borderColor: '#e7e7e7', background: '#fafafa' }}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: tokens.textMuted }}>Km</p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: tokens.text }}>12.000 km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border p-4" style={{ borderColor: tokens.limeBorder, background: tokens.limeLight }}>
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: tokens.forest }}>Direcao visual</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: tokens.forestMid }}>
                  Inspiracao no print do Meoo: fundo claro, formas orgânicas lime, carro em destaque central e leitura por cards.
                </p>
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor: tokens.border, background: '#fafafa' }}>
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: tokens.textSub }}>Hierarquia da informacao</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: tokens.textSub }}>
                  1. Foto e status. 2. Marca/modelo. 3. Chips de modalidade. 4. Ano, km, placa e anunciante. 5. Acoes.
                </p>
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor: tokens.border, background: '#ffffff' }}>
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: tokens.textSub }}>Componentes usados</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: tokens.textSub }}>
                  Hero editorial + carrossel autoplay de 3s com slide horizontal + stat cards + painel de filtros + vehicle cards com media 16:10 e acoes persistentes.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Radii */}
        <Card className="p-6">
          <p className="section-title">Raios de borda</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'rounded-xl',   px: '12px', cls: 'rounded-xl'   },
              { label: 'rounded-2xl',  px: '16px', cls: 'rounded-2xl'  },
              { label: 'rounded-3xl',  px: '24px', cls: 'rounded-3xl'  },
              { label: 'rounded-pill', px: '400px', cls: 'rounded-full' },
            ].map(({ label, px, cls }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`w-full h-16 border-2 ${cls}`} style={{ background: tokens.limeLight, borderColor: tokens.limeBorder }} />
                <div className="text-center">
                  <p className="text-xs font-mono font-semibold" style={{ color: tokens.text }}>{label}</p>
                  <p className="text-[11px]" style={{ color: tokens.textMuted }}>{px}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* ── Icons ── */}
      <Section id="icons" icon={Zap} title="Ícones" subtitle="lucide-react — ícones usados no sistema">
        <Card className="p-6">
          <p className="text-xs mb-5" style={{ color: tokens.textMuted }}>
            Pacote: <code className="font-mono" style={{ color: tokens.forest }}>lucide-react</code>.
            Tamanho padrão: <code className="font-mono" style={{ color: tokens.forest }}>w-4 h-4</code> em listas,
            <code className="font-mono" style={{ color: tokens.forest }}> w-5 h-5</code> em destaques.
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[
              [Car, 'Car'], [Users, 'Users'], [Bell, 'Bell'], [Search, 'Search'],
              [Filter, 'Filter'], [Plus, 'Plus'], [Pencil, 'Pencil'], [Trash2, 'Trash2'],
              [CheckCircle2, 'Check'], [XCircle, 'XCircle'], [AlertCircle, 'Alert'], [Clock, 'Clock'],
              [HandCoins, 'HandCoins'], [KeyRound, 'KeyRound'], [ShoppingBag, 'ShoppingBag'], [Gauge, 'Gauge'],
              [Palette, 'Palette'], [Sparkles, 'Sparkles'], [Star, 'Star'], [LogIn, 'LogIn'],
              [FolderKanban, 'Folder'], [Layers, 'Layers'], [Copy, 'Copy'], [Zap, 'Zap'],
            ].map(([Icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-default hover:bg-[#f9fef0]">
                <Icon className="w-5 h-5" style={{ color: tokens.textSub }} />
                <span className="text-[10px] text-center leading-tight" style={{ color: tokens.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* ── Tokens ── */}
      <Section id="tokens" icon={Sparkles} title="Tokens de Design" subtitle="Referência rápida de valores e variáveis">
        <div className="grid sm:grid-cols-2 gap-5">
          <Card className="p-5">
            <p className="section-title">Cores principais</p>
            <Token name="lime (primária)"    value="#78de1f" />
            <Token name="forest (dark)"      value="#004521" />
            <Token name="teal (secondary)"   value="#018444" />
            <Token name="sidebar bg"         value="#012910" />
            <Token name="body background"    value="#f2f2f2" />
            <Token name="border"             value="#d6d6d6" />
          </Card>
          <Card className="p-5">
            <p className="section-title">Sombras</p>
            <Token name="card"      value="0 2px 4px 1px rgba(15,23,42,0.06)" />
            <Token name="card-md"   value="0 4px 16px 2px rgba(15,23,42,0.10)" />
            <Token name="btn-lime"  value="0 4px 16px rgba(120,222,31,0.35)" />
            <Token name="btn-danger" value="0 4px 14px rgba(217,32,32,0.25)" />
            <Token name="hero-shell" value="0 16px 40px rgba(1,41,16,0.35)" />
          </Card>
          <Card className="p-5">
            <p className="section-title">Breakpoints (Tailwind)</p>
            <Token name="sm"  value="640px" />
            <Token name="md"  value="768px — sidebar fixa" />
            <Token name="lg"  value="1024px" />
            <Token name="xl"  value="1280px" />
          </Card>
          <Card className="p-5">
            <p className="section-title">Animações</p>
            <Token name="fade-in"    value="fadeIn 0.3s ease — entrada de páginas" />
            <Token name="spin"       value="spin 1s linear — loading spinners" />
            <Token name="pulse"      value="pulse 2s ease — skeleton state" />
            <Token name="duration"   value="150ms — transições hover/focus" />
            <Token name="hero-carousel" value="autoplay 3000ms + slide horizontal 700ms ease-out" />
          </Card>
          <Card className="p-5 sm:col-span-2">
            <p className="section-title">Referência de inspiração</p>
            <Token name="Fonte de inspiração" value="Localiza Meoo — meoo.localiza.com" />
            <Token name="Primária original"   value="#78de1f (Lime Green Meoo)" />
            <Token name="Dark original"       value="#004521 (Deep Forest Meoo)" />
            <Token name="Background original" value="#f2f2f2 (Light Gray Meoo)" />
            <Token name="Border radius (Meoo)" value="16px soft, 400px pill" />
          </Card>
        </div>
      </Section>

      {/* ── Toast ── */}
      <Section id="toasts" icon={Bell} title="Notificações Toast" subtitle="react-hot-toast com estilos customizados">
        <Card className="p-6 space-y-4">
          <p className="text-sm" style={{ color: tokens.textSub }}>
            Fonte Manrope, posição top-right, duração 3.5s.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => toast.success('Operação realizada!')}>
              <CheckCircle2 className="w-4 h-4" /> Toast Success
            </button>
            <button className="btn-danger" onClick={() => toast.error('Erro inesperado.')}>
              <XCircle className="w-4 h-4" /> Toast Error
            </button>
            <button className="btn-secondary" onClick={() => toast('Informação importante.')}>
              <Bell className="w-4 h-4" /> Toast Info
            </button>
          </div>
        </Card>
      </Section>

    </div>
  )
}
