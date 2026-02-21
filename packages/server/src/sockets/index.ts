import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'http'
import { WebSocketServer } from 'ws'
import { handleConnection } from './game'

export function setupWebSocketServer(wss: WebSocketServer) {
  console.log('🔌 Setting up WebSocket server...')

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    console.log('🔄 New WebSocket connection')

    // 处理连接
    handleConnection(ws, request)

    // 错误处理
    ws.on('error', (error: Error) => {
      console.error('💥 WebSocket error:', error)
    })

    // 关闭处理
    ws.on('close', (code: number, reason: Buffer) => {
      console.log(`🔌 WebSocket closed: ${code} - ${reason}`)
    })
  })

  // 服务器级事件
  wss.on('error', (error: Error) => {
    console.error('💥 WebSocket server error:', error)
  })

  wss.on('close', () => {
    console.log('🔌 WebSocket server closed')
  })

  console.log('✅ WebSocket server setup complete')
}