import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((t) => {
    const id = Math.random().toString(36).slice(2)
    const item = { id, timeout: 3500, type: 'info', ...t }
    setToasts((prev) => [...prev, item])
    setTimeout(() => dismiss(id), item.timeout)
  }, [])
  const dismiss = useCallback((id) => setToasts((prev) => prev.filter(t => t.id !== id)), [])
  const value = useMemo(() => ({ push, dismiss }), [push, dismiss])
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={[
            'min-w-[260px] rounded-lg border px-3 py-2 shadow bg-white dark:bg-slate-900',
            'border-slate-200 dark:border-slate-700 text-sm'
          ].join(' ')}>
            <div className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : '#64748b' }} />
              <div className="flex-1">
                {t.title && <div className="font-medium">{t.title}</div>}
                {t.message && <div className="text-slate-600 dark:text-slate-300">{t.message}</div>}
              </div>
              <button onClick={() => dismiss(t.id)} className="text-slate-500 hover:text-slate-700">×</button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
