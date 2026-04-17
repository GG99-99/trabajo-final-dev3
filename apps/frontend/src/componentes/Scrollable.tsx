// Wrapper for simplebar-react that's compatible with React 19 types
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import type { ReactNode, CSSProperties } from 'react'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export default function Scrollable({ children, className, style }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SB = SimpleBar as any
  return (
    <SB className={className} style={style}>
      {children}
    </SB>
  )
}
