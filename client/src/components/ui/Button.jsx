export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 disabled:opacity-60 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700',
    ghost: 'border border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    subtle: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5',
  }
  return (
    <button
      className={[base, variants[variant] || variants.primary, sizes[size] || sizes.md, className].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
