import { NavLink, useNavigate } from 'react-router-dom'
import { Car, Users, ClipboardList, LogOut, LogIn, UserPlus, Bell, FolderKanban, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function getNavItems({ isAuthenticated, isAdmin }) {
  const items = [
    { to: '/automoveis', icon: Car, label: 'Automóveis' },
  ]

  if (isAuthenticated) {
    if (!isAdmin) {
      items.push({
        to: '/meus-anuncios',
        icon: FolderKanban,
        label: 'Meus Anúncios',
      })
    }
    items.push({
      to: '/pedidos',
      icon: ClipboardList,
      label: isAdmin ? 'Pedidos' : 'Meus Pedidos',
    })
    if (!isAdmin) {
      items.push({
        to: '/pedidos-recebidos',
        icon: ClipboardList,
        label: 'Pedidos Recebidos',
      })
      items.push({
        to: '/notificacoes',
        icon: Bell,
        label: 'Notificações',
      })
    }
  }

  if (isAdmin) {
    items.push({ to: '/usuarios', icon: Users, label: 'Usuários' })
  }

  return items
}

export default function Sidebar({ open, onClose }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = getNavItems({ isAuthenticated, isAdmin })

  function handleLogout() {
    logout()
    toast.success('Sessão encerrada.')
    navigate('/')
    onClose()
  }

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30
        w-64 h-screen flex flex-col shrink-0 overflow-y-auto
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      style={{
        background: 'linear-gradient(160deg, #080d1a 0%, #0d1426 60%, #080d1a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand shrink-0">
          <Car className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-display text-base leading-tight tracking-wide">Car Rental</p>
          <p className="text-slate-500 text-xs font-sans mt-0.5">Sistema de Aluguel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] font-sans">
          Menu
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-sans font-medium ${
                isActive
                  ? 'bg-brand-600/90 text-white shadow-[0_2px_12px_rgba(37,99,235,0.35)]'
                  : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        {/* Design System */}
        <div className="pt-3">
          <p className="px-3 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] font-sans">
            Desenvolvimento
          </p>
          <NavLink
            to="/design"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-sans font-medium ${
                isActive
                  ? 'bg-brand-600/90 text-white shadow-[0_2px_12px_rgba(37,99,235,0.35)]'
                  : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
              }`
            }
          >
            <Palette className="w-4 h-4 shrink-0" />
            Design System
          </NavLink>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] space-y-1.5">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold shrink-0 font-sans shadow-brand">
                {user.nome?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate font-sans">{user.nome}</p>
                <p className="text-slate-500 text-[11px] truncate font-sans">
                  @{user.nomeUsuario} · {user.tipoUsuario}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400
                hover:bg-red-900/25 hover:text-red-400 transition-all duration-150 text-sm font-medium font-sans"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400
                hover:bg-white/[0.06] hover:text-slate-200 transition-all duration-150 text-sm font-medium font-sans"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400
                hover:bg-white/[0.06] hover:text-slate-200 transition-all duration-150 text-sm font-medium font-sans"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar
            </NavLink>
          </>
        )}
        <p className="px-3 text-[11px] text-slate-700 font-sans">Lab02 · Flask + React</p>
      </div>
    </aside>
  )
}
