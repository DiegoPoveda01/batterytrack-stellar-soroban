import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RegisterBattery from './pages/RegisterBattery'
import BatteryDetail from './pages/BatteryDetail'
import Wallet from './pages/Wallet'
import Breadcrumb from './components/Breadcrumb'
import { ToastProvider } from './components/ui/Toast'
import ThemeToggle from './components/ThemeToggle'
import NotFound from './pages/NotFound'

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
                <img src="/brands/byesiduos.jpeg" alt="ByeSiduos" className="h-8 w-auto object-contain rounded"/>
                <span className="sr-only">Inicio</span>
              </NavLink>
              <nav className="flex gap-1 text-sm ml-auto items-center">
                <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300' : 'text-slate-600 hover:text-emerald-700 dark:text-slate-300'}`} to="/">Dashboard</NavLink>
                <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300' : 'text-slate-600 hover:text-emerald-700 dark:text-slate-300'}`} to="/registrar">Registrar</NavLink>
                <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300' : 'text-slate-600 hover:text-emerald-700 dark:text-slate-300'}`} to="/wallet">Wallet</NavLink>
                <div className="ml-2"><ThemeToggle /></div>
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
                <Route path="*" element={<NotFound/>} />
              </Routes>
            </div>
          </main>
          <footer className="border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>ByeSiduos — Demo Stellar/Soroban</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">© {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center flex-wrap gap-6">
                <a href="/" title="ByeSiduos" className="inline-flex" aria-label="ByeSiduos">
                  <img src="/brands/byesiduos.jpeg" alt="ByeSiduos" className="h-10 md:h-12 w-auto object-contain rounded min-w-0"/>
                </a>
                <span className="text-slate-400">×</span>
                <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" title="Stellar" className="inline-flex" aria-label="Stellar">
                  <img src="/brands/stellar.png" alt="Stellar" className="h-10 md:h-12 w-auto object-contain min-w-0"/>
                </a>
                <span className="text-slate-400">×</span>
                <a href="https://telluscoop.com" target="_blank" rel="noopener noreferrer" title="Tellus Cooperative" className="inline-flex" aria-label="Tellus Cooperative">
                  <img src="/brands/telluscoop.svg" alt="Tellus Cooperative" className="h-10 md:h-12 w-auto object-contain min-w-0"/>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}
