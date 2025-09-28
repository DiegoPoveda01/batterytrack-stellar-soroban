import { useState } from 'react'

export default function Tooltip({ content, children }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show && (
        <span className="absolute z-50 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-slate-900 text-white px-2 py-1 rounded shadow">
          {content}
        </span>
      )}
    </span>
  )
}
