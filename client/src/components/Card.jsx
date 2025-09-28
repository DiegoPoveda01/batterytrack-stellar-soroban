export default function Card({ title, children, actions }) {
  return (
    <div className="p-4 rounded border border-slate-200 dark:border-slate-700">
      {title && <div className="font-semibold mb-2">{title}</div>}
      <div>{children}</div>
      {actions && <div className="mt-3">{actions}</div>}
    </div>
  )
}
