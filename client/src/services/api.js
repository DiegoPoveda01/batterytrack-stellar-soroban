const BASE = '' // proxied to server in vite.config.js

async function j(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}

function fromDtoBattery(dto) {
  if (!dto) return null
  return {
    id: dto.id,
    tipo: dto.specs?.tipo,
    fabricante: dto.specs?.fabricante,
    fecha: dto.registeredAt,
    estado: dto.lifecycle?.state,
    token: dto.token ? `${dto.token.assetCode}:${dto.token.issuer || ''}` : null,
    txId: dto.token?.txId || null,
    onchain: !!dto.token?.onchain,
    history: (dto.lifecycle?.history || []).map(h => ({ ts: h.at, estado: h.state })),
  }
}

export const api = {
  async getBatteries() {
    const r = await j('GET', `${BASE}/api/batteries`)
    const items = Array.isArray(r.data) ? r.data.map(fromDtoBattery) : []
    return { items }
  },
  async registerBattery(data) {
    const r = await j('POST', `${BASE}/api/batteries`, data)
    return { item: fromDtoBattery(r.data?.battery), event: r.data?.event }
  },
  async getBattery(id) {
    const r = await j('GET', `${BASE}/api/batteries/${id}`)
    return { item: fromDtoBattery(r.data) }
  },
  async updateState(id, estado) {
    const r = await j('POST', `${BASE}/api/batteries/${id}/estado`, { estado })
    return { item: fromDtoBattery(r.data?.battery), event: r.data?.event }
  },
  async deleteBattery(id) {
    const r = await j('DELETE', `${BASE}/api/batteries/${id}`)
    return r.data
  },
  async getBalance(pub) {
    const r = await j('GET', `${BASE}/api/wallet/balance/${pub}`)
    return r.data
  },
  async simulateReturn(publicKey, points = 1, token = 'GREEN') {
    const r = await j('POST', `${BASE}/api/wallet/simulate-return`, { publicKey, points, token })
    const b = r.data?.balance
    return { publicKey: b?.publicKey, balances: b?.balances }
  }
}
