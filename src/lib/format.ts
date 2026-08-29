export function formatPercent(rate: number): string {
  if (!Number.isFinite(rate)) return '—'
  return `${(rate * 100).toFixed(1)}%`
}

export function formatOneIn(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) return '—'
  return `1/${(1 / rate).toFixed(2)}`
}

export function formatDelta(delta: number, digits = 1): string {
  if (!Number.isFinite(delta)) return '—'
  const abs = Math.abs(delta).toFixed(digits)
  if (delta > 0.0005) return `+${abs}`
  if (delta < -0.0005) return `−${abs}`
  return '±0'
}

export function closestSettings(
  observed: number | null,
  rates: Array<{ setting: number; rate: number | null }>,
): number[] {
  if (observed == null || !Number.isFinite(observed)) return []
  let best = Infinity
  const known = rates.filter((r) => r.rate != null) as Array<{ setting: number; rate: number }>
  for (const row of known) {
    const d = Math.abs(row.rate - observed)
    if (d < best) best = d
  }
  if (!Number.isFinite(best)) return []
  return known.filter((r) => Math.abs(r.rate - observed) <= best + 1e-12).map((r) => r.setting)
}
