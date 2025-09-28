import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function LogoRow() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <img src="/logos/app-logo.svg" alt="BatteryTrack" className="h-10"/>
      <span className="text-slate-400">×</span>
      <img src="/logos/stellar.svg" alt="Stellar" className="h-8 opacity-80"/>
      <span className="text-slate-400">×</span>
      <img src="/logos/tellus.svg" alt="Tellus" className="h-8 opacity-80"/>
    </div>
  )
}

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false
    api.getBatteries().then(res => {
      if (!ignore) setItems(res.items || [])
    }).finally(()=> setLoading(false))
    return () => { ignore = true }
  }, [])

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return
    try {
      setDeleting(id)
      await api.deleteBattery(id)
      setItems(prev => prev.filter(x => x.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-tr from-emerald-50 to-emerald-100/50 dark:from-slate-800 dark:to-slate-800 p-6 mb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Trazabilidad de pilas con incentivos verdes</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Registra lotes, sigue su ciclo de vida y recompensa la devolución.</p>
          </div>
          <LogoRow />
        </div>
        <div className="mt-4">
          <Link to="/registrar" className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">+ Registrar nuevo lote</Link>
        </div>
      </section>

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl">
          <p className="text-slate-600 mb-3">Aún no hay registros.</p>
          <Link to="/registrar" className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Crear el primero</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map(b => (
            <div key={b.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">ID</div>
                  <div className="font-semibold text-lg">{b.id}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{b.estado}</span>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{b.tipo} • {b.fabricante}</div>
              <div className="mt-1 text-xs text-slate-500">{new Date(b.fecha).toLocaleString()}</div>
              <div className="mt-2 text-xs text-slate-500 truncate">Token: {b.token}</div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Link to={`/battery/${b.id}`} className="px-3 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Ver detalle</Link>
                <button disabled={deleting===b.id} onClick={()=>handleDelete(b.id)} className="px-3 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">{deleting===b.id? 'Eliminando...' : 'Eliminar'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
