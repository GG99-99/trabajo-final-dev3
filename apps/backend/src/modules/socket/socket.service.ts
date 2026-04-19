import { Server as HttpServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'

export interface ConnectedUser {
  socketId: string
  userId: string
  email: string
  userType: string
  connectedAt: Date
}

// In-memory map: socketId -> ConnectedUser
const connectedUsers = new Map<string, ConnectedUser>()

let io: SocketIOServer | null = null

export function initSocketIO(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost')) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`)

    // The frontend sends user info right after connecting
    socket.on('user:identify', (data: { userId: string; email: string; userType: string }) => {
      const user: ConnectedUser = {
        socketId: socket.id,
        userId: data.userId,
        email: data.email,
        userType: data.userType,
        connectedAt: new Date(),
      }
      connectedUsers.set(socket.id, user)
      console.log(`[Socket.IO] User identified: ${data.email} (${data.userType})`)
      broadcastOnlineUsers()
    })

    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id)
      if (user) {
        console.log(`[Socket.IO] User disconnected: ${user.email}`)
        connectedUsers.delete(socket.id)
        broadcastOnlineUsers()
      }
    })
  })

  return io
}

function broadcastOnlineUsers() {
  if (!io) return
  const users = Array.from(connectedUsers.values())
  io.emit('users:online', users)
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('Socket.IO not initialized')
  return io
}

export function getConnectedUsers(): ConnectedUser[] {
  return Array.from(connectedUsers.values())
}
