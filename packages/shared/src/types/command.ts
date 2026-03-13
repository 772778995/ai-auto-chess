// packages/shared/src/types/command.ts
import { z } from 'zod'

// ===== 指令类型 =====

// 指令类型联合类型
export type CommandType =
  | 'BUY'
  | 'SELL'
  | 'REFRESH'
  | 'LOCK'
  | 'UPGRADE'
  | 'MOVE'
  | 'EQUIP'
  | 'USE_SPELL'
  | 'CONFIRM'

// CommandType 常量对象（用于运行时访问）
export const CommandTypeValues = {
  BUY: 'BUY',
  SELL: 'SELL',
  REFRESH: 'REFRESH',
  LOCK: 'LOCK',
  UPGRADE: 'UPGRADE',
  MOVE: 'MOVE',
  EQUIP: 'EQUIP',
  USE_SPELL: 'USE_SPELL',
  CONFIRM: 'CONFIRM',
} as const

// ===== 指令结构 =====

// 状态变更
export interface StateChange {
  path: string
  oldValue: unknown
  newValue: unknown
}

// 指令结果
export interface CommandResult {
  success: boolean
  errorCode?: string
  changes: StateChange[]
  newState?: Record<string, unknown>
}

// 指令
export interface Command {
  id: string
  playerId: string
  type: CommandType | string
  timestamp: number
  payload: CommandPayload
  result?: CommandResult
}

// ===== Payload 类型 =====

// 购买指令载荷
export interface BuyPayload {
  shopSlot: number
  type: 'follower' | 'equipment' | 'spell'
  targetPosition?: number
}

// 出售指令载荷
export interface SellPayload {
  source: 'hand' | 'battlefield'
  position: number
}

// 刷新指令载荷
export interface RefreshPayload {
  // 无额外参数
}

// 锁定指令载荷
export interface LockPayload {
  locked: boolean
}

// 升级指令载荷
export interface UpgradePayload {
  // 无额外参数
}

// 移动指令载荷
export interface MovePayload {
  from: {
    source: 'hand' | 'battlefield'
    position: number
  }
  to: {
    source: 'hand' | 'battlefield'
    position: number
  }
}

// 装备指令载荷
export interface EquipPayload {
  equipmentId: string
  followerPosition: number
}

// 使用咒术指令载荷
export interface UseSpellPayload {
  spellId: string
  targets?: string[]
}

// 确认就绪指令载荷
export interface ConfirmPayload {
  // 无额外参数
}

// Payload 联合类型
export type CommandPayload =
  | BuyPayload
  | SellPayload
  | RefreshPayload
  | LockPayload
  | UpgradePayload
  | MovePayload
  | EquipPayload
  | UseSpellPayload
  | ConfirmPayload

// ===== Zod Schemas =====

export const commandTypeSchema = z.enum([
  'BUY',
  'SELL',
  'REFRESH',
  'LOCK',
  'UPGRADE',
  'MOVE',
  'EQUIP',
  'USE_SPELL',
  'CONFIRM',
])

export const stateChangeSchema = z.object({
  path: z.string(),
  oldValue: z.unknown(),
  newValue: z.unknown(),
})

export const commandResultSchema = z.object({
  success: z.boolean(),
  errorCode: z.string().optional(),
  changes: z.array(stateChangeSchema),
  newState: z.record(z.unknown()).optional(),
})

export const buyPayloadSchema = z.object({
  shopSlot: z.number().int().nonnegative(),
  type: z.enum(['follower', 'equipment', 'spell']),
  targetPosition: z.number().int().nonnegative().optional(),
})

export const sellPayloadSchema = z.object({
  source: z.enum(['hand', 'battlefield']),
  position: z.number().int().nonnegative(),
})

export const refreshPayloadSchema = z.object({})

export const lockPayloadSchema = z.object({
  locked: z.boolean(),
})

export const upgradePayloadSchema = z.object({})

export const movePayloadSchema = z.object({
  from: z.object({
    source: z.enum(['hand', 'battlefield']),
    position: z.number().int().nonnegative(),
  }),
  to: z.object({
    source: z.enum(['hand', 'battlefield']),
    position: z.number().int().nonnegative(),
  }),
})

export const equipPayloadSchema = z.object({
  equipmentId: z.string(),
  followerPosition: z.number().int().nonnegative(),
})

export const useSpellPayloadSchema = z.object({
  spellId: z.string(),
  targets: z.array(z.string()).optional(),
})

export const confirmPayloadSchema = z.object({})

// Payload schema 联合类型（用于验证）
export const commandPayloadSchema = z.union([
  buyPayloadSchema,
  sellPayloadSchema,
  refreshPayloadSchema,
  lockPayloadSchema,
  upgradePayloadSchema,
  movePayloadSchema,
  equipPayloadSchema,
  useSpellPayloadSchema,
  confirmPayloadSchema,
])

export const commandSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  type: commandTypeSchema,
  timestamp: z.number().int().nonnegative(),
  payload: commandPayloadSchema,
  result: commandResultSchema.optional(),
})

// ===== Zod Schema 类型导出 =====

// 重命名以避免与顶层类型冲突
export type CommandTypeSchema = z.infer<typeof commandTypeSchema>
export type StateChangeSchema = z.infer<typeof stateChangeSchema>
export type CommandResultSchema = z.infer<typeof commandResultSchema>
export type CommandSchema = z.infer<typeof commandSchema>
export type BuyPayloadSchema = z.infer<typeof buyPayloadSchema>
export type SellPayloadSchema = z.infer<typeof sellPayloadSchema>
export type RefreshPayloadSchema = z.infer<typeof refreshPayloadSchema>
export type LockPayloadSchema = z.infer<typeof lockPayloadSchema>
export type UpgradePayloadSchema = z.infer<typeof upgradePayloadSchema>
export type MovePayloadSchema = z.infer<typeof movePayloadSchema>
export type EquipPayloadSchema = z.infer<typeof equipPayloadSchema>
export type UseSpellPayloadSchema = z.infer<typeof useSpellPayloadSchema>
export type ConfirmPayloadSchema = z.infer<typeof confirmPayloadSchema>
export type CommandPayloadSchema = z.infer<typeof commandPayloadSchema>
