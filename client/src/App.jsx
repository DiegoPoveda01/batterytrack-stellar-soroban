import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RegisterBattery from './pages/RegisterBattery'
import BatteryDetail from './pages/BatteryDetail'
import Wallet from './pages/Wallet'

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return null
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
            <img src="/logos/app-logo.svg" alt="BatteryTrack" className="h-8"/>
            <nav className="flex gap-4 text-sm">
              <NavLink className={({isActive})=>isActive? 'text-emerald-600 font-semibold' : 'hover:text-emerald-600'} to="/">Dashboard</NavLink>
              <NavLink className={({isActive})=>isActive? 'text-emerald-600 font-semibold' : 'hover:text-emerald-600'} to="/registrar">Registrar</NavLink>
              <NavLink className={({isActive})=>isActive? 'text-emerald-600 font-semibold' : 'hover:text-emerald-600'} to="/wallet">Wallet</NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/registrar" element={<RegisterBattery/>} />
            <Route path="/battery/:id" element={<BatteryDetail/>} />
            <Route path="/wallet" element={<Wallet/>} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 py-4 text-center">
          Demo Stellar/Soroban
        </footer>
      </div>
    </BrowserRouter>
  )
}
