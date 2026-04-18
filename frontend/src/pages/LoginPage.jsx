import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ nomeUsuario: '', senha: '' })
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const carBackgroundUrl = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nomeUsuario || !form.senha) {
      toast.error('Preencha usuario e senha.')
      return
    }
    setLoading(true)
    try {
      const user = await authApi.login(form.nomeUsuario, form.senha)
      login(user)
      toast.success(`Bem-vindo, ${user.nome}!`)
      navigate(user.tipoUsuario === 'ADMIN' ? '/usuarios' : '/pedidos', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Usuario ou senha invalidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen flex overflow-hidden bg-cover bg-center"
      style={{
        backgroundColor: '#f2f2f2',
        backgroundImage: `linear-gradient(rgba(1, 41, 16, 0.38), rgba(1, 41, 16, 0.16)), url(${carBackgroundUrl})`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(242,242,242,0.05) 0%, rgba(242,242,242,0.7) 58%, rgba(242,242,242,0.94) 100%)' }}
      />

      {/* ── Left panel – branding ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #012910 0%, #022015 60%, #011a0d 100%)' }}
      >
        {/* decorative rings */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-white/[0.05]" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-white/[0.07]" />
        <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full border border-white/[0.04]" />
        {/* lime glow */}
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: '#78de1f' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#78de1f', boxShadow: '0 4px 16px rgba(120,222,31,0.4)' }}
          >
            <Car className="w-5 h-5" style={{ color: '#004521' }} />
          </div>
          <span className="text-white text-xl" style={{ fontFamily: '"Racing Sans One", sans-serif', letterSpacing: '0.03em' }}>
            Car Rental
          </span>
        </div>

        {/* Headline */}
        <div className="relative space-y-5">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(120,222,31,0.15)', color: '#78de1f', border: '1px solid rgba(120,222,31,0.25)' }}
          >
            Sistema de Aluguel de Carros
          </div>
          <h1 className="text-5xl text-white leading-tight" style={{ fontFamily: '"Racing Sans One", sans-serif' }}>
            Encontre o carro perfeito para você
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Alugue ou compre seu próximo veículo com facilidade. Acesse centenas de anúncios e faça seu pedido em minutos.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Anúncios verificados', 'Pedidos online', 'Gestão completa'].map((item) => (
              <span
                key={item}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Lab02 · Flask + React · {new Date().getFullYear()}
        </p>
      </div>

      {/* ── Right panel – form ── */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#78de1f' }}>
              <Car className="w-5 h-5" style={{ color: '#004521' }} />
            </div>
            <span style={{ fontFamily: '"Racing Sans One", sans-serif', fontSize: '1.15rem', color: '#004521', letterSpacing: '0.03em' }}>
              Car Rental
            </span>
          </div>

          {/* Heading */}
          <div>
            <h2 style={{ fontFamily: '"Racing Sans One", sans-serif', fontSize: '1.75rem', color: '#383838' }}>
              Bem-vindo de volta
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: '#5e5e5e' }}>
              Visitantes podem navegar pelos carros sem login.
            </p>
          </div>

          {/* Form card */}
          <div
            className="bg-white rounded-3xl p-8 space-y-5"
            style={{ boxShadow: '0 4px 24px rgba(15,23,42,0.08)', border: '1px solid #d6d6d6' }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#5e5e5e' }}>
                  Usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#919191' }} />
                  <input
                    type="text"
                    value={form.nomeUsuario}
                    onChange={e => setForm(f => ({ ...f, nomeUsuario: e.target.value }))}
                    placeholder="seu.usuario"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 bg-white border rounded-2xl text-sm focus:outline-none transition-all"
                    style={{ borderColor: '#d6d6d6', color: '#383838' }}
                    onFocus={e => { e.target.style.boxShadow = '0 0 0 2px #78de1f'; e.target.style.borderColor = 'transparent' }}
                    onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#d6d6d6' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#5e5e5e' }}>
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#919191' }} />
                  <input
                    type={showSenha ? 'text' : 'password'}
                    value={form.senha}
                    onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 bg-white border rounded-2xl text-sm focus:outline-none transition-all"
                    style={{ borderColor: '#d6d6d6', color: '#383838' }}
                    onFocus={e => { e.target.style.boxShadow = '0 0 0 2px #78de1f'; e.target.style.borderColor = 'transparent' }}
                    onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#d6d6d6' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#919191' }}
                  >
                    {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 mt-1 hover:-translate-y-px active:translate-y-0"
                style={{ background: '#78de1f', color: '#004521', boxShadow: '0 4px 16px rgba(120,222,31,0.35)' }}
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#004521', borderTopColor: 'transparent' }} /> Entrando...</>
                  : 'Entrar'}
              </button>
            </form>

            <div className="pt-4 border-t space-y-2.5" style={{ borderColor: '#d6d6d6' }}>
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border
                  bg-white px-4 py-3 text-sm font-semibold transition-colors hover:bg-[#f5f5f5]"
                style={{ borderColor: '#d6d6d6', color: '#383838' }}
              >
                Criar conta de cliente
              </Link>
              <Link
                to="/automoveis"
                className="w-full inline-flex items-center justify-center gap-1.5 text-sm transition-colors"
                style={{ color: '#5e5e5e' }}
              >
                Continuar como visitante
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <p className="text-center text-xs" style={{ color: '#919191' }}>
            Conta administrativa: <span className="font-semibold" style={{ color: '#5e5e5e' }}>admin / admin</span>
          </p>
        </div>
      </div>
    </div>
  )
}
