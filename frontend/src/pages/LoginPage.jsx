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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
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
