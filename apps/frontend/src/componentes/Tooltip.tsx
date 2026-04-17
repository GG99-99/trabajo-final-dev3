import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Position = 'top' | 'bottom' | 'left' | 'right'

type Props = {
  content: ReactNode
  position?: Position
  delay?: number
  children: ReactNode
  className?: string
}

export default function Tooltip({
  content,
  position = 'top',
  delay = 120,
  children,
  className,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords]   = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return
      const r = triggerRef.current.getBoundingClientRect()
      const GAP = 8

      let top  = 0
      let left = 0

      if (position === 'top') {
        top  = r.top  - GAP
        left = r.left + r.width / 2
      } else if (position === 'bottom') {
        top  = r.bottom + GAP
        left = r.left   + r.width / 2
      } else if (position === 'left') {
        top  = r.top  + r.height / 2
        left = r.left - GAP
      } else {
        top  = r.top  + r.height / 2
        left = r.right + GAP
      }

      setCoords({ top, left })
      setVisible(true)
    }, delay)
  }

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const transformMap: Record<Position, string> = {
    top:    'translateX(-50%) translateY(-100%)',
    bottom: 'translateX(-50%)',
    left:   'translateX(-100%) translateY(-50%)',
    right:  'translateY(-50%)',
  }

  const arrowMap: Record<Position, string> = {
    top:    'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-[#2a2a2a] border-x-transparent border-b-transparent border-t-4 border-x-4 border-b-0',
    bottom: 'top-[-4px]  left-1/2 -translate-x-1/2 border-b-[#2a2a2a] border-x-transparent border-t-transparent border-b-4 border-x-4 border-t-0',
    left:   'right-[-4px] top-1/2 -translate-y-1/2 border-l-[#2a2a2a] border-y-transparent border-r-transparent border-l-4 border-y-4 border-r-0',
    right:  'left-[-4px]  top-1/2 -translate-y-1/2 border-r-[#2a2a2a] border-y-transparent border-l-transparent border-r-4 border-y-4 border-l-0',
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={`inline-flex ${className ?? ''}`}
      >
        {children}
      </span>

      {visible && createPortal(
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            top:  coords.top,
            left: coords.left,
            transform: transformMap[position],
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          className="animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="relative bg-[#2a2a2a] border border-white/10 text-white/90 text-[11px] tracking-wide px-3 py-1.5 rounded-sm shadow-xl max-w-[220px] whitespace-normal">
            {content}
            <span className={`absolute border ${arrowMap[position]}`} />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
