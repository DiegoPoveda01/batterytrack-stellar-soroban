import { NavLink, useLocation } from 'react-router-dom'

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  // Build breadcrumb items with labels and paths
  const items = []

  // Always start with Dashboard (home)
  items.push({ label: 'Dashboard', to: '/' })

  if (segments.length) {
    segments.forEach((seg, idx) => {
      let label = seg
      if (seg === 'registrar') label = 'Registrar'
      else if (seg === 'wallet') label = 'Wallet'
      else if (seg === 'battery') label = 'Batería'
      else if (/^[a-z0-9-_]+$/i.test(seg) && segments[idx - 1] === 'battery') label = `#${seg}`

      const to = '/' + segments.slice(0, idx + 1).join('/')
      items.push({ label, to })
    })
  }

  // Deduplicate first element when on root path
  // items like ['Dashboard'] when pathname === '/'

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-300 mb-4">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {i !== 0 && <span className="text-slate-400">/</span>}
              {isLast ? (
                <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
              ) : (
                <NavLink to={item.to} className="hover:text-emerald-600">{item.label}</NavLink>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
