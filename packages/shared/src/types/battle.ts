// packages/shared/src/types/battle.ts
import { z } from 'zod'

// ===== 战斗事件类型 =====

export type BattleEventType =
  | 'dice_roll'              // 拼点
  | 'first_attacker'         // 先手确定
  | 'follower_spawn'         // 随从入场
  | 'follower_move'          // 移动（攻击前）
  | 'follower_attack'        // 攻击动画
  | 'follower_take_damage'   // 受伤动画
  | 'follower_die'           // 死亡动画
  | 'follower_retreat'       // 撤退（返回原位）
  | 'keyword_trigger'        // 词条触发
  | 'status_effect_add'      // 状态添加
  | 'status_effect_remove'   // 状态移除
  | 'battle_end'             // 战斗结束

// ===== Payload 定义 =====

export interface DiceRollPayload {
  playerA: {
    playerId: string
    roll: number
    modifier: number
    finalValue: number
  }
  playerB: {
    playerId: string
    roll: number
    modifier: number
    finalValue: number
  }
}

export interface FirstAttackerPayload {
  firstAttackerId: string
  reason: 'dice_win' | 'keyword_effect' | 'random'
}

export interface FollowerSpawnPayload {
  followerId: string
  position: number
  from: 'hand' | 'shop' | 'effect'
}

export interface FollowerMovePayload {
  followerId: string
  fromPosition: number
  toPosition: number
  reason: 'attack' | 'ability' | 'reposition'
  animation: {
    type: 'run' | 'fly' | 'teleport'
    duration: number
    easing: string
  }
}

export interface FollowerAttackPayload {
  attackerId: string
  targetId: string
  damage: number
  isCritical: boolean
  triggeredKeywords: string[]
  animation: {
    type: 'melee' | 'ranged' | 'magic'
    effectId?: string
    duration: number
  }
}

export interface FollowerTakeDamagePayload {
  followerId: string
  damage: number
  remainingHealth: number
  shieldAbsorbed: number
  animation: {
    type: 'hit' | 'block' | 'immune'
    shakeIntensity: number
    duration: number
  }
}

export interface FollowerDiePayload {
  followerId: string
  position: number
  animation: {
    type: 'fade' | 'explode' | 'dissolve'
    duration: number
    delay?: number
  }
}

export interface FollowerRetreatPayload {
  followerId: string
  toPosition: number
  animation: {
    type: 'run_back' | 'jump_back'
    duration: number
  }
}

export interface KeywordTriggerPayload {
  keywordId: string
  sourceId: string
  targetIds: string[]
  effectDescription: string
  animation: {
    type: 'glow' | 'pulse' | 'aura'
    color: string
    duration: number
  }
}

export interface StatusEffectAddPayload {
  followerId: string
  statusId: string
  statusName: string
  duration: number
  animation: {
    type: 'buff' | 'debuff'
    icon: string
  }
}

export interface StatusEffectRemovePayload {
  followerId: string
  statusId: string
  reason: 'expired' | 'cleansed' | 'overwritten'
}

export interface BattleEndPayload {
  winnerId: string | null
  loserHealth: number
  damage: number
  rounds: number
  mvpFollowerId?: string
}

// ===== Payload 联合类型 =====

export type EventPayload =
  | DiceRollPayload
  | FirstAttackerPayload
  | FollowerSpawnPayload
  | FollowerMovePayload
  | FollowerAttackPayload
  | FollowerTakeDamagePayload
  | FollowerDiePayload
  | FollowerRetreatPayload
  | KeywordTriggerPayload
  | StatusEffectAddPayload
  | StatusEffectRemovePayload
  | BattleEndPayload

// ===== 战斗事件 =====

export interface BattleEvent {
  timestamp: number          // 相对战斗开始的毫秒
  type: BattleEventType
  payload: EventPayload
}

// ===== 战斗快照 =====

export interface BattlePlayerSnapshot {
  playerId: string
  battlefield: unknown[]  // FollowerInstance[] 简化
  heroId?: string
  health: number
}

export interface BattleSnapshot {
  timestamp: number
  randomSeed: string
  playerA: BattlePlayerSnapshot
  playerB: BattlePlayerSnapshot
}

// ===== Zod Schemas =====

export const battleEventSchema = z.object({
  timestamp: z.number(),
  type: z.enum([
    'dice_roll', 'first_attacker', 'follower_spawn',
    'follower_move', 'follower_attack', 'follower_take_damage',
    'follower_die', 'follower_retreat', 'keyword_trigger',
    'status_effect_add', 'status_effect_remove', 'battle_end'
  ]),
  payload: z.record(z.unknown())
})

export const battleSnapshotSchema = z.object({
  timestamp: z.number(),
  randomSeed: z.string(),
  playerA: z.object({
    playerId: z.string(),
    battlefield: z.array(z.unknown()),
    heroId: z.string().optional(),
    health: z.number()
  }),
  playerB: z.object({
    playerId: z.string(),
    battlefield: z.array(z.unknown()),
    heroId: z.string().optional(),
    health: z.number()
  })
})

// ===== 类型导出 =====

export type BattleEventTypeType = z.infer<typeof battleEventSchema>['type']
export type BattleSnapshotType = z.infer<typeof battleSnapshotSchema>
