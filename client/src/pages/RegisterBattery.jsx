import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Button from '../components/ui/Button'

export default function RegisterBattery() {
  const nav = useNavigate()
  const [form, setForm] = useState({ id: '', tipo: 'AA', fabricante: '', fecha: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await api.registerBattery(form)
      nav(`/battery/${res.item.id}`)
    } catch (err) {
      setError('Error registrando la pila')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Registrar pila/lote</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">ID (opcional)</label>
          <input name="id" value={form.id} onChange={onChange} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" placeholder="Ej: LOTE123" />
        </div>
        <div>
          <label className="block text-sm mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={onChange} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <option>AA</option>
            <option>AAA</option>
            <option>9V</option>
            <option>CR2032</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Fabricante</label>
          <input name="fabricante" value={form.fabricante} onChange={onChange} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" placeholder="Ej: ACME" />
        </div>
        <div>
          <label className="block text-sm mb-1">Fecha</label>
          <input type="date" name="fecha" value={form.fecha} onChange={onChange} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button loading={busy} disabled={busy}>Registrar</Button>
      </form>
    </div>
  )
}
