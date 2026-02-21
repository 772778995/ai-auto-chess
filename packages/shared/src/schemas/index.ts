// 重新导出类型定义中的 Zod 模式
export * from '../types/game'
export * from '../types/api'

// 游戏特定的验证模式
import { z } from 'zod'

// 聊天消息模式
export const chatMessageSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  username: z.string(),
  message: z.string().max(500),
  timestamp: z.number(),
  type: z.enum(['global', 'team', 'private']),
})

// 游戏配置模式
export const gameConfigSchema = z.object({
  maxPlayers: z.number().min(1).max(100),
  worldWidth: z.number().min(100).max(10000),
  worldHeight: z.number().min(100).max(10000),
  tickRate: z.number().min(10).max(120),
  gravity: z.number().min(0).max(100),
  friction: z.number().min(0).max(1),
})

// 玩家连接模式
export const playerConnectionSchema = z.object({
  playerId: z.string(),
  username: z.string(),
  token: z.string(),
  connectedAt: z.number(),
  lastPing: z.number(),
  clientInfo: z.object({
    userAgent: z.string(),
    screenWidth: z.number(),
    screenHeight: z.number(),
  }),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>
export type GameConfig = z.infer<typeof gameConfigSchema>
export type PlayerConnection = z.infer<typeof playerConnectionSchema>