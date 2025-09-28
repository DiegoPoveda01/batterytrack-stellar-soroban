import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Timeline from '../components/Timeline'
import Skeleton from '../components/ui/Skeleton'

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

  if (!item) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-60" />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
          <Skeleton className="h-4 w-52 mt-2" />
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-full mt-3" />
        </div>
      </div>
    </div>
  )

  // Construir timestamps por etapa desde el historial
  const timestampsByStage = (item.history || []).reduce((acc, h) => {
    acc[h.estado] = h.ts || acc[h.estado]
    return acc
  }, {})
  const colors = {
    fabricacion: '#64748b', // slate-500
    distribucion: '#3b82f6', // blue-500
    venta: '#f43f5e', // rose-500
    recoleccion: '#6366f1', // indigo-500
    reciclaje: '#10b981', // emerald-500
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Pila {item.id}</h2>
        <Badge color={
          item.estado === 'fabricacion' ? 'slate' :
          item.estado === 'distribucion' ? 'blue' :
          item.estado === 'venta' ? 'rose' :
          item.estado === 'recoleccion' ? 'blue' :
          'green'
        }>{item.estado}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div><span className="text-slate-500 text-sm">Tipo:</span> {item.tipo}</div>
          <div><span className="text-slate-500 text-sm">Fabricante:</span> {item.fabricante}</div>
          <div><span className="text-slate-500 text-sm">Fecha:</span> {new Date(item.fecha).toLocaleString()}</div>
          <div className="text-sm text-slate-500 truncate">Token: {item.token}</div>
          <div className="text-sm text-slate-500">TX: {item.txId} {item.onchain ? '' : '(simulado)'}</div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="font-semibold mb-3">Ciclo de vida</div>
          <Timeline stages={STATES} active={item.estado} timestampsByStage={timestampsByStage} colors={colors} />
          <div className="mt-4 flex items-center gap-3">
            <Button variant="ghost" onClick={goBack} disabled={busy || item.estado === STATES[0]} loading={busy && prev===item.estado}>
              {busy ? 'Actualizando...' : `Volver a ${prev}`}
            </Button>
            <Button variant="secondary" onClick={advance} disabled={busy || item.estado === 'reciclaje'} loading={busy}>
              {busy ? 'Actualizando...' : item.estado === 'reciclaje' ? 'Completado' : `Avanzar a ${next}`}
            </Button>
          </div>
        </div>
      </div>

      {item.history?.length > 0 && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
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
