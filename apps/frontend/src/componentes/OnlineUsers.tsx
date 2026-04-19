import { Circle, Wifi, WifiOff } from 'lucide-react'
import type { OnlineUser } from '@/hooks/useOnlineUsers'

interface OnlineUsersProps {
  users: OnlineUser[]
  connected: boolean
}

const typeLabel: Record<string, string> = {
  worker:  'Staff',
  cashier: 'Cashier',
  client:  'Client',
}

const typeDot: Record<string, string> = {
  worker:  'bg-[#ff5a66]',
  cashier: 'bg-yellow-400',
  client:  'bg-blue-400',
}

function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export default function OnlineUsers({ users, connected }: OnlineUsersProps) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-[28px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Online Now
          </h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1">
            Real-time connected users
          </p>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-white/30" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Count badges */}
      <div className="flex gap-3 mb-6">
        {(['worker', 'cashier', 'client'] as const).map(role => {
          const count = users.filter(u => u.userType === role).length
          return (
            <div
              key={role}
              className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full"
            >
              <span className={`w-2 h-2 rounded-full ${typeDot[role]}`} />
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/50">
                {typeLabel[role]}
              </span>
              <span className="text-[12px] font-medium text-white/80">{count}</span>
            </div>
          )
        })}
      </div>

      {/* User list */}
      {users.length === 0 ? (
        <div className="py-10 text-center text-white/20 text-sm">
          No users connected
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div
              key={u.socketId}
              className="flex items-center justify-between px-4 py-3 bg-black/40 border border-white/10 rounded-sm hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Animated green dot */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <div>
                  <p className="text-white/85 text-sm font-medium">{u.email}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/35">
                    Connected {timeAgo(u.connectedAt)}
                  </p>
                </div>
              </div>
              <span
                className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${
                  u.userType === 'worker'
                    ? 'bg-[#ff5a66]/10 text-[#ff5a66] border-[#ff5a66]/20'
                    : u.userType === 'cashier'
                    ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                    : 'bg-blue-400/10 text-blue-400 border-blue-400/20'
                }`}
              >
                {typeLabel[u.userType] ?? u.userType}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total footer */}
      {users.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">Total online</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
