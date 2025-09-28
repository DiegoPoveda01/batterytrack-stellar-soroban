import { useRef } from 'react'

export default function DateField({ label, error, className = '', ...props }) {
  const ref = useRef(null)
  const openPicker = (e) => {
    e.preventDefault()
    const el = ref.current
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.focus()
  }
  return (
    <label className="block">
      {label && <div className="text-sm mb-1 text-slate-600 dark:text-slate-300">{label}</div>}
      <div className="relative has-custom-picker">
        <input
          ref={ref}
          type="date"
          className={[
            'w-full pr-11 px-3 py-2 rounded-lg border bg-white dark:bg-slate-900',
            error ? 'border-rose-400 dark:border-rose-500' : 'border-slate-300 dark:border-slate-700',
            className,
          ].join(' ')}
          {...props}
        />
        <button
          type="button"
          aria-label="Abrir calendario"
          onClick={openPicker}
          className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          tabIndex={-1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M6 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 1 1 2 0v1Zm15 7H3v10h18V9Z"/>
          </svg>
        </button>
      </div>
      {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
    </label>
  )
}
