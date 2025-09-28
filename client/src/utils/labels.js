export function stateLabel(s) {
  const map = {
    fabricacion: 'Fabricación',
    distribucion: 'Distribución',
    venta: 'Venta',
    recoleccion: 'Recolección',
    reciclaje: 'Reciclaje',
  }
  return map[s] || s?.[0]?.toUpperCase() + s?.slice(1) || ''
}
