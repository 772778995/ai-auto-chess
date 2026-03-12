// packages/shared/src/types/follower.ts
import { z } from 'zod'

// ===== 战场位置 =====

export interface BattlePosition {
  side: 'ally' | 'enemy'
  x: 0 | 1 | 2
  y: 0 | 1
}

// ===== 触发时机 =====

export type TriggerTiming =
  | 'onEnter'        // 入场
  | 'onGrowth'       // 成长
  | 'onFirstStrike'  // 先手
  | 'onAttack'       // 攻击时
  | 'onTakeDamage'   // 受伤时
  | 'onHit'          // 受伤后
  | 'onKill'         // 击杀
  | 'onDeath'        // 死亡（遗言）
  | 'onRoundEnd'     // 回合结束（准备）

// ===== 状态项 =====

export interface StatusItem {
  attack?: number      // 攻击力加成
  health?: number      // 生命上限加成
  shield?: number      // 护盾层数
  damageBonus?: number // 增伤：攻击伤害额外增加
  permanent: boolean   // 是否永久保留
  source: string       // 来源描述
}

// ===== 效果系统 =====

// 效果函数（前置声明，避免循环引用）
export type EffectFunction = (ctx: EffectContext) => EffectResult

// 效果定义 - 只有函数，描述由 Follower.description 统一提供
export type EffectDefinition = EffectFunction

// 序列化效果
export type SerializedEffect = string

// 效果上下文
export interface EffectContext {
  gameState: unknown   // GameState - 避免循环引用，实际包含 { allies, enemies, ... }
  self: FollowerInstance
  tools: EffectTools
  event?: EffectGameEvent
}

// 效果工具
export interface EffectTools {
  cloneDeep: <T>(obj: T) => T
  getRandomEnemy: (state: unknown, pos?: BattlePosition) => FollowerInstance | null
  getRandomAlly: (state: unknown, pos?: BattlePosition) => FollowerInstance | null
  getAllAllies: (state: unknown) => FollowerInstance[]
  getAllEnemies: (state: unknown) => FollowerInstance[]
  getColumnAllies: (state: unknown, x: number) => FollowerInstance[]
}

// 效果触发事件（用于效果函数）
export interface EffectGameEvent {
  type: 'attack' | 'damage' | 'kill' | 'death'
  source?: FollowerInstance
  target?: FollowerInstance
  value?: number
}

// ===== 游戏事件 =====

export type DamageType = 'physical' | 'magical' | 'true'

// 伤害事件
export interface DamageEvent {
  type: 'damage'
  targets: FollowerInstance[]
  value: number
  damageType: DamageType
  source?: FollowerInstance
}

// 治疗事件
export interface HealEvent {
  type: 'heal'
  targets: FollowerInstance[]
  value: number
}

// 召唤事件
export interface SummonEvent {
  type: 'summon'
  followers: FollowerInstance[]
  positions: BattlePosition[]
}

// 死亡事件
export interface DeathEvent {
  type: 'death'
  follower: FollowerInstance
}

// 游戏事件联合类型
export type FollowerGameEvent = DamageEvent | HealEvent | SummonEvent | DeathEvent

// 效果返回值
export interface EffectResult {
  gameState: unknown
  events?: FollowerGameEvent[]
}

// ===== 随从模板 =====

export interface Follower {
  id: string
  name: string
  description: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  baseAttack: number
  baseHealth: number
  effects?: Partial<Record<TriggerTiming, EffectDefinition[]>>
  equipmentSlots: number
  imageUrl: string
}

// 序列化随从
export interface SerializedFollower extends Omit<Follower, 'effects'> {
  effects: Partial<Record<TriggerTiming, string[]>>
}

// ===== 随从实例 =====

export interface FollowerInstance extends Omit<Follower, 'effects'> {
  instanceId: string
  ownerId: string
  position: BattlePosition
  currentHealth: number
  statusList: StatusItem[]
  equipment: string[]
  // 静态属性
  taunt?: boolean
  windfury?: boolean  // 疯狂：攻击次数+1
}

// ===== Zod 模式 =====

export const battlePositionSchema = z.object({
  side: z.enum(['ally', 'enemy']),
  x: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  y: z.union([z.literal(0), z.literal(1)])
})

export const triggerTimingSchema = z.enum([
  'onEnter', 'onGrowth', 'onFirstStrike', 'onAttack', 'onTakeDamage',
  'onHit', 'onKill', 'onDeath', 'onRoundEnd'
])

export const statusItemSchema = z.object({
  attack: z.number().optional(),
  health: z.number().optional(),
  shield: z.number().optional(),
  damageBonus: z.number().optional(),
  permanent: z.boolean(),
  source: z.string()
})

export const followerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  baseAttack: z.number(),
  baseHealth: z.number(),
  effects: z.record(z.any()).optional(),
  equipmentSlots: z.number(),
  imageUrl: z.string()
})

export const followerInstanceSchema = followerSchema.extend({
  instanceId: z.string(),
  ownerId: z.string(),
  position: battlePositionSchema,
  currentHealth: z.number(),
  statusList: z.array(statusItemSchema),
  equipment: z.array(z.string()),
  taunt: z.boolean().optional(),
  windfury: z.boolean().optional()
})

// ===== 类型导出 =====

export type FollowerType = z.infer<typeof followerSchema>
export type FollowerInstanceType = z.infer<typeof followerInstanceSchema>