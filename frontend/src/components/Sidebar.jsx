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
      items.push({ to: '/meus-anuncios', icon: FolderKanban, label: 'Meus Anúncios' })
    }
    items.push({
      to: '/pedidos',
      icon: ClipboardList,
      label: isAdmin ? 'Pedidos' : 'Meus Pedidos',
    })
    if (!isAdmin) {
      items.push({ to: '/pedidos-recebidos', icon: ClipboardList, label: 'Pedidos Recebidos' })
      items.push({ to: '/notificacoes', icon: Bell, label: 'Notificações' })
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
        background: 'linear-gradient(175deg, #012910 0%, #022015 60%, #011a0d 100%)',
        borderRight: '1px solid rgba(120,222,31,0.12)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#78de1f', boxShadow: '0 4px 16px rgba(120,222,31,0.4)' }}
        >
          <Car className="w-5 h-5" style={{ color: '#004521' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-base leading-tight" style={{ fontFamily: '"Racing Sans One", sans-serif', letterSpacing: '0.03em' }}>
            Car Rental
          </p>
          <p className="text-white/40 text-xs mt-0.5">Sistema de Aluguel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
          Menu
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-semibold ${
                isActive
                  ? 'text-[#004521]'
                  : 'text-white/50 hover:bg-white/[0.07] hover:text-white/90'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: '#78de1f', boxShadow: '0 2px 12px rgba(120,222,31,0.35)' }
              : {}
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        {/* Dev section */}
        <div className="pt-3">
          <p className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
            Dev
          </p>
          <NavLink
            to="/design"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-semibold ${
                isActive
                  ? 'text-[#004521]'
                  : 'text-white/50 hover:bg-white/[0.07] hover:text-white/90'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: '#78de1f', boxShadow: '0 2px 12px rgba(120,222,31,0.35)' }
              : {}
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
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.05]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: '#78de1f', color: '#004521' }}
              >
                {user.nome?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">{user.nome}</p>
                <p className="text-white/35 text-[11px] truncate">
                  @{user.nomeUsuario} · {user.tipoUsuario}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40
                hover:bg-red-900/30 hover:text-red-400 transition-all duration-150 text-sm font-semibold"
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50
                hover:bg-white/[0.07] hover:text-white/90 transition-all duration-150 text-sm font-semibold"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50
                hover:bg-white/[0.07] hover:text-white/90 transition-all duration-150 text-sm font-semibold"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar
            </NavLink>
          </>
        )}
        <p className="px-3 text-[11px] text-white/20">Lab02 · Flask + React</p>
      </div>
    </aside>
  )
}
