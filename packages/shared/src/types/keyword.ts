// packages/shared/src/types/keyword.ts

// 触发时机
export enum TriggerTiming {
  ON_ENTER = 'on_enter',           // 入场时
  ON_ATTACK = 'on_attack',         // 攻击时
  ON_HIT = 'on_hit',               // 命中时
  ON_DAMAGE = 'on_damage',         // 受到伤害时
  ON_KILL = 'on_kill',             // 击杀时
  ON_DEATH = 'on_death',           // 死亡时（遗言）
  ON_FIRST_STRIKE = 'on_first_strike', // 先手时
  ON_GROWTH = 'on_growth',         // 成长时
  ON_ROUND_START = 'on_round_start',   // 回合开始时
  ON_ROUND_END = 'on_round_end',       // 回合结束时
  AURA = 'aura'                   // 光环效果
}

// 效果类型
export enum EffectType {
  DAMAGE = 'damage',
  HEAL = 'heal',
  SHIELD = 'shield',
  BUFF_ATTACK = 'buff_attack',
  BUFF_HEALTH = 'buff_health',
  SUMMON = 'summon',
  ATTACH = 'attach',
  KILL = 'kill',
  REMOVE_KEYWORD = 'remove_keyword',
  ADD_KEYWORD = 'add_keyword'
}

// 目标选择
export enum TargetType {
  SELF = 'self',
  ATTACKER = 'attacker',
  TARGET = 'target',
  ALL_ALLIES = 'all_allies',
  ALL_ENEMIES = 'all_enemies',
  RANDOM_ALLY = 'random_ally',
  RANDOM_ENEMY = 'random_enemy',
  FRONT_ROW = 'front_row',
  BACK_ROW = 'back_row'
}

// 条件类型
export type ConditionType = 'health_below' | 'has_keyword' | 'position' | 'probability'

export interface Condition {
  type: ConditionType
  value: unknown
}

// 效果定义
export interface EffectDefinition {
  type: EffectType
  value?: number | string
  target: TargetType
  condition?: Condition
  duration?: number
}

// 关键词/词条
export interface Keyword {
  id: string
  name: string
  description: string
  trigger?: TriggerTiming
  effect: EffectDefinition
  stacks?: boolean
  visible: boolean
}

// Zod 模式
import { z } from 'zod'

export const triggerTimingSchema = z.nativeEnum(TriggerTiming)
export const effectTypeSchema = z.nativeEnum(EffectType)
export const targetTypeSchema = z.nativeEnum(TargetType)

export const conditionSchema = z.object({
  type: z.string(),
  value: z.any()
})

export const effectDefinitionSchema = z.object({
  type: effectTypeSchema,
  value: z.union([z.number(), z.string()]).optional(),
  target: targetTypeSchema,
  condition: conditionSchema.optional(),
  duration: z.number().optional()
})

export const keywordSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  trigger: triggerTimingSchema.optional(),
  effect: effectDefinitionSchema,
  stacks: z.boolean().optional(),
  visible: z.boolean()
})

export type KeywordType = z.infer<typeof keywordSchema>
