import { NavLink } from 'react-router-dom'
import { Car, Users, FileText, ClipboardList, Building2, X } from 'lucide-react'

const navItems = [
  { to: '/clientes',   icon: Users,        label: 'Clientes' },
  { to: '/pedidos',    icon: ClipboardList, label: 'Pedidos',    disabled: true },
  { to: '/contratos',  icon: FileText,      label: 'Contratos',  disabled: true },
  { to: '/automoveis', icon: Car,           label: 'Automóveis', disabled: true },
  { to: '/agentes',    icon: Building2,     label: 'Agentes',    disabled: true },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 min-h-screen bg-sidebar flex flex-col shrink-0
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow">
          <Car className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">Car Rental</p>
          <p className="text-slate-400 text-xs">Sistema de Aluguel</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Menu
        </p>
        {navItems.map(({ to, icon: Icon, label, disabled }) =>
          disabled ? (
            <div
              key={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 cursor-not-allowed select-none"
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-xs bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded">
                em breve
              </span>
            </div>
          ) : (
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
          )
        )}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-slate-600">Lab02 · Micronaut + React</p>
      </div>
    </aside>
  )
}
