import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    api.getBatteries().then(res => {
      if (!ignore) setItems(res.items || [])
    }).finally(()=> setLoading(false))
    return () => { ignore = true }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Pilas registradas</h2>
        <Link to="/registrar" className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm">Registrar nueva</Link>
      </div>
      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">No hay pilas registradas aún.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(b => (
            <Link key={b.id} to={`/battery/${b.id}`} className="block p-4 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">ID: {b.id}</div>
                  <div className="text-sm text-slate-500">{b.tipo} • {b.fabricante} • {new Date(b.fecha).toLocaleString()}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{b.estado}</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 truncate">Token: {b.token}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
