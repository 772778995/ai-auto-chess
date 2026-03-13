import { describe, it, expect } from 'vitest'
import {
  battleEventSchema,
  battleSnapshotSchema,
  type BattleEvent,
  type BattleEventType,
  type EventPayload,
  type DiceRollPayload,
  type FirstAttackerPayload,
  type FollowerSpawnPayload,
  type FollowerMovePayload,
  type FollowerAttackPayload,
  type FollowerTakeDamagePayload,
  type FollowerDiePayload,
  type FollowerRetreatPayload,
  type KeywordTriggerPayload,
  type StatusEffectAddPayload,
  type StatusEffectRemovePayload,
  type BattleEndPayload,
  type BattleSnapshot,
  type BattlePlayerSnapshot
} from './battle'

describe('BattleEvent types', () => {
  it('should define all BattleEventType values', () => {
    const eventTypes: BattleEventType[] = [
      'dice_roll',
      'first_attacker',
      'follower_spawn',
      'follower_move',
      'follower_attack',
      'follower_take_damage',
      'follower_die',
      'follower_retreat',
      'keyword_trigger',
      'status_effect_add',
      'status_effect_remove',
      'battle_end'
    ]
    
    expect(eventTypes).toHaveLength(12)
  })

  it('should validate BattleSnapshot structure', () => {
    const snapshot: BattleSnapshot = {
      timestamp: 1000,
      randomSeed: 'abc123',
      playerA: {
        playerId: 'player-a',
        battlefield: [],
        heroId: 'hero-001',
        health: 20
      },
      playerB: {
        playerId: 'player-b',
        battlefield: [],
        health: 15
      }
    }

    const result = battleSnapshotSchema.safeParse(snapshot)
    expect(result.success).toBe(true)
  })

  it('should validate FollowerAttackPayload with animation', () => {
    const payload: FollowerAttackPayload = {
      attackerId: 'follower-001',
      targetId: 'follower-002',
      damage: 5,
      isCritical: false,
      triggeredKeywords: ['poison'],
      animation: {
        type: 'melee',
        effectId: 'slash-001',
        duration: 500
      }
    }

    const event: BattleEvent = {
      timestamp: 100,
      type: 'follower_attack',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate FollowerMovePayload with animation', () => {
    const payload: FollowerMovePayload = {
      followerId: 'follower-001',
      fromPosition: 0,
      toPosition: 3,
      reason: 'attack',
      animation: {
        type: 'run',
        duration: 300,
        easing: 'ease-out'
      }
    }

    const event: BattleEvent = {
      timestamp: 50,
      type: 'follower_move',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate BattleEndPayload', () => {
    const payload: BattleEndPayload = {
      winnerId: 'player-a',
      loserHealth: 0,
      damage: 5,
      rounds: 6,
      mvpFollowerId: 'follower-001'
    }

    const event: BattleEvent = {
      timestamp: 5000,
      type: 'battle_end',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate DiceRollPayload', () => {
    const payload: DiceRollPayload = {
      playerA: {
        playerId: 'player-a',
        roll: 5,
        modifier: 2,
        finalValue: 7
      },
      playerB: {
        playerId: 'player-b',
        roll: 3,
        modifier: 1,
        finalValue: 4
      }
    }

    const event: BattleEvent = {
      timestamp: 0,
      type: 'dice_roll',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate FollowerTakeDamagePayload with animation', () => {
    const payload: FollowerTakeDamagePayload = {
      followerId: 'follower-002',
      damage: 5,
      remainingHealth: 3,
      shieldAbsorbed: 0,
      animation: {
        type: 'hit',
        shakeIntensity: 0.5,
        duration: 200
      }
    }

    const event: BattleEvent = {
      timestamp: 150,
      type: 'follower_take_damage',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate FollowerDiePayload with animation', () => {
    const payload: FollowerDiePayload = {
      followerId: 'follower-002',
      position: 3,
      animation: {
        type: 'fade',
        duration: 500,
        delay: 100
      }
    }

    const event: BattleEvent = {
      timestamp: 200,
      type: 'follower_die',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate KeywordTriggerPayload with animation', () => {
    const payload: KeywordTriggerPayload = {
      keywordId: 'poison',
      sourceId: 'follower-001',
      targetIds: ['follower-002'],
      effectDescription: 'Deals 2 damage',
      animation: {
        type: 'glow',
        color: '#00ff00',
        duration: 300
      }
    }

    const event: BattleEvent = {
      timestamp: 160,
      type: 'keyword_trigger',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate StatusEffectAddPayload', () => {
    const payload: StatusEffectAddPayload = {
      followerId: 'follower-001',
      statusId: 'shield',
      statusName: 'Shield',
      duration: 3,
      animation: {
        type: 'buff',
        icon: 'shield-icon'
      }
    }

    const event: BattleEvent = {
      timestamp: 100,
      type: 'status_effect_add',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate StatusEffectRemovePayload', () => {
    const payload: StatusEffectRemovePayload = {
      followerId: 'follower-001',
      statusId: 'shield',
      reason: 'expired'
    }

    const event: BattleEvent = {
      timestamp: 300,
      type: 'status_effect_remove',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate FirstAttackerPayload', () => {
    const payload: FirstAttackerPayload = {
      firstAttackerId: 'player-a',
      reason: 'dice_win'
    }

    const event: BattleEvent = {
      timestamp: 10,
      type: 'first_attacker',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate FollowerSpawnPayload', () => {
    const payload: FollowerSpawnPayload = {
      followerId: 'follower-003',
      position: 2,
      from: 'effect'
    }

    const event: BattleEvent = {
      timestamp: 50,
      type: 'follower_spawn',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate FollowerRetreatPayload', () => {
    const payload: FollowerRetreatPayload = {
      followerId: 'follower-001',
      toPosition: 0,
      animation: {
        type: 'run_back',
        duration: 300
      }
    }

    const event: BattleEvent = {
      timestamp: 180,
      type: 'follower_retreat',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })

  it('should validate draw battle end (winnerId is null)', () => {
    const payload: BattleEndPayload = {
      winnerId: null,
      loserHealth: 0,
      damage: 0,
      rounds: 10
    }

    const event: BattleEvent = {
      timestamp: 10000,
      type: 'battle_end',
      payload
    }

    const result = battleEventSchema.safeParse(event)
    expect(result.success).toBe(true)
  })
})
