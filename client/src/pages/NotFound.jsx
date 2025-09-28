import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <div className="text-7xl font-extrabold text-slate-300 dark:text-slate-700">404</div>
      <div className="mt-2 text-lg">Página no encontrada</div>
      <div className="mt-4">
        <Link to="/" className="text-emerald-600 hover:underline">Volver al Dashboard</Link>
      </div>
    </div>
  )
}
