import { z } from 'zod'
import { gameStateSchema, type GameStateType } from './game'
import { stateChangeSchema, type StateChange } from './command'

// API 响应信封
export type ApiResponse<T = any, E = string> = {
  success: boolean
  data: T | null
  error: E | null
  timestamp: number
}

export type PaginatedResponse<T = any> = ApiResponse<{
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}>

// WebSocket 消息类型
export enum WsMessageType {
  // 连接管理
  Handshake = 'handshake',
  Auth = 'auth',
  Ping = 'ping',
  Pong = 'pong',
  Disconnect = 'disconnect',

  // 游戏状态
  GameState = 'game_state',
  PlayerUpdate = 'player_update',
  PlayerJoin = 'player_join',
  PlayerLeave = 'player_leave',

  // 玩家操作
  PlayerInput = 'player_input',
  PlayerAction = 'player_action',

  // 游戏事件
  GameEvent = 'game_event',
  ChatMessage = 'chat_message',

  // 状态同步
  StateDelta = 'state_delta',    // 增量同步
  FullSync = 'full_sync',        // 全量同步
  SyncRequest = 'sync_request',  // 同步请求
}

// ===== 状态同步消息类型 =====

/**
 * 状态增量消息
 */
export interface StateDeltaPayload {
  gameId: string
  fromVersion: number
  toVersion: number
  delta: unknown      // jsondiffpatch delta
  changes: StateChange[]
}

/**
 * 全量同步消息
 */
export interface FullSyncPayload {
  gameId: string
  version: number
  state: GameStateType
  reason: 'version_mismatch' | 'reconnect' | 'initial'
}

/**
 * 同步请求消息
 */
export interface SyncRequestPayload {
  gameId: string
  clientVersion: number
  playerId: string
}

/**
 * 同步响应
 */
export interface SyncResponse {
  type: 'delta' | 'full_sync'
  payload: StateDeltaPayload | FullSyncPayload
}

// WebSocket 消息基类
export type WsMessage<T = any> = {
  type: WsMessageType
  payload: T
  timestamp: number
  id?: string
}

// 握手消息
export type HandshakePayload = {
  clientId?: string
  version: string
  capabilities: string[]
}

export type HandshakeResponse = {
  serverId: string
  version: string
  sessionId: string
  heartbeatInterval: number
}

// 认证消息
export type AuthPayload = {
  token: string
}

export type AuthResponse = {
  authenticated: boolean
  playerId?: string
  username?: string
}

// 游戏状态消息
export type GameStatePayload = {
  state: GameStateType
  diff?: any // jsondiffpatch 差异
}

// 玩家输入
export type PlayerInput = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  jump: boolean
  attack: boolean
  special: boolean
}

export type PlayerInputPayload = {
  input: PlayerInput
  sequence: number
}

// 游戏事件
export type GameEvent = {
  type: string
  source: string
  target?: string
  data: Record<string, any>
}

// Zod 模式
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().nullable(),
  error: z.string().nullable(),
  timestamp: z.number(),
})

export const paginatedResponseSchema = apiResponseSchema.extend({
  data: z.object({
    items: z.array(z.any()),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
  }),
})

export const wsMessageTypeSchema = z.nativeEnum(WsMessageType)

export const wsMessageSchema = z.object({
  type: wsMessageTypeSchema,
  payload: z.any(),
  timestamp: z.number(),
  id: z.string().optional(),
})

export const handshakePayloadSchema = z.object({
  clientId: z.string().optional(),
  version: z.string(),
  capabilities: z.array(z.string()),
})

export const handshakeResponseSchema = z.object({
  serverId: z.string(),
  version: z.string(),
  sessionId: z.string(),
  heartbeatInterval: z.number(),
})

export const authPayloadSchema = z.object({
  token: z.string(),
})

export const authResponseSchema = z.object({
  authenticated: z.boolean(),
  playerId: z.string().optional(),
  username: z.string().optional(),
})

export const gameStatePayloadSchema = z.object({
  state: gameStateSchema,
  diff: z.any().optional(),
})

export const playerInputSchema = z.object({
  up: z.boolean(),
  down: z.boolean(),
  left: z.boolean(),
  right: z.boolean(),
  jump: z.boolean(),
  attack: z.boolean(),
  special: z.boolean(),
})

export const playerInputPayloadSchema = z.object({
  input: playerInputSchema,
  sequence: z.number(),
})

export const gameEventSchema = z.object({
  type: z.string(),
  source: z.string(),
  target: z.string().optional(),
  data: z.record(z.any()),
})

// ===== 状态同步 Schemas =====

export const stateDeltaPayloadSchema = z.object({
  gameId: z.string(),
  fromVersion: z.number().int().min(0),
  toVersion: z.number().int().min(0),
  delta: z.unknown(),
  changes: z.array(stateChangeSchema),
})

export const fullSyncPayloadSchema = z.object({
  gameId: z.string(),
  version: z.number().int().min(0),
  state: gameStateSchema,
  reason: z.enum(['version_mismatch', 'reconnect', 'initial']),
})

export const syncRequestPayloadSchema = z.object({
  gameId: z.string(),
  clientVersion: z.number().int().min(0),
  playerId: z.string(),
})

export const syncResponseSchema = z.object({
  type: z.enum(['delta', 'full_sync']),
  payload: z.union([stateDeltaPayloadSchema, fullSyncPayloadSchema]),
})

// 类型推断
export type ApiResponseType = z.infer<typeof apiResponseSchema>
export type PaginatedResponseType = z.infer<typeof paginatedResponseSchema>
export type WsMessageTypeType = z.infer<typeof wsMessageTypeSchema>
export type WsMessageTypeSchema = z.infer<typeof wsMessageSchema>
export type HandshakePayloadType = z.infer<typeof handshakePayloadSchema>
export type HandshakeResponseType = z.infer<typeof handshakeResponseSchema>
export type AuthPayloadType = z.infer<typeof authPayloadSchema>
export type AuthResponseType = z.infer<typeof authResponseSchema>
export type GameStatePayloadType = z.infer<typeof gameStatePayloadSchema>
export type PlayerInputType = z.infer<typeof playerInputSchema>
export type PlayerInputPayloadType = z.infer<typeof playerInputPayloadSchema>
export type GameEventType = z.infer<typeof gameEventSchema>
export type StateDeltaPayloadType = z.infer<typeof stateDeltaPayloadSchema>
export type FullSyncPayloadType = z.infer<typeof fullSyncPayloadSchema>
export type SyncRequestPayloadType = z.infer<typeof syncRequestPayloadSchema>
export type SyncResponseType = z.infer<typeof syncResponseSchema>