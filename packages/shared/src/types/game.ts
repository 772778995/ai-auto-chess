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

// ============================================
// 新版游戏状态类型（带版本号）
// ============================================

// 玩家状态（新版）
export interface PlayerState {
  id: string
  username: string
  heroId?: string

  // 资源
  health: number
  maxHealth: number
  gold: number
  shopLevel: number
  shopExp: number

  // 战场和手牌
  battlefield: (z.infer<typeof followerInstanceSchema> | null)[]  // 6 个位置
  hand: z.infer<typeof followerInstanceSchema>[]

  // 商店（6 个槽位）
  shop: (ShopSlot | null)[]
  shopLocked: boolean

  // 状态
  isReady: boolean
  isAlive: boolean

  // 战斗结果
  combatResult?: {
    opponentId: string
    isWin: boolean
    damageDealt: number
  }
}

// 商店槽位
export interface ShopSlot {
  type: 'follower' | 'equipment' | 'spell'
  cardId: string
  isLocked: boolean
  discount: number
}

// 基础游戏状态（通用字段）
export interface BaseGameState {
  id: string
  mode: 'campaign' | 'multiplayer'

  // 版本号：初始为 0，每次状态变更 +1
  version: number

  // 基础信息
  currentRound: number
  phase: GamePhase
  subPhase?: CombatSubPhase  // 仅战斗阶段有子阶段
  turnTimer: number

  // 时间戳
  createdAt: number
  updatedAt: number

  // 玩家状态（Record 兼容 RedisJSON）
  players: Record<string, PlayerState>

  // 商店卡池（招募阶段使用）
  cardPool?: {
    followers: string[]  // 随从 ID 列表
    equipment: string[]  // 装备 ID 列表
  }

  // 战斗专用
  combat?: {
    diceRollResult: DiceRollResult
    attackLog: AttackEvent[]
    currentAttackerId?: string
  }

  // 结果
  result?: {
    winnerId: string
    damageDealt: number
    rounds: number
    endedAt: number
  }
}

// 单机闯关游戏状态
export interface CampaignGameState extends BaseGameState {
  mode: 'campaign'
  userId: string              // 玩家ID（单机只有一个玩家）
  level: number               // 当前关卡（1-10）
  campaignProgressId: string  // 关联的 CampaignProgress ID
}

// 战斗结果
export interface BattleResult {
  winnerId: string | null     // null = 平局
  damage: number              // 输家扣血量
  rounds: number              // 战斗回合数
  mvpFollowerId?: string      // MVP 随从 ID
  eventCount: number          // 事件总数
}

// 回合战斗记录
export interface RoundBattle {
  playerIds: [string, string] // 对战双方
  battleId: string            // 战斗唯一 ID
  status: 'matched' | 'fighting' | 'completed'
  result: BattleResult | null // null = 未开始或进行中
}

// 联机对战游戏状态
export interface MultiplayerGameState extends BaseGameState {
  mode: 'multiplayer'
  roomId: string              // 所属房间ID
  maxPlayers: number          // 最大玩家数

  // 招募阶段：指令日志 Key
  commandLogKey: string

  // 战斗阶段：每回合战斗记录 [回合索引][对战配对索引]
  roundBattles: RoundBattle[][]
}

// 新版游戏状态联合类型
export type GameState = CampaignGameState | MultiplayerGameState

// Zod 模式：新版游戏状态
export const shopSlotSchema = z.object({
  type: z.enum(['follower', 'equipment', 'spell']),
  cardId: z.string(),
  isLocked: z.boolean(),
  discount: z.number(),
})

export const playerStateSchema = z.object({
  id: z.string(),
  username: z.string(),
  heroId: z.string().optional(),
  health: z.number(),
  maxHealth: z.number(),
  gold: z.number(),
  shopLevel: z.number(),
  shopExp: z.number(),
  battlefield: z.array(followerInstanceSchema.nullable()),
  hand: z.array(followerInstanceSchema),
  shop: z.array(shopSlotSchema.nullable()),
  shopLocked: z.boolean(),
  isReady: z.boolean(),
  isAlive: z.boolean(),
  combatResult: z.object({
    opponentId: z.string(),
    isWin: z.boolean(),
    damageDealt: z.number(),
  }).optional(),
})

export const baseGameStateSchema = z.object({
  id: z.string(),
  mode: z.enum(['campaign', 'multiplayer']),
  version: z.number().int().nonnegative(),
  currentRound: z.number().int().positive(),
  phase: gamePhaseSchema,
  subPhase: combatSubPhaseSchema.optional(),
  turnTimer: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  players: z.record(playerStateSchema),
  cardPool: z.object({
    followers: z.array(z.string()),
    equipment: z.array(z.string()),
  }).optional(),
  combat: z.object({
    diceRollResult: z.any(), // DiceRollResult 复杂，简化处理
    attackLog: z.array(z.any()),
    currentAttackerId: z.string().optional(),
  }).optional(),
  result: z.object({
    winnerId: z.string(),
    damageDealt: z.number(),
    rounds: z.number(),
    endedAt: z.number(),
  }).optional(),
})

export const campaignGameStateSchema = baseGameStateSchema.extend({
  mode: z.literal('campaign'),
  userId: z.string(),
  level: z.number().int().min(1).max(10),
  campaignProgressId: z.string(),
})

// 战斗结果 Zod 模式
export const battleResultSchema = z.object({
  winnerId: z.string().nullable(),
  damage: z.number(),
  rounds: z.number(),
  mvpFollowerId: z.string().optional(),
  eventCount: z.number(),
})

// 回合战斗记录 Zod 模式
export const roundBattleSchema = z.object({
  playerIds: z.tuple([z.string(), z.string()]),
  battleId: z.string(),
  status: z.enum(['matched', 'fighting', 'completed']),
  result: battleResultSchema.nullable(),
})

export const multiplayerGameStateSchema = baseGameStateSchema.extend({
  mode: z.literal('multiplayer'),
  roomId: z.string(),
  maxPlayers: z.number().int().positive(),
  commandLogKey: z.string(),
  roundBattles: z.array(z.array(roundBattleSchema)),
})

export const newGameStateSchema = z.discriminatedUnion('mode', [
  campaignGameStateSchema,
  multiplayerGameStateSchema,
])

// 新版类型导出
export type ShopSlotType = z.infer<typeof shopSlotSchema>
export type PlayerStateType = z.infer<typeof playerStateSchema>
export type BaseGameStateType = z.infer<typeof baseGameStateSchema>
export type CampaignGameStateType = z.infer<typeof campaignGameStateSchema>
export type MultiplayerGameStateType = z.infer<typeof multiplayerGameStateSchema>

// ============================================
// 向后兼容：旧的通用游戏类型
// ============================================

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

// 旧版游戏状态（向后兼容）
export type LegacyGameState = {
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

export const legacyGameStateSchema = z.object({
  world: gameWorldSchema,
  tick: z.number(),
  timestamp: z.number(),
  playerCount: z.number(),
})

export type GameObjectType = z.infer<typeof gameObjectSchema>
export type GameWorldType = z.infer<typeof gameWorldSchema>
export type LegacyGameStateType = z.infer<typeof legacyGameStateSchema>

// 向后兼容别名
export const gameStateSchema = legacyGameStateSchema
export type GameStateType = LegacyGameStateType
