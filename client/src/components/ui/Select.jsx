export function Select({ label, error, className = '', children, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm mb-1 text-slate-600 dark:text-slate-300">{label}</div>}
      <select
        className={[
          'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900',
          error ? 'border-rose-400 dark:border-rose-500' : 'border-slate-300 dark:border-slate-700',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
    </label>
  )
}
