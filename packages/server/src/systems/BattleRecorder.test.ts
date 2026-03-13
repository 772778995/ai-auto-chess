// packages/server/src/systems/BattleRecorder.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { BattleRecorder } from './BattleRecorder'
import { createMemoryRedisClient } from '../redis/memory-client'
import type { BattleEvent, BattleSnapshot } from '@game/shared'

describe('BattleRecorder', () => {
  let recorder: BattleRecorder
  let redis: ReturnType<typeof createMemoryRedisClient>

  beforeEach(() => {
    redis = createMemoryRedisClient()
    recorder = new BattleRecorder(redis as unknown as BattleRecorder['redis'])
  })

  it('should create battle snapshot', async () => {
    const battleId = 'test-battle-1'
    const snapshot: BattleSnapshot = {
      timestamp: Date.now(),
      randomSeed: 'seed-12345',
      playerA: {
        playerId: 'player-1',
        battlefield: [],
        health: 40,
      },
      playerB: {
        playerId: 'player-2',
        battlefield: [],
        health: 40,
      },
    }

    await recorder.createSnapshot(battleId, snapshot)

    const result = await recorder.getSnapshot(battleId)
    expect(result).not.toBeNull()
    expect(result!.timestamp).toBe(snapshot.timestamp)
    expect(result!.randomSeed).toBe(snapshot.randomSeed)
    expect(result!.playerA.playerId).toBe('player-1')
    expect(result!.playerB.playerId).toBe('player-2')
  })

  it('should record battle event to Redis List', async () => {
    const battleId = 'test-battle-1'
    const event: BattleEvent = {
      timestamp: 100,
      type: 'dice_roll',
      payload: {
        playerA: {
          playerId: 'player-1',
          roll: 5,
          modifier: 2,
          finalValue: 7,
        },
        playerB: {
          playerId: 'player-2',
          roll: 3,
          modifier: 1,
          finalValue: 4,
        },
      },
    }

    await recorder.recordEvent(battleId, event)

    const count = await recorder.getEventCount(battleId)
    expect(count).toBe(1)
  })

  it('should record multiple events in order', async () => {
    const battleId = 'test-battle-1'
    const events: BattleEvent[] = [
      {
        timestamp: 100,
        type: 'dice_roll',
        payload: {
          playerA: { playerId: 'player-1', roll: 5, modifier: 0, finalValue: 5 },
          playerB: { playerId: 'player-2', roll: 3, modifier: 0, finalValue: 3 },
        },
      },
      {
        timestamp: 200,
        type: 'first_attacker',
        payload: {
          firstAttackerId: 'player-1',
          reason: 'dice_win',
        },
      },
      {
        timestamp: 300,
        type: 'follower_spawn',
        payload: {
          followerId: 'follower-1',
          position: 0,
          from: 'hand',
        },
      },
    ]

    await recorder.recordEvents(battleId, events)

    const result = await recorder.getEvents(battleId)
    expect(result.length).toBe(3)
    // 验证事件顺序
    expect(result[0].timestamp).toBe(100)
    expect(result[0].type).toBe('dice_roll')
    expect(result[1].timestamp).toBe(200)
    expect(result[1].type).toBe('first_attacker')
    expect(result[2].timestamp).toBe(300)
    expect(result[2].type).toBe('follower_spawn')
  })

  it('should get all events for a battle', async () => {
    const battleId = 'test-battle-1'
    const event1: BattleEvent = {
      timestamp: 100,
      type: 'follower_attack',
      payload: {
        attackerId: 'follower-1',
        targetId: 'follower-2',
        damage: 3,
        isCritical: false,
        triggeredKeywords: [],
        animation: { type: 'melee', duration: 500 },
      },
    }
    const event2: BattleEvent = {
      timestamp: 200,
      type: 'follower_take_damage',
      payload: {
        followerId: 'follower-2',
        damage: 3,
        remainingHealth: 2,
        shieldAbsorbed: 0,
        animation: { type: 'hit', shakeIntensity: 1, duration: 300 },
      },
    }

    await recorder.recordEvent(battleId, event1)
    await recorder.recordEvent(battleId, event2)

    const result = await recorder.getEvents(battleId)
    expect(result.length).toBe(2)
    expect(result[0].type).toBe('follower_attack')
    expect(result[1].type).toBe('follower_take_damage')
  })

  it('should use msgpackr for serialization', async () => {
    const battleId = 'test-battle-1'
    const event: BattleEvent = {
      timestamp: 100,
      type: 'battle_end',
      payload: {
        winnerId: 'player-1',
        loserHealth: 0,
        damage: 5,
        rounds: 3,
      },
    }

    await recorder.recordEvent(battleId, event)

    // 获取原始数据验证是 base64 编码的 msgpackr
    const raw = await (redis as any).lrange(`battle:events:${battleId}`, 0, -1)
    expect(raw.length).toBe(1)
    // base64 编码的字符串
    expect(typeof raw[0]).toBe('string')
    // 验证能正确反序列化
    const result = await recorder.getEvents(battleId)
    expect(result[0].type).toBe('battle_end')
  })

  it('should return empty array for non-existent battle', async () => {
    const result = await recorder.getEvents('non-existent-battle')
    expect(result).toEqual([])
  })

  it('should return null for non-existent snapshot', async () => {
    const result = await recorder.getSnapshot('non-existent-battle')
    expect(result).toBeNull()
  })

  it('should clear battle data', async () => {
    const battleId = 'test-battle-1'
    
    // 创建快照和事件
    await recorder.createSnapshot(battleId, {
      timestamp: Date.now(),
      randomSeed: 'seed-123',
      playerA: { playerId: 'p1', battlefield: [], health: 40 },
      playerB: { playerId: 'p2', battlefield: [], health: 40 },
    })
    await recorder.recordEvent(battleId, {
      timestamp: 100,
      type: 'dice_roll',
      payload: {
        playerA: { playerId: 'p1', roll: 5, modifier: 0, finalValue: 5 },
        playerB: { playerId: 'p2', roll: 3, modifier: 0, finalValue: 3 },
      },
    })

    // 清除数据
    await recorder.clearBattle(battleId)

    // 验证已清除
    const snapshot = await recorder.getSnapshot(battleId)
    const events = await recorder.getEvents(battleId)
    expect(snapshot).toBeNull()
    expect(events).toEqual([])
  })
})
