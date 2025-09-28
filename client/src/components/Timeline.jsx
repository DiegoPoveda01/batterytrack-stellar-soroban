export default function Timeline({ stages = [], active, timestampsByStage = {}, colors = {} }) {
  const idx = stages.indexOf(active)
  const denom = Math.max(stages.length - 1, 1)
  const progress = Math.max(idx, 0) / denom
  const colorFor = (s) => colors[s] || '#10b981' // default emerald

  const formatTs = (ts) => {
    if (!ts) return ''
    try {
      const d = new Date(ts)
      return d.toLocaleString()
    } catch { return String(ts) }
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="absolute left-0 h-1 rounded transition-all" style={{ width: `${progress * 100}%`, backgroundColor: colorFor(active) }} />
        <div className="relative w-full flex justify-between">
          {stages.map((s, i) => {
            const done = i < idx
            const current = i === idx
            const c = colorFor(s)
            const title = timestampsByStage[s] ? `${s} — ${formatTs(timestampsByStage[s])}` : s
            return (
              <div key={s} className="flex flex-col items-center text-center" title={title}>
                <div
                  className={[
                    'w-5 h-5 rounded-full border-2',
                    done ? '' : 'bg-white dark:bg-slate-900',
                  ].join(' ')}
                  style={{ borderColor: current || done ? c : 'var(--tw-prose-body, rgb(203 213 225))', backgroundColor: done ? c : undefined }}
                />
                <div className="mt-2 text-xs" style={{ color: current ? c : undefined }}>
                  <span className={current ? 'font-medium' : 'text-slate-500'}>{s}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
