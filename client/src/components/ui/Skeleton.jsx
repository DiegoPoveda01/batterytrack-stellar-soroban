export default function Skeleton({ className = '' }) {
  return <div className={["animate-pulse bg-slate-200/60 dark:bg-slate-800/60 rounded", className].join(' ')} />
}
