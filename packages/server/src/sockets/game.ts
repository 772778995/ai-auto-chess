import { WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { computeAndSerializeDiff } from '@game/shared'
import { WsMessageType } from '@game/shared'
import type { WsMessage, HandshakePayload, AuthPayload, PlayerInputPayload, GameState } from '@game/shared'

// 连接状态
interface ConnectionState {
  id: string
  connectedAt: number
  lastPing: number
  authenticated: boolean
  playerId?: string
  username?: string
  sessionId?: string
  roomId?: string
}

// 游戏房间状态
interface GameRoom {
  id: string
  name: string
  players: Map<string, ConnectionState>
  gameState: GameState
  lastTick: number
}

// 内存存储（生产环境应使用 Redis 等）
const connections = new Map<string, ConnectionState>()
const rooms = new Map<string, GameRoom>()

// 生成唯一 ID
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// 处理新连接
export function handleConnection(ws: WebSocket, request: IncomingMessage) {
  const connectionId = generateId()
  const ip = request.socket.remoteAddress || 'unknown'

  const state: ConnectionState = {
    id: connectionId,
    connectedAt: Date.now(),
    lastPing: Date.now(),
    authenticated: false,
  }

  connections.set(connectionId, state)

  // 发送握手请求
  sendMessage(ws, {
    type: WsMessageType.Handshake,
    payload: {
      serverId: 'game-server-1',
      version: '0.1.0',
      sessionId: connectionId,
      heartbeatInterval: 30000,
    },
    timestamp: Date.now(),
  })

  // 消息处理
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString()) as WsMessage
      handleMessage(ws, connectionId, message)
    } catch (error) {
      console.error('❌ Failed to parse message:', error)
      sendError(ws, 'Invalid message format')
    }
  })

  // 心跳检测
  const heartbeatInterval = setInterval(() => {
    const now = Date.now()
    const connection = connections.get(connectionId)

    if (!connection) {
      clearInterval(heartbeatInterval)
      return
    }

    // 检查连接是否超时（60秒无心跳）
    if (now - connection.lastPing > 60000) {
      console.log(`⏰ Connection ${connectionId} timeout`)
      ws.close(1001, 'Heartbeat timeout')
      connections.delete(connectionId)
      clearInterval(heartbeatInterval)
      return
    }

    // 发送 ping
    sendMessage(ws, {
      type: WsMessageType.Ping,
      payload: { timestamp: now },
      timestamp: now,
    })
  }, 30000)

  // 连接关闭
  ws.on('close', () => {
    clearInterval(heartbeatInterval)
    connections.delete(connectionId)

    // 从房间中移除玩家
    if (state.roomId && state.playerId) {
      const room = rooms.get(state.roomId)
      if (room) {
        room.players.delete(state.playerId)
        broadcastToRoom(state.roomId, {
          type: WsMessageType.PlayerLeave,
          payload: { playerId: state.playerId },
          timestamp: Date.now(),
        })

        // 如果房间为空，清理房间
        if (room.players.size === 0) {
          rooms.delete(state.roomId)
        }
      }
    }

    console.log(`🔌 Connection ${connectionId} closed`)
  })

  console.log(`✅ Connection ${connectionId} established from ${ip}`)
}

// 处理消息
function handleMessage(ws: WebSocket, connectionId: string, message: WsMessage) {
  const state = connections.get(connectionId)
  if (!state) {
    sendError(ws, 'Connection not found')
    return
  }

  // 更新最后 ping 时间
  if (message.type === WsMessageType.Pong) {
    state.lastPing = Date.now()
    return
  }

  // 路由消息
  switch (message.type) {
    case WsMessageType.Handshake:
      handleHandshake(ws, connectionId, message.payload as HandshakePayload)
      break

    case WsMessageType.Auth:
      handleAuth(ws, connectionId, message.payload as AuthPayload)
      break

    case WsMessageType.PlayerInput:
      if (state.authenticated && state.roomId) {
        handlePlayerInput(connectionId, state.roomId, message.payload as PlayerInputPayload)
      } else {
        sendError(ws, 'Not authenticated or not in a room')
      }
      break

    case WsMessageType.PlayerAction:
      if (state.authenticated && state.roomId) {
        handlePlayerAction(connectionId, state.roomId, message.payload)
      }
      break

    default:
      console.warn(`⚠️  Unknown message type: ${message.type}`)
      sendError(ws, `Unknown message type: ${message.type}`)
  }
}

// 处理握手
function handleHandshake(ws: WebSocket, connectionId: string, payload: HandshakePayload) {
  const state = connections.get(connectionId)
  if (!state) return

  console.log(`🤝 Handshake from ${connectionId}, version: ${payload.version}`)

  // 这里可以验证客户端版本等
  sendMessage(ws, {
    type: WsMessageType.Auth,
    payload: { requiresAuth: true },
    timestamp: Date.now(),
  })
}

// 处理认证
function handleAuth(ws: WebSocket, connectionId: string, payload: AuthPayload) {
  // 记录认证请求信息（简化版本不验证 token）
  console.log('Processing auth request, payload received:', Object.keys(payload))

  const state = connections.get(connectionId)
  if (!state) return

  // TODO: 实际认证逻辑
  // 这里简化处理，生产环境应验证 JWT token
  const mockPlayerId = generateId()
  const mockUsername = `Player_${mockPlayerId.substring(0, 6)}`

  state.authenticated = true
  state.playerId = mockPlayerId
  state.username = mockUsername

  // 创建或加入游戏房间
  let room = Array.from(rooms.values()).find(r => r.players.size < 4) // 最多4人
  if (!room) {
    room = createGameRoom()
  }

  state.roomId = room.id
  room.players.set(mockPlayerId, state)

  // 发送认证成功响应
  sendMessage(ws, {
    type: WsMessageType.Auth,
    payload: {
      authenticated: true,
      playerId: mockPlayerId,
      username: mockUsername,
      roomId: room.id,
    },
    timestamp: Date.now(),
  })

  // 广播新玩家加入
  broadcastToRoom(room.id, {
    type: WsMessageType.PlayerJoin,
    payload: {
      playerId: mockPlayerId,
      username: mockUsername,
    },
    timestamp: Date.now(),
  })

  // 发送当前游戏状态
  sendMessage(ws, {
    type: WsMessageType.GameState,
    payload: { state: room.gameState },
    timestamp: Date.now(),
  })

  console.log(`✅ Player ${mockUsername} (${mockPlayerId}) authenticated and joined room ${room.id}`)
}

// 处理玩家输入
function handlePlayerInput(connectionId: string, roomId: string, payload: PlayerInputPayload) {
  const room = rooms.get(roomId)
  const state = connections.get(connectionId)
  if (!room || !state || !state.playerId) return

  // TODO: 处理玩家输入，更新游戏状态
  // 这里简化处理，实际游戏逻辑会更复杂

  // 广播输入到房间（用于演示）
  broadcastToRoom(roomId, {
    type: WsMessageType.PlayerInput,
    payload: {
      playerId: state.playerId,
      input: payload.input,
      sequence: payload.sequence,
    },
    timestamp: Date.now(),
  })
}

// 处理玩家动作
function handlePlayerAction(connectionId: string, roomId: string, payload: any) {
  const room = rooms.get(roomId)
  const state = connections.get(connectionId)
  if (!room || !state || !state.playerId) return

  // TODO: 处理玩家动作
  broadcastToRoom(roomId, {
    type: WsMessageType.PlayerAction,
    payload: {
      playerId: state.playerId,
      action: payload,
    },
    timestamp: Date.now(),
  })
}

// 创建游戏房间
function createGameRoom(): GameRoom {
  const roomId = generateId()

  const room: GameRoom = {
    id: roomId,
    name: `Room_${roomId.substring(0, 6)}`,
    players: new Map(),
    gameState: createInitialGameState(),
    lastTick: Date.now(),
  }

  rooms.set(roomId, room)

  // 启动游戏循环
  startGameLoop(roomId)

  console.log(`🎮 Created game room: ${room.name} (${roomId})`)
  return room
}

// 创建初始游戏状态
function createInitialGameState(): GameState {
  return {
    world: {
      id: 'world-1',
      name: 'Default World',
      size: { width: 1920, height: 1080 },
      players: {},
      objects: {},
      physics: {
        gravity: 9.8,
        friction: 0.8,
      },
    },
    tick: 0,
    timestamp: Date.now(),
    playerCount: 0,
  }
}

// 游戏循环
function startGameLoop(roomId: string) {
  const room = rooms.get(roomId)
  if (!room) return

  const tickRate = 60 // 每秒60次
  const tickInterval = 1000 / tickRate

  const gameLoop = setInterval(() => {
    const room = rooms.get(roomId)
    if (!room || room.players.size === 0) {
      clearInterval(gameLoop)
      return
    }

    // 更新游戏状态
    const oldState = room.gameState
    const newState = updateGameState(oldState, room.players)
    room.gameState = newState

    // 计算差异
    const diff = computeAndSerializeDiff(oldState, newState)

    // 广播游戏状态更新
    broadcastToRoom(roomId, {
      type: WsMessageType.GameState,
      payload: {
        state: newState,
        diff: diff ? Array.from(diff) : undefined,
      },
      timestamp: Date.now(),
    })

    room.lastTick++
  }, tickInterval)
}

// 更新游戏状态（简化）
function updateGameState(state: GameState, players: Map<string, ConnectionState>): GameState {
  // TODO: 实际游戏状态更新逻辑
  // 这里返回一个轻微修改的状态用于演示
  return {
    ...state,
    tick: state.tick + 1,
    timestamp: Date.now(),
    playerCount: players.size,
  }
}

// 广播消息到房间
function broadcastToRoom(roomId: string, message: WsMessage) {
  const room = rooms.get(roomId)
  if (!room) return

  for (const [playerId, state] of room.players) {
    const connection = connections.get(state.id)
    if (connection) {
      // 在实际实现中，这里需要通过 WebSocket 发送
      // 由于我们无法访问原始的 ws 对象，这里只是一个示例
      console.log(`📨 Broadcast to ${playerId}: ${message.type}`)
    }
  }
}

// 发送消息
function sendMessage(ws: WebSocket, message: WsMessage) {
  ws.send(JSON.stringify(message))
}

// 发送错误
function sendError(ws: WebSocket, error: string) {
  sendMessage(ws, {
    type: WsMessageType.Disconnect,
    payload: { error },
    timestamp: Date.now(),
  })
}

// 导出函数
export {
  createGameRoom,
  broadcastToRoom,
}