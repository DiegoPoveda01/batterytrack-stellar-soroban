export default function Timeline({ stages = [], active }) {
  const idx = stages.indexOf(active)
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="absolute left-0 h-1 bg-emerald-500 rounded transition-all" style={{ width: `${(Math.max(idx,0) / (stages.length - 1)) * 100}%` }} />
        <div className="relative w-full flex justify-between">
          {stages.map((s, i) => {
            const done = i < idx
            const current = i === idx
            return (
              <div key={s} className="flex flex-col items-center text-center">
                <div className={["w-5 h-5 rounded-full border-2", done ? 'bg-emerald-500 border-emerald-500' : current ? 'bg-white dark:bg-slate-900 border-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'].join(' ')} />
                <div className={["mt-2 text-xs", current ? 'text-emerald-600 dark:text-emerald-300 font-medium' : 'text-slate-500'].join(' ')}>{s}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
