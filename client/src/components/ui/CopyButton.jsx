import { useState } from 'react'
import Tooltip from './Tooltip'

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(()=>setCopied(false), 1200)
    } catch {}
  }
  return (
    <Tooltip content={copied ? 'Copiado' : 'Copiar'}>
      <button onClick={copy} className={["p-1.5 rounded border text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800", className].join(' ')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M3 7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1h-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1v2H7a4 4 0 0 1-4-4V7Zm7 4a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4v-7Zm2 0v7a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2Z"/>
        </svg>
      </button>
    </Tooltip>
  )
}
