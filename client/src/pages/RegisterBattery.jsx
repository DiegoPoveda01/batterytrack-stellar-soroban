import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import DateField from '../components/ui/DateField'
import { useToast } from '../components/ui/Toast'

export default function RegisterBattery() {
  const nav = useNavigate()
  const [form, setForm] = useState({ id: '', tipo: 'AA', fabricante: '', fecha: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { push } = useToast()

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (!form.fabricante) throw new Error('fabricante requerido')
      if (!form.fecha) throw new Error('fecha requerida')
      const res = await api.registerBattery(form)
      push({ type: 'success', title: 'Registrado', message: `Se creó la pila ${res.item.id}` })
      nav(`/battery/${res.item.id}`)
    } catch (err) {
      setError('Error registrando la pila')
      push({ type: 'error', title: 'Error', message: 'Revisa los campos requeridos' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Registrar pila/lote</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="ID (opcional)" name="id" value={form.id} onChange={onChange} placeholder="Ej: LOTE123" />
        <Select label="Tipo" name="tipo" value={form.tipo} onChange={onChange}>
          <option>AA</option>
          <option>AAA</option>
          <option>9V</option>
          <option>CR2032</option>
        </Select>
        <Input label="Fabricante" name="fabricante" value={form.fabricante} onChange={onChange} placeholder="Ej: ACME" />
  <DateField label="Fecha" name="fecha" value={form.fecha} onChange={onChange} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button loading={busy} disabled={busy}>Registrar</Button>
      </form>
    </div>
  )
}
