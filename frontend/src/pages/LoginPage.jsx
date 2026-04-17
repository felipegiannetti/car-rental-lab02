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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.25),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(14,165,233,0.2),transparent_50%)]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-8 h-24 w-24 rounded-full border border-white/10" />
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border border-white/10" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Car Rental</h1>
          <p className="text-sm text-slate-400 mt-1">Sistema de Aluguel de Carros</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-2">Entrar na sua conta</h2>
          <p className="text-sm text-slate-400 mb-6">
            Visitantes podem navegar pelos carros sem login.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={form.nomeUsuario}
                  onChange={e => setForm(f => ({ ...f, nomeUsuario: e.target.value }))}
                  placeholder="seu.usuario"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl
                    text-white placeholder-slate-500 text-sm focus:outline-none
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={form.senha}
                  onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl
                    text-white placeholder-slate-500 text-sm focus:outline-none
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                text-white font-semibold rounded-xl transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20
                flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Entrando...</>
              ) : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 space-y-3 text-sm">
            <Link
              to="/register"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10
                bg-white/5 px-4 py-3 text-slate-200 hover:bg-white/10 transition-colors"
            >
              Criar conta de cliente
            </Link>
            <Link
              to="/automoveis"
              className="w-full inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              Continuar como visitante
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Conta administrativa padrao: <span className="text-slate-300">admin / admin</span>
        </p>
      </div>
    </div>
  )
}
