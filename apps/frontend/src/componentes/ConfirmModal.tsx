import { type ReactNode } from 'react'
import { Button } from '@/componentes/ui/button'
import { AlertTriangle } from 'lucide-react'

type Props = {
  open: boolean
  title?: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-sm mx-4 p-8 space-y-6">

        {/* icon + title */}
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10' : 'bg-[#ff5a66]/10'}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-[#ff5a66]'}`} />
          </div>
          <div>
            <h3
              className="text-[22px] font-light text-white/95 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-[12px] text-white/40 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-10 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm ${
              danger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[#ff5a66] hover:bg-[#ff7078] text-black'
            } disabled:opacity-50`}
          >
            {loading ? 'Deleting...' : confirmLabel}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.2em] rounded-sm"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
