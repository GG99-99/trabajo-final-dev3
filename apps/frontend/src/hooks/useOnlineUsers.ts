import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { UserCredentials } from '@final/shared'

export interface OnlineUser {
  socketId: string
  userId: string
  email: string
  userType: string
  connectedAt: string // ISO string from server
}

// VITE_API_URL points to http://localhost:3030/api — strip /api to get the socket root
const API_URL  = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '')   // → http://localhost:3030

export function useOnlineUsers(user: UserCredentials | null) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [connected, setConnected]     = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!user) return

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      // Start with polling so the HTTP upgrade handshake completes correctly,
      // then let Socket.IO upgrade to WebSocket automatically.
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('user:identify', {
        userId: String(user.person_id),
        email: user.email,
        userType: user.type,
      })
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.warn('[Socket.IO] connect_error:', err.message)
      setConnected(false)
    })

    socket.on('users:online', (users: OnlineUser[]) => {
      setOnlineUsers(users)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
      setOnlineUsers([])
    }
  }, [user])

  return { onlineUsers, connected }
}
