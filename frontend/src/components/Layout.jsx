import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Car, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f0f4ff]">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen md:pl-64">

        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-10 border-b border-white/[0.07]"
          style={{ background: 'linear-gradient(160deg, #080d1a 0%, #0d1426 100%)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-white text-base tracking-wide">Car Rental</span>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
