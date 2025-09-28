import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Skeleton from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'
import CopyButton from '../components/ui/CopyButton'
import { stateLabel } from '../utils/labels'

function LogoRow() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <img src="/logos/app-logo.svg" alt="BatteryTrack" className="h-10"/>
      <span className="text-slate-400">×</span>
  <img src="/logos/stellar_logo.avif" alt="Stellar" className="h-8 opacity-80"/>
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
  const { push } = useToast()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [fabricante, setFabricante] = useState('')

  useEffect(() => {
    let ignore = false
    api.getBatteries().then(res => {
      if (!ignore) setItems(res.items || [])
    }).finally(()=> setLoading(false))
    return () => { ignore = true }
  }, [])

  const [confirmId, setConfirmId] = useState(null)
  async function handleDelete(id) {
    setConfirmId(id)
  }
  async function confirmDelete() {
    const id = confirmId
    try {
      setDeleting(id)
      await api.deleteBattery(id)
      setItems(prev => prev.filter(x => x.id !== id))
      push({ type: 'success', title: 'Eliminado', message: `Se eliminó el registro ${id}` })
    } catch {
      push({ type: 'error', title: 'Error', message: 'No se pudo eliminar' })
    } finally {
      setDeleting(null)
      setConfirmId(null)
    }
  }

  return (
    <div>
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-tr from-emerald-50 to-emerald-100/50 dark:from-slate-900 dark:to-slate-900 p-6 mb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Trazabilidad de pilas con incentivos verdes</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Registra lotes, sigue su ciclo de vida y recompensa la devolución.</p>
          </div>
          <LogoRow />
        </div>
        <div className="mt-4">
          <Link to="/registrar">
            <Button>+ Registrar nuevo lote</Button>
          </Link>
        </div>
      </section>

      {/* filtros */}
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por ID o token" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"/>
        <select value={estado} onChange={e=>setEstado(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <option value="">Todos los estados</option>
          <option value="fabricacion">fabricacion</option>
          <option value="distribucion">distribucion</option>
          <option value="venta">venta</option>
          <option value="recoleccion">recoleccion</option>
          <option value="reciclaje">reciclaje</option>
        </select>
        <input value={fabricante} onChange={e=>setFabricante(e.target.value)} placeholder="Filtrar por fabricante" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"/>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({length:6}).map((_,i)=> (
            <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
              <Skeleton className="h-5 w-24"/>
              <Skeleton className="h-4 w-40 mt-2"/>
              <Skeleton className="h-4 w-32 mt-2"/>
              <Skeleton className="h-8 w-full mt-4"/>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <p className="text-slate-600 dark:text-slate-300 mb-3">Aún no hay registros.</p>
          <Link to="/registrar"><Button>Crear el primero</Button></Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items
            .filter(b => !q || b.id.toLowerCase().includes(q.toLowerCase()) || (b.token||'').toLowerCase().includes(q.toLowerCase()))
            .filter(b => !estado || b.estado === estado)
            .filter(b => !fabricante || (b.fabricante||'').toLowerCase().includes(fabricante.toLowerCase()))
            .map(b => (
            <div key={b.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:shadow transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">ID</div>
                  <div className="font-semibold text-lg tracking-tight">{b.id}</div>
                </div>
                <Badge color={
                  b.estado === 'fabricacion' ? 'slate' :
                  b.estado === 'distribucion' ? 'blue' :
                  b.estado === 'venta' ? 'rose' :
                  b.estado === 'recoleccion' ? 'blue' :
                  'green'
                }>{stateLabel(b.estado)}</Badge>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{b.tipo} • {b.fabricante}</div>
              <div className="mt-1 text-xs text-slate-500">{new Date(b.fecha).toLocaleString()}</div>
              <div className="mt-2 text-xs text-slate-500 truncate flex items-center gap-2">
                <span className="shrink-0">Token:</span>
                <span className="truncate">{b.token}</span>
                <CopyButton text={b.token} />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Link to={`/battery/${b.id}`}>
                  <Button variant="ghost">Ver detalle</Button>
                </Link>
                <Button variant="danger" loading={deleting===b.id} onClick={()=>handleDelete(b.id)}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!confirmId}
        onClose={()=>setConfirmId(null)}
        title="Eliminar registro"
        footer={(
          <div className="flex gap-2">
            <Button variant="ghost" onClick={()=>setConfirmId(null)}>Cancelar</Button>
            <Button variant="danger" loading={deleting===confirmId} onClick={confirmDelete}>Eliminar</Button>
          </div>
        )}
      >
        ¿Seguro que deseas eliminar el registro <span className="font-mono">{confirmId}</span>? Esta acción no se puede deshacer.
      </Modal>
    </div>
  )
}
