// packages/server/src/systems/CommandExecutor.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { CommandExecutor } from './CommandExecutor'
import { GameStateManager, type PlayerState, type ShopSlot } from './GameStateManager'
import { createMemoryRedisClient } from '../redis/memory-client'
import type { Command, BuyPayload, SellPayload, MovePayload } from '@game/shared'

describe('CommandExecutor', () => {
  let executor: CommandExecutor
  let manager: GameStateManager
  let redis: ReturnType<typeof createMemoryRedisClient>

  const gameId = 'test-game-1'
  const playerId = 'player-1'

  beforeEach(async () => {
    redis = createMemoryRedisClient()
    await redis.connect()
    manager = new GameStateManager(redis)
    executor = new CommandExecutor(redis, manager)

    // 创建测试游戏和玩家
    await manager.createCampaignGame(gameId, {
      userId: 'user-1',
      level: 1,
      campaignProgressId: 'progress-1'
    })

    // 添加玩家，设置足够金币用于测试
    await manager.addPlayer(gameId, {
      id: playerId,
      username: 'TestPlayer',
      gold: 10
    })
  })

  describe('BUY command', () => {
    it('should validate and execute BUY command', async () => {
      // 设置商店槽位
      const shopSlot: ShopSlot = {
        type: 'follower',
        cardId: 'follower-001',
        isLocked: false,
        discount: 0
      }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.shop.0`, shopSlot)

      const command: Command = {
        id: 'cmd-001',
        playerId,
        type: 'BUY',
        timestamp: Date.now(),
        payload: {
          shopSlot: 0,
          type: 'follower',
          targetPosition: 0
        } as BuyPayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(true)
      expect(result.changes.length).toBeGreaterThan(0)
    })

    it('should reject BUY with insufficient gold', async () => {
      // 设置玩家金币不足
      await manager.updatePlayerGold(gameId, playerId, -10) // gold = 0

      const shopSlot: ShopSlot = {
        type: 'follower',
        cardId: 'follower-001',
        isLocked: false,
        discount: 0
      }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.shop.0`, shopSlot)

      const command: Command = {
        id: 'cmd-002',
        playerId,
        type: 'BUY',
        timestamp: Date.now(),
        payload: {
          shopSlot: 0,
          type: 'follower'
        } as BuyPayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('INSUFFICIENT_GOLD')
    })

    it('should reject BUY from empty slot', async () => {
      const command: Command = {
        id: 'cmd-003',
        playerId,
        type: 'BUY',
        timestamp: Date.now(),
        payload: {
          shopSlot: 0,
          type: 'follower'
        } as BuyPayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('EMPTY_SLOT')
    })
  })

  describe('SELL command', () => {
    it('should validate and execute SELL command from hand', async () => {
      // 设置手牌
      const follower = { id: 'follower-001', name: 'Test Follower' }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.hand.0`, follower)

      const command: Command = {
        id: 'cmd-004',
        playerId,
        type: 'SELL',
        timestamp: Date.now(),
        payload: {
          source: 'hand',
          position: 0
        } as SellPayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(true)
      // 卖出得1金币
      const goldChange = result.changes.find(c => c.path === 'gold')
      expect(goldChange).toBeDefined()
      expect(goldChange!.newValue).toBe(11) // 10 + 1
    })

    it('should validate and execute SELL command from battlefield', async () => {
      // 设置战场随从
      const follower = { id: 'follower-002', name: 'Battle Follower' }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.battlefield.0`, follower)

      const command: Command = {
        id: 'cmd-005',
        playerId,
        type: 'SELL',
        timestamp: Date.now(),
        payload: {
          source: 'battlefield',
          position: 0
        } as SellPayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(true)
    })

    it('should reject SELL from empty position', async () => {
      const command: Command = {
        id: 'cmd-006',
        playerId,
        type: 'SELL',
        timestamp: Date.now(),
        payload: {
          source: 'hand',
          position: 0
        } as SellPayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('NO_FOLLOWER_AT_POSITION')
    })
  })

  describe('MOVE command', () => {
    it('should validate and execute MOVE command from hand to battlefield', async () => {
      // 设置手牌
      const follower = { id: 'follower-003', name: 'Move Follower' }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.hand.0`, follower)

      const command: Command = {
        id: 'cmd-007',
        playerId,
        type: 'MOVE',
        timestamp: Date.now(),
        payload: {
          from: { source: 'hand', position: 0 },
          to: { source: 'battlefield', position: 0 }
        } as MovePayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(true)
    })

    it('should reject MOVE from empty source', async () => {
      const command: Command = {
        id: 'cmd-008',
        playerId,
        type: 'MOVE',
        timestamp: Date.now(),
        payload: {
          from: { source: 'hand', position: 0 },
          to: { source: 'battlefield', position: 0 }
        } as MovePayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('NO_FOLLOWER_AT_SOURCE')
    })

    it('should reject MOVE to occupied battlefield position', async () => {
      // 设置手牌
      const follower = { id: 'follower-004', name: 'Hand Follower' }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.hand.0`, follower)

      // 设置战场目标位置已有随从
      const battlefieldFollower = { id: 'follower-005', name: 'Battlefield Follower' }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.battlefield.0`, battlefieldFollower)

      const command: Command = {
        id: 'cmd-009',
        playerId,
        type: 'MOVE',
        timestamp: Date.now(),
        payload: {
          from: { source: 'hand', position: 0 },
          to: { source: 'battlefield', position: 0 }
        } as MovePayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('TARGET_OCCUPIED')
    })
  })

  describe('Invalid commands', () => {
    it('should reject invalid commands with error code', async () => {
      const command: Command = {
        id: 'cmd-010',
        playerId: 'non-existent-player',
        type: 'BUY',
        timestamp: Date.now(),
        payload: {
          shopSlot: 0,
          type: 'follower'
        } as BuyPayload
      }

      const result = await executor.execute(gameId, command)

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('PLAYER_NOT_FOUND')
    })
  })

  describe('Command recording', () => {
    it('should record command to Redis Stream', async () => {
      // 设置商店槽位
      const shopSlot: ShopSlot = {
        type: 'follower',
        cardId: 'follower-001',
        isLocked: false,
        discount: 0
      }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.shop.0`, shopSlot)

      const command: Command = {
        id: 'cmd-011',
        playerId,
        type: 'BUY',
        timestamp: Date.now(),
        payload: {
          shopSlot: 0,
          type: 'follower'
        } as BuyPayload
      }

      await executor.execute(gameId, command)

      // 检查 Redis Stream 是否记录了指令
      const streamKey = `game:${gameId}:commands`
      const commands = await redis.xrange(streamKey, '-', '+')
      expect(commands.length).toBe(1)
    })
  })

  describe('Version management', () => {
    it('should increment game state version after execution', async () => {
      // 设置商店槽位
      const shopSlot: ShopSlot = {
        type: 'follower',
        cardId: 'follower-001',
        isLocked: false,
        discount: 0
      }
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.shop.0`, shopSlot)

      // 获取初始版本号
      const initialState = await manager.getGame(gameId)
      const initialVersion = (initialState as any)?.version ?? 0

      const command: Command = {
        id: 'cmd-012',
        playerId,
        type: 'BUY',
        timestamp: Date.now(),
        payload: {
          shopSlot: 0,
          type: 'follower'
        } as BuyPayload
      }

      await executor.execute(gameId, command)

      // 检查版本号是否增加
      const finalState = await manager.getGame(gameId)
      const finalVersion = (finalState as any)?.version ?? 0
      expect(finalVersion).toBe(initialVersion + 1)
    })
  })
})
