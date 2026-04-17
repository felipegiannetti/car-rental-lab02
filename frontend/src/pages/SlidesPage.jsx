import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Car, Server, Layers, Code2, Database, Globe, Zap, Package, ArrowRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

// Diagram image imports (relative paths from public or via URL)
const DIAGRAMAS = {
  implantacao: '/diagramas/diagramadeimplantacao.png',
  componentes: '/diagramas/diagrama-componentes.png',
  classes: '/diagramas/diagramadeclasses.png',
  pacotes: '/diagramas/diagramadepacotes.png',
  casosDeUso: '/diagramas/casosdeuso.png',
  tentativa: '/diagramas/tentativadeInterfaces.png',
}

// ─── Slide components ────────────────────────────────────────────────────────

function SlideWrapper({ children, dark = false }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={dark
        ? { background: 'linear-gradient(145deg, #012910 0%, #022015 60%, #011a0d 100%)' }
        : { background: '#f2f2f2' }}
    >
      {children}
    </div>
  )
}

function Tag({ children, accent }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border"
      style={accent
        ? { background: '#78de1f', color: '#004521', border: '1px solid #5fbe0f' }
        : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
    >
      {children}
    </span>
  )
}

// ─── Slide 1: Capa ────────────────────────────────────────────────────────────
function SlideCapa() {
  return (
    <SlideWrapper dark>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-10 text-center relative overflow-hidden">
        {/* background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #78de1f 0%, transparent 70%)' }} />

        <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-2"
          style={{ background: '#78de1f', boxShadow: '0 8px 40px rgba(120,222,31,0.45)' }}>
          <Car className="w-10 h-10" style={{ color: '#004521' }} />
        </div>

        <div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight">
            Car Rental
          </h1>
          <p className="text-lg sm:text-xl mt-2" style={{ color: '#78de1f' }}>Sistema de Aluguel e Compra de Veiculos</p>
        </div>

        <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Projeto desenvolvido para a disciplina de Projeto de Software — apresentacao da arquitetura,
          tecnologias e decisoes tecnicas do sistema.
        </p>

        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <Tag>Projeto de Software</Tag>
          <Tag accent>4º Periodo</Tag>
          <Tag>2026</Tag>
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Slide 2: Diagrama de Implantação ────────────────────────────────────────
function SlideImplantacao() {
  return (
    <SlideWrapper>
      <div className="flex flex-col h-full">
        <div className="px-8 pt-7 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}>
            <Server className="w-4 h-4" style={{ color: '#004521' }} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Diagrama de Implantacao</h2>
            <p className="text-xs text-slate-400 mt-0.5">Arquitetura fisica — como os nos se comunicam em producao</p>
          </div>
          <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#f2fde0', color: '#004521' }}>
            Arquitetura Final
          </span>
        </div>

        <div className="flex-1 px-8 pb-6 flex flex-col gap-4 min-h-0">
          <div className="flex-1 rounded-2xl border border-[#d6d6d6] bg-white overflow-hidden flex items-center justify-center p-2 min-h-0"
            style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.07)' }}>
            <img
              src={DIAGRAMAS.implantacao}
              alt="Diagrama de Implantacao"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { label: 'Servidor Frontend', desc: 'React + Vite · porta 5173', color: '#f2fde0', text: '#004521' },
              { label: 'Servidor Backend', desc: 'Flask · API REST · porta 8080', color: '#f2fde0', text: '#004521' },
              { label: 'Dispositivo do Usuario', desc: 'Browser Web · LocalStorage JWT', color: '#f2fde0', text: '#004521' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border px-3 py-2.5" style={{ background: item.color, borderColor: '#c9f485' }}>
                <p className="text-xs font-bold" style={{ color: item.text }}>{item.label}</p>
                <p className="text-xs mt-0.5 opacity-70" style={{ color: item.text }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Slide 3: Diagrama de Componentes ────────────────────────────────────────
function SlideComponentes() {
  return (
    <SlideWrapper>
      <div className="flex flex-col h-full">
        <div className="px-8 pt-7 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}>
            <Layers className="w-4 h-4" style={{ color: '#004521' }} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Diagrama de Componentes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Modulos do sistema e suas interfaces de comunicacao</p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-6 flex gap-5 min-h-0">
          <div className="flex-1 rounded-2xl border border-[#d6d6d6] bg-white overflow-hidden flex items-center justify-center p-4 min-h-0"
            style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.07)' }}>
            <img
              src={DIAGRAMAS.componentes}
              alt="Diagrama de Componentes"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-52 shrink-0 flex flex-col gap-2.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Componentes principais</p>
            {[
              { name: 'Portal React', desc: 'Cliente / Agente' },
              { name: 'API Gateway', desc: 'Controllers REST' },
              { name: 'Gestao de Pedidos', desc: 'Fluxo de aluguel/compra' },
              { name: 'Analise Financeira', desc: 'Parecer financeiro' },
              { name: 'Motor de Contratos', desc: 'Emissao e vinculo' },
              { name: 'IAM', desc: 'Identidade e acesso' },
              { name: 'Catalogo de Veiculos', desc: 'Registro e consulta' },
              { name: 'Persistencia', desc: 'MySQL / SQLite ORM' },
            ].map((c) => (
              <div key={c.name} className="rounded-xl border px-3 py-2" style={{ background: '#fafafa', borderColor: '#efefef' }}>
                <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Slide 4: Diagrama de Classes ─────────────────────────────────────────────
function SlideClasses() {
  return (
    <SlideWrapper>
      <div className="flex flex-col h-full">
        <div className="px-8 pt-7 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}>
            <Code2 className="w-4 h-4" style={{ color: '#004521' }} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Diagrama de Classes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Modelo de dominio — entidades e seus relacionamentos</p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-6 flex gap-5 min-h-0">
          <div className="flex-1 rounded-2xl border border-[#d6d6d6] bg-white overflow-hidden flex items-center justify-center p-3 min-h-0"
            style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.07)' }}>
            <img
              src={DIAGRAMAS.classes}
              alt="Diagrama de Classes"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-52 shrink-0 flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Entidades do dominio</p>
            {[
              'Usuario', 'Cliente', 'Agente', 'Automovel',
              'PedidoAluguel', 'Contrato', 'Renda',
              'AvaliacaoFinanceira', 'ContratoCredito',
              'Banco', 'Empresa', 'Propriedade',
            ].map((e) => (
              <div key={e} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#78de1f' }} />
                <span className="text-xs text-slate-700 font-medium">{e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Slide 5: Tecnologias ─────────────────────────────────────────────────────
function SlideTecnologias() {
  const frontend = [
    { name: 'React 18', desc: 'UI declarativa baseada em componentes', tag: 'Core' },
    { name: 'Vite 5', desc: 'Build tool ultrarapido com HMR', tag: 'Tooling' },
    { name: 'Tailwind CSS 3', desc: 'Estilizacao utility-first', tag: 'Styling' },
    { name: 'React Router v6', desc: 'Roteamento SPA com navegacao aninhada', tag: 'Routing' },
    { name: 'React Hook Form', desc: 'Gerenciamento de formularios performatico', tag: 'Forms' },
    { name: 'Axios', desc: 'Cliente HTTP para consumo da API REST', tag: 'HTTP' },
    { name: 'Lucide React', desc: 'Biblioteca de icones SVG consistentes', tag: 'Icons' },
    { name: 'React Hot Toast', desc: 'Notificacoes toast nao-intrusivas', tag: 'UX' },
  ]
  const backend = [
    { name: 'Flask 3', desc: 'Microframework web Python', tag: 'Core' },
    { name: 'Flask-SQLAlchemy', desc: 'ORM integrado ao Flask', tag: 'ORM' },
    { name: 'SQLAlchemy 2', desc: 'Mapeamento objeto-relacional', tag: 'DB' },
    { name: 'Flask-CORS', desc: 'Cross-Origin Resource Sharing', tag: 'API' },
    { name: 'Werkzeug', desc: 'Utilitarios WSGI e hashing de senha', tag: 'Security' },
    { name: 'PyMySQL', desc: 'Driver MySQL puro Python', tag: 'Driver' },
    { name: 'python-dotenv', desc: 'Carregamento de variaveis de ambiente', tag: 'Config' },
    { name: 'SQLite', desc: 'Banco de dados local para desenvolvimento', tag: 'DB Dev' },
  ]

  return (
    <SlideWrapper>
      <div className="flex flex-col h-full">
        <div className="px-8 pt-7 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}>
            <Package className="w-4 h-4" style={{ color: '#004521' }} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Tecnologias e Dependencias</h2>
            <p className="text-xs text-slate-400 mt-0.5">Stack completa do projeto — frontend e backend</p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-6 grid grid-cols-2 gap-5 min-h-0">
          {/* Frontend */}
          <div className="flex flex-col gap-2 min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <Globe className="w-3.5 h-3.5" style={{ color: '#004521' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#004521' }}>Frontend</span>
              <span className="text-xs text-slate-400 ml-1">React + Vite · TypeScript-ready</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {frontend.map((dep) => (
                <div key={dep.name} className="rounded-xl border px-3 py-2 flex items-start justify-between gap-2"
                  style={{ background: '#fafafa', borderColor: '#e8e8e8' }}>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{dep.name}</p>
                    <p className="text-xs text-slate-400 truncate">{dep.desc}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: '#f2fde0', color: '#004521' }}>{dep.tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="flex flex-col gap-2 min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <Server className="w-3.5 h-3.5" style={{ color: '#004521' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#004521' }}>Backend</span>
              <span className="text-xs text-slate-400 ml-1">Python · Flask · SQLAlchemy</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {backend.map((dep) => (
                <div key={dep.name} className="rounded-xl border px-3 py-2 flex items-start justify-between gap-2"
                  style={{ background: '#fafafa', borderColor: '#e8e8e8' }}>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{dep.name}</p>
                    <p className="text-xs text-slate-400 truncate">{dep.desc}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: '#f2fde0', color: '#004521' }}>{dep.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Slide 6: Micronaut → Flask ───────────────────────────────────────────────
function SlideMicronaut() {
  return (
    <SlideWrapper dark>
      <div className="flex-1 flex flex-col px-8 pt-7 pb-6 gap-5 overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(120,222,31,0.15)', border: '1px solid rgba(120,222,31,0.3)' }}>
            <Zap className="w-4 h-4" style={{ color: '#78de1f' }} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Por que abandonei o Micronaut</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Decisao tecnica — migracao de Micronaut para Flask
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-5 min-h-0">
          {/* Coluna esquerda - Micronaut */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Micronaut — Tentativa inicial</span>
            </div>

            <div className="rounded-2xl p-4 flex flex-col gap-3 h-full"
              style={{ background: 'rgba(217,32,32,0.08)', border: '1px solid rgba(217,32,32,0.2)' }}>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Startup rapido — porem custo alto</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    O Micronaut e impressionante em tempo de inicializacao por fazer injecao de dependencias em tempo de compilacao.
                    Porem esse mesmo mecanismo exige uma configuracao extremamente verbosa e especifica para cada modulo.
                  </p>
                </div>
              </div>
              {[
                'Configuracao de beans exigia anotacoes especificas muito diferentes do Spring Boot — curva de aprendizado alta para o escopo do projeto',
                'Documentacao escassa em portugues e exemplos de uso menos difundidos na comunidade academica',
                'Integracao com banco de dados exigiu configuracoes adicionais de datasource que geravam conflitos com o ambiente de desenvolvimento local',
                'Para um projeto academico com prazo curto, o overhead de setup nao compensou o ganho de performance no startup',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna direita - Flask */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#78de1f' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#78de1f' }}>Flask — Solucao adotada</span>
            </div>

            <div className="rounded-2xl p-4 flex flex-col gap-3 h-full"
              style={{ background: 'rgba(120,222,31,0.07)', border: '1px solid rgba(120,222,31,0.2)' }}>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#78de1f' }} />
                <div>
                  <p className="text-xs font-semibold text-white">Produtividade imediata</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Migrei para Flask porque o microframework Python oferece tudo o que o projeto precisa
                    sem a rigidez de um framework corporativo. A filosofia minimalista do Flask
                    permitiu focar na logica de negocio, nao na infraestrutura do framework.
                  </p>
                </div>
              </div>
              {[
                'Setup em minutos: flask run e o servidor ja esta disponivel — zero XML, zero anotacoes de container',
                'Flask-SQLAlchemy integra ORM de forma direta, com migrations simples para o banco SQLite em desenvolvimento',
                'Blueprints organizam as rotas por dominio (automoveis, pedidos, usuarios) de forma identica a controllers',
                'Python e algo que eu estou aprendendo agora, entao usar Flask me permitiu aprender uma nova linguagem e framework ao mesmo tempo, com uma curva de aprendizado mais suave',
                'Comunidade vasta, documentacao clara e exemplos praticos abundantes para o caso de uso de API REST',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#78de1f' }} />
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(120,222,31,0.1)', border: '1px solid rgba(120,222,31,0.25)' }}>
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: '#78de1f' }} />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <span className="font-semibold text-white">Conclusao:</span> O Micronaut e uma excelente ferramenta para producao em escala,
            mas para um projeto academico com foco em aprendizado de arquitetura de software, Flask entregou a mesma estrutura
            de camadas (controllers, services, repositories) com muito menos atrito operacional.
          </p>
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Slide 7: Diagrama de Pacotes ─────────────────────────────────────────────
function SlidePacotes() {
  return (
    <SlideWrapper>
      <div className="flex flex-col h-full">
        <div className="px-8 pt-7 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f2fde0' }}>
            <Database className="w-4 h-4" style={{ color: '#004521' }} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Diagrama de Pacotes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Organizacao em camadas — separacao de responsabilidades</p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-6 flex flex-col gap-4 min-h-0">
          <div className="flex-1 rounded-2xl border border-[#d6d6d6] bg-white overflow-hidden flex items-center justify-center p-3 min-h-0"
            style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.07)' }}>
            <img
              src={DIAGRAMAS.pacotes}
              alt="Diagrama de Pacotes"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-5 gap-2.5 shrink-0">
            {[
              { pkg: 'view', items: 'LoginView, CadastroView, PedidoView, ContratoView, AvaliacaoView, AutomovelView' },
              { pkg: 'controller', items: 'UsuarioController, ClienteController, PedidoController, ContratoController, AvaliacaoController, AutomovelController' },
              { pkg: 'service', items: 'UsuarioService, PedidoService, ContratoService, AvaliacaoFinanceiraService, CreditoService, AutomovelService' },
              { pkg: 'repository', items: 'UsuarioRepo, ClienteRepo, PedidoRepo, ContratoRepo, BancoRepo, AutomovelRepo' },
              { pkg: 'model', items: 'Usuario, Cliente, Agente, Banco, PedidoAluguel, Contrato, ContratoCred., Automovel, Renda, AvaliacaoFin., Propriedade' },
            ].map((p) => (
              <div key={p.pkg} className="rounded-xl border p-2.5" style={{ background: '#fafafa', borderColor: '#e8e8e8' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#004521' }}>{p.pkg}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{p.items}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Main SlidesPage ─────────────────────────────────────────────────────────
const SLIDES = [
  { id: 'capa', label: 'Capa', component: SlideCapa },
  { id: 'implantacao', label: 'Implantacao', component: SlideImplantacao },
  { id: 'componentes', label: 'Componentes', component: SlideComponentes },
  { id: 'classes', label: 'Classes', component: SlideClasses },
  { id: 'pacotes', label: 'Pacotes', component: SlidePacotes },
  { id: 'tecnologias', label: 'Tecnologias', component: SlideTecnologias },
  { id: 'micronaut', label: 'Micronaut → Flask', component: SlideMicronaut },
]

export default function SlidesPage() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((index) => {
    if (index < 0 || index >= SLIDES.length || transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 180)
  }, [transitioning])

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const Slide = SLIDES[current].component

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header bar */}
      <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-[#e8e8e8] bg-white">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slides</span>
          <span className="text-slate-200">·</span>
          <span className="text-xs font-semibold text-slate-600">{SLIDES[current].label}</span>
        </div>
        <div className="flex items-center gap-1">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="transition-all"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? '#78de1f' : '#d1d5db',
              }}
              title={s.label}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400 font-mono">{current + 1} / {SLIDES.length}</span>
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          <Slide />
        </div>

        {/* Prev/Next overlays */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-0 z-10"
          style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)' }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={next}
          disabled={current === SLIDES.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-0 z-10"
          style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)' }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="shrink-0 flex items-center gap-2 px-5 py-2 border-t border-[#e8e8e8] bg-white overflow-x-auto">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all border"
            style={i === current
              ? { background: '#78de1f', color: '#004521', border: '1px solid #5fbe0f' }
              : { background: '#fafafa', color: '#6b7280', border: '1px solid #e8e8e8' }}
          >
            {i + 1}. {s.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-300 shrink-0 hidden sm:block">← → para navegar</span>
      </div>
    </div>
  )
}
