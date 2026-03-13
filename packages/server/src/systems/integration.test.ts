// packages/server/src/systems/integration.test.ts
// 集成测试：验证完整流程

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createMemoryRedisClient } from '../redis/memory-client'
import { GameStateManager } from './GameStateManager'
import { CommandExecutor } from './CommandExecutor'
import { BattleRecorder } from './BattleRecorder'
import { DeltaSyncManager } from './DeltaSyncManager'
import type { BuyCommand, SellCommand } from '@game/shared'

describe('Integration: Battle Record System', () => {
  let redis: ReturnType<typeof createRedisClient>
  let stateManager: GameStateManager
  let commandExecutor: CommandExecutor
  let battleRecorder: BattleRecorder
  let deltaSyncManager: DeltaSyncManager

  beforeEach(async () => {
    redis = createMemoryRedisClient()
    await redis.connect()
    stateManager = new GameStateManager(redis)
    commandExecutor = new CommandExecutor(redis, stateManager)
    battleRecorder = new BattleRecorder(redis)
    deltaSyncManager = new DeltaSyncManager(redis, {
      getState: (id) => stateManager.getGame(id),
      incrementVersion: async (id) => {
        const state = await stateManager.getGame(id)
        const currentVersion = state?.version ?? 0
        await redis.json.set(`game:${id}`, '.version', currentVersion + 1)
        return currentVersion + 1
      },
      updateByPath: async (id, path, value) => {
        await redis.json.set(`game:${id}`, path, value)
      }
    })
  })

  afterEach(async () => {
    await redis.disconnect()
  })

  it('should execute command and sync delta to client', async () => {
    const gameId = 'test-integration-1'
    const playerId = 'player-1'

    // 1. 创建游戏
    await stateManager.createMultiplayerGame(gameId, {
      roomId: 'room-1',
      maxPlayers: 8
    })

    // 2. 添加玩家
    await stateManager.addPlayer(gameId, {
      id: playerId,
      username: 'TestPlayer',
      gold: 10
    })

    // 设置商店
    await redis.json.set(`game:${gameId}`, `.players.${playerId}.shop`, [
      { type: 'follower', cardId: 'follower-001', isLocked: false, discount: 0 },
      null, null, null, null, null
    ])

    // 3. 注册客户端版本
    deltaSyncManager.registerClient(playerId, 0)

    // 4. 执行购买指令
    const buyCommand: BuyCommand = {
      id: 'cmd-buy-1',
      playerId,
      type: 'BUY',
      timestamp: Date.now(),
      payload: {
        shopSlot: 0,
        cost: 3
      }
    }

    const result = await commandExecutor.execute(gameId, buyCommand)

    // 5. 验证指令执行成功
    expect(result.success).toBe(true)

    // 6. 验证版本号增加
    const state = await stateManager.getGame(gameId)
    expect(state?.version).toBe(1)

    // 7. 验证金币减少
    const gold = await redis.json.get(`game:${gameId}`, `.players.${playerId}.gold`)
    expect(gold).toBe(7)
  })

  it('should record battle events and allow replay', async () => {
    const battleId = 'battle-integration-1'

    // 1. 创建战斗快照
    await battleRecorder.createSnapshot(battleId, {
      battleId,
      round: 1,
      playerIds: ['player-1', 'player-2'],
      firstAttackerId: 'player-1',
      allies: [],
      enemies: [],
      timestamp: Date.now()
    })

    // 2. 记录多个战斗事件
    await battleRecorder.recordEvent(battleId, {
      timestamp: Date.now(),
      type: 'dice_roll',
      payload: {
        playerId: 'player-1',
        diceValue: 5,
        modifier: 2,
        finalValue: 7
      }
    })

    await battleRecorder.recordEvent(battleId, {
      timestamp: Date.now(),
      type: 'follower_attack',
      payload: {
        attackerId: 'follower-1',
        targetId: 'follower-2',
        damage: 3,
        isCritical: false,
        animation: {
          type: 'attack',
          fromPosition: { x: 0, y: 0 },
          toPosition: { x: 0, y: 1 },
          duration: 500
        }
      }
    })

    await battleRecorder.recordEvent(battleId, {
      timestamp: Date.now(),
      type: 'battle_end',
      payload: {
        winnerId: 'player-1',
        loserId: 'player-2',
        damageDealt: 5,
        totalRounds: 3
      }
    })

    // 3. 获取所有事件进行回放
    const events = await battleRecorder.getEvents(battleId)
    expect(events).toHaveLength(3)

    // 4. 验证事件顺序
    expect(events[0].type).toBe('dice_roll')
    expect(events[1].type).toBe('follower_attack')
    expect(events[2].type).toBe('battle_end')

    // 5. 验证快照
    const snapshot = await battleRecorder.getSnapshot(battleId)
    expect(snapshot?.firstAttackerId).toBe('player-1')
  })

  it('should handle version mismatch with full sync', async () => {
    const gameId = 'test-version-mismatch'
    const playerId = 'player-1'

    // 1. 创建游戏
    await stateManager.createMultiplayerGame(gameId, {
      roomId: 'room-1',
      maxPlayers: 8
    })

    // 2. 注册客户端版本为 0
    deltaSyncManager.registerClient(playerId, 0)

    // 3. 模拟版本落后（服务器已经到了版本 10）
    await redis.json.set(`game:${gameId}`, '.version', 10)

    // 4. 检查是否需要全量同步
    const needsFullSync = deltaSyncManager.needsFullSync(playerId, 10, 5)
    expect(needsFullSync).toBe(true)

    // 5. 获取全量状态
    const fullState = await deltaSyncManager.getFullState(gameId)
    expect(fullState.version).toBe(10)
    expect(fullState.state).not.toBeNull()

    // 6. 更新客户端版本
    deltaSyncManager.updateClientVersion(playerId, 10)

    // 7. 验证版本连续性检查
    const isContinuous = deltaSyncManager.isVersionContinuous(playerId, 11)
    expect(isContinuous).toBe(true)
  })

  it('should complete full recruit -> combat -> settlement cycle', async () => {
    const gameId = 'test-full-cycle'
    const playerId = 'player-1'

    // ===== 第一阶段：创建游戏和玩家 =====
    await stateManager.createMultiplayerGame(gameId, {
      roomId: 'room-1',
      maxPlayers: 8
    })

    await stateManager.addPlayer(gameId, {
      id: playerId,
      username: 'TestPlayer',
      gold: 10,
      health: 40
    })

    // 设置商店
    await redis.json.set(`game:${gameId}`, `.players.${playerId}.shop`, [
      { type: 'follower', cardId: 'follower-001', isLocked: false, discount: 0 },
      { type: 'follower', cardId: 'follower-002', isLocked: false, discount: 0 },
      null, null, null, null
    ])

    // 初始版本号
    const initialState = await stateManager.getGame(gameId)
    expect(initialState?.version).toBe(0)

    // ===== 第二阶段：招募阶段 =====
    // 购买随从 1
    const buyCommand1: BuyCommand = {
      id: 'cmd-buy-1',
      playerId,
      type: 'BUY',
      timestamp: Date.now(),
      payload: { shopSlot: 0, cost: 3 }
    }
    const result1 = await commandExecutor.execute(gameId, buyCommand1)
    expect(result1.success).toBe(true)

    // 购买随从 2
    const buyCommand2: BuyCommand = {
      id: 'cmd-buy-2',
      playerId,
      type: 'BUY',
      timestamp: Date.now(),
      payload: { shopSlot: 1, cost: 3 }
    }
    const result2 = await commandExecutor.execute(gameId, buyCommand2)
    expect(result2.success).toBe(true)

    // 验证金币
    const goldAfterBuy = await redis.json.get(`game:${gameId}`, `.players.${playerId}.gold`)
    expect(goldAfterBuy).toBe(4)

    // 验证版本号
    const stateAfterRecruit = await stateManager.getGame(gameId)
    expect(stateAfterRecruit?.version).toBe(2)

    // ===== 第三阶段：战斗阶段 =====
    await stateManager.transitionPhase(gameId, 'combat')

    // 创建战斗记录
    const battleId = `battle-${gameId}-1`
    await battleRecorder.createSnapshot(battleId, {
      battleId,
      round: 1,
      playerIds: [playerId, 'enemy-1'],
      firstAttackerId: playerId,
      allies: [],
      enemies: [],
      timestamp: Date.now()
    })

    // 记录战斗事件
    await battleRecorder.recordEvent(battleId, {
      timestamp: Date.now(),
      type: 'battle_end',
      payload: {
        winnerId: playerId,
        loserId: 'enemy-1',
        damageDealt: 5,
        totalRounds: 3
      }
    })

    // ===== 第四阶段：结算阶段 =====
    await stateManager.transitionPhase(gameId, 'settlement')

    // 添加敌人玩家以便更新血量
    await stateManager.addPlayer(gameId, {
      id: 'enemy-1',
      username: 'EnemyPlayer',
      health: 40
    })

    // 造成伤害给对手
    await stateManager.updatePlayerHealth(gameId, 'enemy-1', -5)

    // 验证战斗记录可回放
    const battleEvents = await battleRecorder.getEvents(battleId)
    expect(battleEvents).toHaveLength(1)
    expect(battleEvents[0].type).toBe('battle_end')

    // 验证最终状态
    const finalState = await stateManager.getGame(gameId)
    expect(finalState?.phase).toBe('settlement')
    expect(finalState?.version).toBeGreaterThanOrEqual(2)
  })

  it('should handle command rejection gracefully', async () => {
    const gameId = 'test-command-reject'
    const playerId = 'player-1'

    // 创建游戏，金币不足
    await stateManager.createMultiplayerGame(gameId, {
      roomId: 'room-1',
      maxPlayers: 8
    })

    await stateManager.addPlayer(gameId, {
      id: playerId,
      username: 'TestPlayer',
      gold: 1  // 只有 1 金币
    })

    await redis.json.set(`game:${gameId}`, `.players.${playerId}.shop`, [
      { type: 'follower', cardId: 'follower-001', isLocked: false, discount: 0 },
      null, null, null, null, null
    ])

    // 尝试购买（需要 3 金币）
    const buyCommand: BuyCommand = {
      id: 'cmd-buy-fail',
      playerId,
      type: 'BUY',
      timestamp: Date.now(),
      payload: { shopSlot: 0, cost: 3 }
    }

    const result = await commandExecutor.execute(gameId, buyCommand)

    // 验证指令被拒绝
    expect(result.success).toBe(false)
    expect(result.errorCode).toBe('INSUFFICIENT_GOLD')

    // 验证版本号未增加
    const state = await stateManager.getGame(gameId)
    expect(state?.version).toBe(0)

    // 验证金币未变化
    const gold = await redis.json.get(`game:${gameId}`, `.players.${playerId}.gold`)
    expect(gold).toBe(1)
  })
})
