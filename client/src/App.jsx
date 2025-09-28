import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RegisterBattery from './pages/RegisterBattery'
import BatteryDetail from './pages/BatteryDetail'
import Wallet from './pages/Wallet'
import Breadcrumb from './components/Breadcrumb'
import { ToastProvider } from './components/ui/Toast'

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return null
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
              <NavLink to="/" title="Inicio" className="flex items-center gap-2">
                <img src="/logos/app-logo.svg" alt="BatteryTrack" className="h-8"/>
                <span className="sr-only">Inicio</span>
              </NavLink>
              <nav className="flex gap-1 text-sm ml-auto">
                <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300' : 'text-slate-600 hover:text-emerald-700 dark:text-slate-300'}`} to="/">Dashboard</NavLink>
                <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300' : 'text-slate-600 hover:text-emerald-700 dark:text-slate-300'}`} to="/registrar">Registrar</NavLink>
                <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300' : 'text-slate-600 hover:text-emerald-700 dark:text-slate-300'}`} to="/wallet">Wallet</NavLink>
              </nav>
            </div>
          </header>
          <main className="flex-1 w-full">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <Breadcrumb />
              <Routes>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/registrar" element={<RegisterBattery/>} />
                <Route path="/battery/:id" element={<BatteryDetail/>} />
                <Route path="/wallet" element={<Wallet/>} />
              </Routes>
            </div>
          </main>
          <footer className="border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <span>Demo Stellar/Soroban</span>
              <span className="text-slate-400">© {new Date().getFullYear()}</span>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}
