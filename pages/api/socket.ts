import { Server } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as NetServer } from 'http'
import type { Socket as NetSocket } from 'net'
import dbConnect from '@/lib/mongodb'
import ChatMessage from '@/models/ChatMessage'

interface SocketServer extends NetServer {
  io?: Server
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server as any, {
      path: '/api/socket',
      addTrailingSlash: false,
    })
    res.socket.server.io = io

    await dbConnect()

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id)

      socket.on('send-message', async (data) => {
        try {
          const { senderId, senderName, senderRole, message } = data
          const newMessage = new ChatMessage({
            senderId,
            senderName,
            senderRole,
            message,
            timestamp: new Date()
          })
          await newMessage.save()
          
          // Broadcast to all connected clients
          io.emit('receive-message', newMessage)
        } catch (error) {
          console.error('Error saving message:', error)
        }
      })

      socket.on('get-history', async () => {
        try {
          const messages = await ChatMessage.find().sort({ timestamp: 1 }).limit(50)
          socket.emit('chat-history', messages)
        } catch (error) {
          console.error('Error fetching history:', error)
        }
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }
  res.end()
}
