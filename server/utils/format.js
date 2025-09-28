// Utilities to format backend data in a structured, consistent way (DTOs)

function toISO(d) {
  try {
    const date = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
    return date?.toISOString?.() || null;
  } catch {
    return null;
  }
}

function parseAsset(assetStr) {
  if (!assetStr || typeof assetStr !== 'string') return null;
  const idx = assetStr.indexOf(':');
  if (idx === -1) return { assetCode: assetStr, issuer: null };
  return { assetCode: assetStr.slice(0, idx), issuer: assetStr.slice(idx + 1) };
}

export function formatBattery(b) {
  if (!b) return null;
  const asset = parseAsset(b.token);
  return {
    id: b.id,
    specs: {
      tipo: b.tipo,
      fabricante: b.fabricante,
    },
    registeredAt: toISO(b.fecha),
    lifecycle: {
      state: b.estado,
      history: (b.history || []).map(h => ({ at: toISO(h.ts), state: h.estado })),
      states: ['fabricacion', 'distribucion', 'venta', 'recoleccion', 'reciclaje'],
    },
    token: asset ? { ...asset, txId: b.txId || null, onchain: !!b.onchain } : null,
    links: {
      self: `/api/batteries/${b.id}`,
      updateState: `/api/batteries/${b.id}/estado`,
    },
  };
}

export function formatEvent(e) {
  if (!e) return null;
  return {
    id: e.id || null,
    type: e.type,
    contractId: e.contractId || null,
    network: e.network || null,
    payload: e.payload ?? null,
    at: toISO(e.ts || Date.now()),
  };
}

export function formatWalletBalance({ publicKey, balances }) {
  return {
    publicKey,
    balances: {
      USDC: String(balances?.USDC ?? '0'),
      GREEN: String(balances?.GREEN ?? '0'),
    },
  };
}

export function ok(data, meta) {
  const res = { ok: true, data };
  if (meta) res.meta = meta;
  return res;
}

export function fail(message, code = 'ERROR', meta) {
  const res = { ok: false, error: { code, message } };
  if (meta) res.meta = meta;
  return res;
}
