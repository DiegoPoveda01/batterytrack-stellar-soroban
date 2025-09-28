import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
          {title && (
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold">{title}</div>
          )}
          <div className="p-4">{children}</div>
          {footer && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">{footer}</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
