// packages/shared/src/types/game.ts
import { z } from 'zod'
import { followerSchema, followerInstanceSchema } from './follower'

// 游戏阶段
export enum GamePhase {
  LOBBY = 'lobby',
  HERO_SELECT = 'hero_select',
  RECRUIT = 'recruit',
  COMBAT = 'combat',
  SETTLEMENT = 'settlement',
  ENDED = 'ended'
}

// 招募子阶段
export enum RecruitSubPhase {
  SHOPPING = 'shopping',
  POSITIONING = 'positioning',
  READY = 'ready'
}

// 战斗子阶段
export enum CombatSubPhase {
  DICE_ROLL = 'dice_roll',
  FIGHTING = 'fighting',
  RESULT = 'result'
}

// 玩家
export interface Player {
  id: string
  username: string
  heroId?: string
  health: number
  maxHealth: number
  gold: number
  maxGold: number
  shopLevel: number
  shopExp: number
  experience: number
  experienceToNext: number
  
  // 战场 6 位置
  battlefield: (z.infer<typeof followerInstanceSchema> | null)[]
  
  // 手牌
  hand: z.infer<typeof followerInstanceSchema>[]
  
  // 状态
  isReady: boolean
  isAlive: boolean
  rank?: number
  combatResult?: CombatResult
}

// 战斗结果
export interface CombatResult {
  opponentId: string
  isWin: boolean
  damageDealt: number
  rounds: number
  mvpFollowerId?: string
  events: AttackEvent[]
}

// 攻击事件
export interface AttackEvent {
  attackerId: string
  targetId: string
  damage: number
  isCritical: boolean
  triggeredKeywordIds: string[]
}

// 拼点结果
export interface DiceRollResult {
  playerA: {
    playerId: string
    value: number
    modifier: number
    finalValue: number
  }
  playerB: {
    playerId: string
    value: number
    modifier: number
    finalValue: number
  }
  firstAttackerId: string
}

// 游戏房间
export interface GameRoom {
  id: string
  name: string
  hostId: string
  players: Player[]
  maxPlayers: number
  status: 'waiting' | 'playing' | 'ended'
  createdAt: number
  startedAt?: number
  endedAt?: number
}

// 游戏会话
export interface GameSession {
  roomId: string
  currentRound: number
  phase: GamePhase
  subPhase: RecruitSubPhase | CombatSubPhase
  turnTimer: number
  timestamp: number
}

// 单机闯关进度
export interface CampaignProgress {
  currentLevel: number
  health: number
  maxHealth: number
  gold: number
  shopLevel: number
  shopExp: number
  followers: z.infer<typeof followerInstanceSchema>[]
  equipment: string[]
  spells: string[]
  isVictory: boolean
  isDefeated: boolean
}

// 关卡配置
export interface LevelConfig {
  id: number
  type: 'combat' | 'elite' | 'rest' | 'boss'
  name: string
  enemyFormation: (z.infer<typeof followerSchema> | null)[]
  reward?: {
    gold?: number
    card?: unknown
  }
}

// 兼容旧版 - 基础游戏类型
export type Vector2 = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Rectangle = Vector2 & Size

// Zod 模式
export const gamePhaseSchema = z.nativeEnum(GamePhase)
export const recruitSubPhaseSchema = z.nativeEnum(RecruitSubPhase)
export const combatSubPhaseSchema = z.nativeEnum(CombatSubPhase)

export const combatResultSchema = z.object({
  opponentId: z.string(),
  isWin: z.boolean(),
  damageDealt: z.number(),
  rounds: z.number(),
  mvpFollowerId: z.string().optional(),
  events: z.array(z.any())
})

export const playerSchema = z.object({
  id: z.string(),
  username: z.string(),
  heroId: z.string().optional(),
  health: z.number(),
  maxHealth: z.number(),
  gold: z.number(),
  maxGold: z.number(),
  shopLevel: z.number(),
  shopExp: z.number(),
  experience: z.number(),
  experienceToNext: z.number(),
  battlefield: z.array(followerInstanceSchema.nullable()),
  hand: z.array(followerInstanceSchema),
  isReady: z.boolean(),
  isAlive: z.boolean(),
  rank: z.number().optional(),
  combatResult: combatResultSchema.optional()
})

export const gameRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  hostId: z.string(),
  players: z.array(playerSchema),
  maxPlayers: z.number(),
  status: z.enum(['waiting', 'playing', 'ended']),
  createdAt: z.number(),
  startedAt: z.number().optional(),
  endedAt: z.number().optional()
})

export const gameSessionSchema = z.object({
  roomId: z.string(),
  currentRound: z.number(),
  phase: gamePhaseSchema,
  subPhase: z.union([recruitSubPhaseSchema, combatSubPhaseSchema]),
  turnTimer: z.number(),
  timestamp: z.number()
})

export const campaignProgressSchema = z.object({
  currentLevel: z.number(),
  health: z.number(),
  maxHealth: z.number(),
  gold: z.number(),
  shopLevel: z.number(),
  shopExp: z.number(),
  followers: z.array(followerInstanceSchema),
  equipment: z.array(z.string()),
  spells: z.array(z.string()),
  isVictory: z.boolean(),
  isDefeated: z.boolean()
})

// 兼容旧版 Zod 模式
export const vector2Schema = z.object({
  x: z.number(),
  y: z.number(),
})

export const sizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

export const rectangleSchema = vector2Schema.merge(sizeSchema)

export type PlayerType = z.infer<typeof playerSchema>
export type GameRoomType = z.infer<typeof gameRoomSchema>
export type GameSessionType = z.infer<typeof gameSessionSchema>
export type CampaignProgressType = z.infer<typeof campaignProgressSchema>
export type Vector2Type = z.infer<typeof vector2Schema>
export type SizeType = z.infer<typeof sizeSchema>
export type RectangleType = z.infer<typeof rectangleSchema>

// 向后兼容：旧的通用游戏类型
export type GameObject = {
  id: string
  type: string
  position: Vector2
  size: Size
  properties: Record<string, unknown>
}

export type GameWorld = {
  id: string
  name: string
  size: Size
  players: Record<string, Player>
  objects: Record<string, GameObject>
  physics: {
    gravity: number
    friction: number
  }
}

export type GameState = {
  world: GameWorld
  tick: number
  timestamp: number
  playerCount: number
}

// 向后兼容：旧的 Zod 模式
export const gameObjectSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: vector2Schema,
  size: sizeSchema,
  properties: z.record(z.unknown()),
})

export const gameWorldSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: sizeSchema,
  players: z.record(playerSchema),
  objects: z.record(gameObjectSchema),
  physics: z.object({
    gravity: z.number(),
    friction: z.number(),
  }),
})

export const gameStateSchema = z.object({
  world: gameWorldSchema,
  tick: z.number(),
  timestamp: z.number(),
  playerCount: z.number(),
})

export type GameObjectType = z.infer<typeof gameObjectSchema>
export type GameWorldType = z.infer<typeof gameWorldSchema>
export type GameStateType = z.infer<typeof gameStateSchema>
