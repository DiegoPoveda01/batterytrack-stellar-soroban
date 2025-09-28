import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'

const STATES = ['fabricacion', 'distribucion', 'venta', 'recoleccion', 'reciclaje']

export default function BatteryDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [next, setNext] = useState('')
  const [busy, setBusy] = useState(false)
  const [prev, setPrev] = useState('')

  useEffect(() => {
    let ignore = false
    api.getBattery(id).then(res => {
      if (!ignore) setItem(res.item)
    })
    return () => { ignore = true }
  }, [id])

  useEffect(() => {
    if (!item) return
    const idx = STATES.indexOf(item.estado)
    setNext(STATES[Math.min(idx + 1, STATES.length - 1)])
    setPrev(STATES[Math.max(idx - 1, 0)])
  }, [item])

  async function advance() {
    if (!item) return
    setBusy(true)
    try {
      const res = await api.updateState(item.id, next)
      setItem(res.item)
    } finally {
      setBusy(false)
    }
  }

  async function goBack() {
    if (!item) return
    // Si ya está en el primer estado, no hacemos nada
    if (item.estado === STATES[0]) return
    setBusy(true)
    try {
      const res = await api.updateState(item.id, prev)
      setItem(res.item)
    } finally {
      setBusy(false)
    }
  }

  if (!item) return <p className="text-slate-500">Cargando...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pila {item.id}</h2>
        <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{item.estado}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded border border-slate-200 dark:border-slate-700">
          <div><span className="text-slate-500 text-sm">Tipo:</span> {item.tipo}</div>
          <div><span className="text-slate-500 text-sm">Fabricante:</span> {item.fabricante}</div>
          <div><span className="text-slate-500 text-sm">Fecha:</span> {new Date(item.fecha).toLocaleString()}</div>
          <div className="text-sm text-slate-500 truncate">Token: {item.token}</div>
          <div className="text-sm text-slate-500">TX: {item.txId} {item.onchain ? '' : '(simulado)'}</div>
        </div>
        <div className="p-4 rounded border border-slate-200 dark:border-slate-700">
          <div className="font-semibold mb-2">Ciclo de vida</div>
          <ol className="space-y-2">
            {STATES.map(s => (
              <li key={s} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.estado === s ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                <span className={item.estado === s ? 'font-medium' : ''}>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={goBack} disabled={busy || item.estado === STATES[0]} className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm disabled:opacity-50">
              {busy ? 'Actualizando...' : `Volver a ${prev}`}
            </button>
            <button onClick={advance} disabled={busy || item.estado === 'reciclaje'} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm">
              {busy ? 'Actualizando...' : item.estado === 'reciclaje' ? 'Completado' : `Avanzar a ${next}`}
            </button>
          </div>
        </div>
      </div>

      {item.history?.length > 0 && (
        <div className="p-4 rounded border border-slate-200 dark:border-slate-700">
          <div className="font-semibold mb-2">Historial</div>
          <ul className="text-sm space-y-1">
            {item.history.map((h, idx) => (
              <li key={idx} className="text-slate-600">{new Date(h.ts).toLocaleString()} → {h.estado}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
