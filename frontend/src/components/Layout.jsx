import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Car, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f2f2f2]">

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
          style={{ background: 'linear-gradient(175deg, #012910 0%, #022015 100%)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#78de1f' }}
            >
              <Car className="w-4 h-4" style={{ color: '#004521' }} />
            </div>
            <span className="text-white text-base" style={{ fontFamily: '"Racing Sans One", sans-serif', letterSpacing: '0.03em' }}>
              Car Rental
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
