export default function Badge({ children, color = 'slate', className = '' }) {
  const palette = {
    slate: 'bg-slate-100 text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800',
  }
  return (
    <span className={[
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs border',
      palette[color] || palette.slate,
      className
    ].join(' ')}>
      {children}
    </span>
  )
}
