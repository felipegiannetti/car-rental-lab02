import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Car,
  Server,
  Layers,
  Code2,
  Database,
  Globe,
  Zap,
  Package,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

const DIAGRAMAS = {
  implantacao: '/diagramas/diagramadeimplantacao.png',
  componentes: '/diagramas/diagrama-componentes.png',
  classes: '/diagramas/diagramadeclasses.png',
  pacotes: '/diagramas/diagramadepacotes.png',
}

function SlideWrapper({ children, dark = false }) {
  return (
    <div
      className="min-h-full w-full"
      style={
        dark
          ? { background: 'linear-gradient(145deg, #012910 0%, #022015 60%, #011a0d 100%)' }
          : { background: '#f2f2f2' }
      }
    >
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}

function Tag({ children, accent }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold sm:text-xs"
      style={
        accent
          ? { background: '#78de1f', color: '#004521', border: '1px solid #5fbe0f' }
          : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }
      }
    >
      {children}
    </span>
  )
}

function SlideHeader({ icon: Icon, title, subtitle, badge, dark = false }) {
  return (
    <div className="mb-4 flex flex-wrap items-start gap-3 sm:mb-5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={dark ? { background: 'rgba(120,222,31,0.15)', border: '1px solid rgba(120,222,31,0.3)' } : { background: '#f2fde0' }}
      >
        <Icon className="h-4 w-4" style={{ color: dark ? '#78de1f' : '#004521' }} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className={`font-display text-xl font-bold sm:text-2xl ${dark ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h2>
        <p className={`mt-1 text-xs sm:text-sm ${dark ? 'text-white/45' : 'text-slate-400'}`}>{subtitle}</p>
      </div>
      {badge ? (
        <span
          className="rounded-full px-3 py-1 text-[11px] font-semibold sm:text-xs"
          style={dark ? { background: 'rgba(120,222,31,0.15)', color: '#78de1f' } : { background: '#f2fde0', color: '#004521' }}
        >
          {badge}
        </span>
      ) : null}
    </div>
  )
}

function DiagramPanel({ src, alt, padding = 'p-3 sm:p-4' }) {
  return (
    <div
      className={`min-h-[220px] rounded-2xl border border-[#d6d6d6] bg-white ${padding} flex items-center justify-center sm:min-h-[320px] lg:min-h-[420px]`}
      style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.07)' }}
    >
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
    </div>
  )
}

function SlideCapa() {
  return (
    <SlideWrapper dark>
      <div className="relative flex min-h-[calc(100dvh-180px)] flex-1 flex-col items-center justify-center overflow-hidden px-2 py-10 text-center sm:px-6">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 sm:h-[500px] sm:w-[500px]"
          style={{ background: 'radial-gradient(circle, #78de1f 0%, transparent 70%)' }}
        />

        <div
          className="mb-2 flex h-16 w-16 items-center justify-center rounded-3xl shadow-2xl sm:h-20 sm:w-20"
          style={{ background: '#78de1f', boxShadow: '0 8px 40px rgba(120,222,31,0.45)' }}
        >
          <Car className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: '#004521' }} />
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Car Rental
          </h1>
          <p className="mt-2 text-base sm:text-xl" style={{ color: '#78de1f' }}>
            Sistema de Aluguel e Compra de Veiculos
          </p>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Projeto desenvolvido para a disciplina de Projeto de Software, com apresentacao da arquitetura, tecnologias e decisoes tecnicas do sistema.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Tag>Projeto de Software</Tag>
          <Tag accent>4o Periodo</Tag>
          <Tag>2026</Tag>
        </div>
      </div>
    </SlideWrapper>
  )
}

function SlideImplantacao() {
  return (
    <SlideWrapper>
      <div className="flex flex-1 flex-col">
        <SlideHeader
          icon={Server}
          title="Diagrama de Implantacao"
          subtitle="Arquitetura fisica e comunicacao entre os nos da solucao."
          badge="Arquitetura Final"
        />

        <div className="flex flex-1 flex-col gap-4">
          <DiagramPanel src={DIAGRAMAS.implantacao} alt="Diagrama de Implantacao" padding="p-2 sm:p-3" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Servidor Frontend', desc: 'React + Vite na porta 5173' },
              { label: 'Servidor Backend', desc: 'Flask e API REST na porta 8080' },
              { label: 'Dispositivo do Usuario', desc: 'Browser web com persistencia local' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[#c9f485] bg-[#f2fde0] px-3 py-3">
                <p className="text-xs font-bold text-[#004521] sm:text-sm">{item.label}</p>
                <p className="mt-1 text-xs text-[#004521]/70 sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

function SlideComponentes() {
  return (
    <SlideWrapper>
      <div className="flex flex-1 flex-col">
        <SlideHeader
          icon={Layers}
          title="Diagrama de Componentes"
          subtitle="Visao dos modulos principais e das interfaces de comunicacao."
        />

        <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <DiagramPanel src={DIAGRAMAS.componentes} alt="Diagrama de Componentes" padding="p-3 sm:p-4" />

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 xl:content-start">
            <p className="col-span-full text-xs font-bold uppercase tracking-wider text-slate-400">Componentes principais</p>
            {[
              { name: 'Portal React', desc: 'Cliente e agente' },
              { name: 'API Gateway', desc: 'Controllers REST' },
              { name: 'Gestao de Pedidos', desc: 'Fluxo de aluguel e compra' },
              { name: 'Analise Financeira', desc: 'Parecer financeiro' },
              { name: 'Motor de Contratos', desc: 'Emissao e vinculo' },
              { name: 'IAM', desc: 'Identidade e acesso' },
              { name: 'Catalogo de Veiculos', desc: 'Registro e consulta' },
              { name: 'Persistencia', desc: 'MySQL / SQLite ORM' },
            ].map((item) => (
              <div key={item.name} className="rounded-xl border border-[#efefef] bg-[#fafafa] px-3 py-2.5">
                <p className="text-xs font-semibold text-slate-800 sm:text-sm">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

function SlideClasses() {
  return (
    <SlideWrapper>
      <div className="flex flex-1 flex-col">
        <SlideHeader
          icon={Code2}
          title="Diagrama de Classes"
          subtitle="Modelo de dominio com entidades e relacionamentos centrais."
        />

        <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <DiagramPanel src={DIAGRAMAS.classes} alt="Diagrama de Classes" />

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 xl:content-start">
            <p className="col-span-full text-xs font-bold uppercase tracking-wider text-slate-400">Entidades do dominio</p>
            {[
              'Usuario',
              'Cliente',
              'Agente',
              'Automovel',
              'PedidoAluguel',
              'Contrato',
              'Renda',
              'AvaliacaoFinanceira',
              'ContratoCredito',
              'Banco',
              'Empresa',
              'Propriedade',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-[#efefef] bg-white px-3 py-2.5">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#78de1f' }} />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

function SlideTecnologias() {
  const frontend = [
    { name: 'React 18', desc: 'UI declarativa baseada em componentes', tag: 'Core' },
    { name: 'Vite 5', desc: 'Build com HMR veloz', tag: 'Tooling' },
    { name: 'Tailwind CSS 3', desc: 'Estilizacao utility-first', tag: 'Styling' },
    { name: 'React Router v6', desc: 'Roteamento SPA', tag: 'Routing' },
    { name: 'React Hook Form', desc: 'Gerenciamento de formularios', tag: 'Forms' },
    { name: 'Axios', desc: 'Cliente HTTP para a API', tag: 'HTTP' },
    { name: 'Lucide React', desc: 'Icones SVG', tag: 'Icons' },
    { name: 'React Hot Toast', desc: 'Feedback visual', tag: 'UX' },
  ]

  const backend = [
    { name: 'Flask 3', desc: 'Microframework web Python', tag: 'Core' },
    { name: 'Flask-SQLAlchemy', desc: 'ORM integrado ao Flask', tag: 'ORM' },
    { name: 'SQLAlchemy 2', desc: 'Mapeamento objeto-relacional', tag: 'DB' },
    { name: 'Flask-CORS', desc: 'Cross-Origin Resource Sharing', tag: 'API' },
    { name: 'Werkzeug', desc: 'Hash de senha e utilitarios', tag: 'Security' },
    { name: 'PyMySQL', desc: 'Driver MySQL', tag: 'Driver' },
    { name: 'python-dotenv', desc: 'Variaveis de ambiente', tag: 'Config' },
    { name: 'SQLite', desc: 'Banco local em desenvolvimento', tag: 'DB Dev' },
  ]

  const Column = ({ icon: Icon, title, subtitle, items }) => (
    <div className="flex min-h-0 flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: '#004521' }} />
        <span className="text-xs font-bold uppercase tracking-wider text-[#004521]">{title}</span>
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {items.map((item) => (
          <div key={item.name} className="flex items-start justify-between gap-2 rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">{item.name}</p>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">{item.desc}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#f2fde0] px-2 py-0.5 text-[11px] font-medium text-[#004521]">
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <SlideWrapper>
      <div className="flex flex-1 flex-col">
        <SlideHeader
          icon={Package}
          title="Tecnologias e Dependencias"
          subtitle="Stack completa do projeto, do frontend ao backend."
        />

        <div className="grid flex-1 gap-5 xl:grid-cols-2">
          <Column icon={Globe} title="Frontend" subtitle="React + Vite" items={frontend} />
          <Column icon={Server} title="Backend" subtitle="Python + Flask" items={backend} />
        </div>
      </div>
    </SlideWrapper>
  )
}

function SlideMicronaut() {
  return (
    <SlideWrapper dark>
      <div className="flex flex-1 flex-col">
        <SlideHeader
          icon={Zap}
          title="Por que abandonei o Micronaut"
          subtitle="Decisao tecnica da migracao de Micronaut para Flask."
          dark
        />

        <div className="grid flex-1 gap-4 xl:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Micronaut - tentativa inicial</span>
            </div>

            <div className="flex h-full flex-col gap-3 rounded-2xl border border-[rgba(217,32,32,0.2)] bg-[rgba(217,32,32,0.08)] p-4">
              <div className="flex items-start gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Startup rapido, mas com custo alto de configuracao</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55 sm:text-sm">
                    O Micronaut oferece boa performance, mas exigiu mais configuracao estrutural do que o projeto precisava para o prazo e para o objetivo academico.
                  </p>
                </div>
              </div>

              {[
                'Curva de aprendizado maior para um escopo curto.',
                'Documentacao e exemplos menos acessiveis para o contexto do projeto.',
                'Integracao com banco gerou mais atrito no ambiente local.',
                'O tempo investido em setup nao compensou o ganho operacional.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="text-xs text-white/55 sm:text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#78de1f]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#78de1f]">Flask - solucao adotada</span>
            </div>

            <div className="flex h-full flex-col gap-3 rounded-2xl border border-[rgba(120,222,31,0.2)] bg-[rgba(120,222,31,0.07)] p-4">
              <div className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#78de1f]" />
                <div>
                  <p className="text-sm font-semibold text-white">Produtividade imediata</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55 sm:text-sm">
                    O Flask entregou uma estrutura simples, flexivel e suficiente para a API REST, permitindo foco direto na logica de negocio e no aprendizado.
                  </p>
                </div>
              </div>

              {[
                'Setup simples e rapido para desenvolvimento.',
                'Integracao direta com Flask-SQLAlchemy.',
                'Blueprints facilitaram a organizacao por dominio.',
                'Curva de aprendizado mais suave para Python.',
                'Ecossistema forte para APIs REST.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#78de1f]" />
                  <p className="text-xs text-white/55 sm:text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[rgba(120,222,31,0.25)] bg-[rgba(120,222,31,0.1)] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#78de1f]" />
          <p className="text-xs leading-relaxed text-white/65 sm:text-sm">
            <span className="font-semibold text-white">Conclusao:</span> o Micronaut e forte para cenario corporativo, mas o Flask atendeu melhor ao equilibrio entre arquitetura, produtividade e aprendizado no contexto deste projeto.
          </p>
        </div>
      </div>
    </SlideWrapper>
  )
}

function SlidePacotes() {
  return (
    <SlideWrapper>
      <div className="flex flex-1 flex-col">
        <SlideHeader
          icon={Database}
          title="Diagrama de Pacotes"
          subtitle="Separacao em camadas e responsabilidades do sistema."
        />

        <div className="flex flex-1 flex-col gap-4">
          <DiagramPanel src={DIAGRAMAS.pacotes} alt="Diagrama de Pacotes" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { pkg: 'view', items: 'Views de login, cadastro, pedidos, contratos e automoveis.' },
              { pkg: 'controller', items: 'Controllers REST para usuarios, clientes, pedidos e automoveis.' },
              { pkg: 'service', items: 'Regras de negocio, credito, contratos e avaliacao financeira.' },
              { pkg: 'repository', items: 'Repositorios de usuarios, pedidos, contratos, bancos e automoveis.' },
              { pkg: 'model', items: 'Entidades como Usuario, Cliente, Automovel, Pedido e Contrato.' },
            ].map((item) => (
              <div key={item.pkg} className="rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#004521]">{item.pkg}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">{item.items}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

const SLIDES = [
  { id: 'capa', label: 'Capa', component: SlideCapa },
  { id: 'implantacao', label: 'Implantacao', component: SlideImplantacao },
  { id: 'componentes', label: 'Componentes', component: SlideComponentes },
  { id: 'classes', label: 'Classes', component: SlideClasses },
  { id: 'pacotes', label: 'Pacotes', component: SlidePacotes },
  { id: 'tecnologias', label: 'Tecnologias', component: SlideTecnologias },
  { id: 'micronaut', label: 'Micronaut -> Flask', component: SlideMicronaut },
]

export default function SlidesPage() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= SLIDES.length || transitioning) return
      setTransitioning(true)
      setTimeout(() => {
        setCurrent(index)
        setTransitioning(false)
      }, 180)
    },
    [transitioning],
  )

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next()
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') prev()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const Slide = SLIDES[current].component

  return (
    <div
      className="flex min-h-[calc(100dvh-64px)] flex-col overflow-hidden rounded-[28px] border border-[#d6d6d6] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e8e8] bg-white px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">Slides</span>
            <span className="text-slate-200">.</span>
            <span className="truncate text-xs font-semibold text-slate-600 sm:text-sm">{SLIDES[current].label}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 sm:hidden">
            Use os controles abaixo para navegar.
          </p>
        </div>

        <div className="flex items-center gap-1">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goTo(index)}
              className="transition-all"
              style={{
                width: index === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: index === current ? '#78de1f' : '#d1d5db',
              }}
              title={slide.label}
            />
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          {current + 1} / {SLIDES.length}
        </span>
      </div>

      <div className="relative flex-1 overflow-auto">
        <div className="min-h-full transition-opacity duration-200" style={{ opacity: transitioning ? 0 : 1 }}>
          <Slide />
        </div>

        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute bottom-4 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all disabled:opacity-0 sm:left-4 sm:top-1/2 sm:-translate-y-1/2"
          style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)' }}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        <button
          onClick={next}
          disabled={current === SLIDES.length - 1}
          className="absolute bottom-4 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all disabled:opacity-0 sm:right-4 sm:top-1/2 sm:-translate-y-1/2"
          style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)' }}
          aria-label="Proximo slide"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto border-t border-[#e8e8e8] bg-white px-4 py-3 sm:px-5">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goTo(index)}
            className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
            style={
              index === current
                ? { background: '#78de1f', color: '#004521', border: '1px solid #5fbe0f' }
                : { background: '#fafafa', color: '#6b7280', border: '1px solid #e8e8e8' }
            }
          >
            {index + 1}. {slide.label}
          </button>
        ))}

        <span className="ml-auto hidden shrink-0 text-xs text-slate-300 sm:block">
          Use as setas do teclado para navegar
        </span>
      </div>
    </div>
  )
}
