import { useState } from 'react'
import { api } from '../services/api'

export default function Wallet() {
  const [pub, setPub] = useState('GDEMOUSER')
  const [bal, setBal] = useState(null)
  const [busy, setBusy] = useState(false)

  async function refresh() {
    setBusy(true)
    try {
      const res = await api.getBalance(pub)
      setBal(res)
    } finally {
      setBusy(false)
    }
  }

  async function simulateReturn() {
    setBusy(true)
    try {
      const res = await api.simulateReturn(pub, 1, 'GREEN')
      setBal({ publicKey: res.publicKey, balances: res.balances })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold">Wallet del usuario</h2>
      <div>
        <label className="block text-sm mb-1">Public Key</label>
        <input value={pub} onChange={e=>setPub(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
      </div>
      <div className="flex gap-2">
        <button onClick={refresh} disabled={busy} className="px-3 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 text-sm">Ver balance</button>
        <button onClick={simulateReturn} disabled={busy} className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-sm">Simular devolución +1 GREEN</button>
      </div>
      {bal && (
        <div className="p-4 rounded border border-slate-200 dark:border-slate-700 text-sm">
          <div className="text-slate-500">Cuenta: {bal.publicKey}</div>
          <div>USDC: {bal.balances.USDC}</div>
          <div>GREEN: {bal.balances.GREEN}</div>
        </div>
      )}
    </div>
  )
}
