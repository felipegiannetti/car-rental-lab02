import { NavLink, useNavigate } from 'react-router-dom'
import { Car, Users, ClipboardList, LogOut, LogIn, UserPlus, Bell, FolderKanban } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function getNavItems({ isAuthenticated, isAdmin }) {
  const items = [
    { to: '/automoveis', icon: Car, label: 'Automoveis' },
  ]

  if (isAuthenticated) {
    if (!isAdmin) {
      items.push({
        to: '/meus-anuncios',
        icon: FolderKanban,
        label: 'Meus Anuncios',
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
        label: 'Notificacoes',
      })
    }
  }

  if (isAdmin) {
    items.push({ to: '/usuarios', icon: Users, label: 'Usuarios' })
  }

  return items
}

export default function Sidebar({ open, onClose }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = getNavItems({ isAuthenticated, isAdmin })

  function handleLogout() {
    logout()
    toast.success('Sessao encerrada.')
    navigate('/')
    onClose()
  }

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 min-h-screen bg-sidebar flex flex-col shrink-0
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow">
          <Car className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">Car Rental</p>
          <p className="text-slate-400 text-xs">Sistema de Aluguel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Menu
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.nome?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">{user.nome}</p>
                <p className="text-slate-500 text-xs truncate">
                  @{user.nomeUsuario} · {user.tipoUsuario}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400
                hover:bg-red-900/30 hover:text-red-400 transition-colors duration-150 text-sm font-medium"
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400
                hover:bg-sidebar-hover hover:text-white transition-colors duration-150 text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400
                hover:bg-sidebar-hover hover:text-white transition-colors duration-150 text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar
            </NavLink>
          </>
        )}
        <p className="px-3 text-xs text-slate-600">Lab02 · Flask + React</p>
      </div>
    </aside>
  )
}
