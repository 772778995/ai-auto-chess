// packages/shared/src/types/follower.ts
import { z } from 'zod'
import { keywordSchema, type Keyword } from './keyword'

// 战场位置 (3x2 布局)
export interface BattlePosition {
  side: 'ally' | 'enemy'
  x: 0 | 1 | 2
  y: 0 | 1
}

// 随从模板
export interface Follower {
  id: string
  name: string
  description: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  attack: number
  health: number
  shield?: number
  keywords: Keyword[]
  equipmentSlots: number
  imageUrl: string
}

// 随从实例（战场上）
export interface FollowerInstance extends Follower {
  instanceId: string
  ownerId: string
  position: BattlePosition
  currentAttack: number
  currentHealth: number
  currentShield: number
  equipment: string[]  // 装备ID数组
  buffs: Buff[]
  debuffs: Debuff[]
}

// Buff/Debuff
export interface Buff {
  id: string
  keywordId: string
  stacks: number
  duration?: number
}

export interface Debuff {
  id: string
  keywordId: string
  stacks: number
  duration?: number
}

// Zod 模式
export const battlePositionSchema = z.object({
  side: z.enum(['ally', 'enemy']),
  x: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  y: z.union([z.literal(0), z.literal(1)])
})

export const followerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  attack: z.number(),
  health: z.number(),
  shield: z.number().optional(),
  keywords: z.array(keywordSchema),
  equipmentSlots: z.number(),
  imageUrl: z.string()
})

export const buffSchema = z.object({
  id: z.string(),
  keywordId: z.string(),
  stacks: z.number(),
  duration: z.number().optional()
})

export const debuffSchema = buffSchema

export const followerInstanceSchema = followerSchema.extend({
  instanceId: z.string(),
  ownerId: z.string(),
  position: battlePositionSchema,
  currentAttack: z.number(),
  currentHealth: z.number(),
  currentShield: z.number(),
  equipment: z.array(z.string()),
  buffs: z.array(buffSchema),
  debuffs: z.array(debuffSchema)
})

export type FollowerType = z.infer<typeof followerSchema>
export type FollowerInstanceType = z.infer<typeof followerInstanceSchema>
