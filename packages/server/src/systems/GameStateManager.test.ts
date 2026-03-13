// packages/server/src/systems/GameStateManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { GameStateManager } from './GameStateManager'
import { createMemoryRedisClient } from '../redis/memory-client'

describe('GameStateManager', () => {
  let manager: GameStateManager
  let redis: ReturnType<typeof createMemoryRedisClient>

  beforeEach(async () => {
    redis = createMemoryRedisClient()
    await redis.connect()
    manager = new GameStateManager(redis)
  })

  describe('Campaign Game', () => {
    it('should create campaign game state', async () => {
      const gameId = 'campaign-game-1'
      const state = await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 3,
        campaignProgressId: 'progress-1'
      })

      expect(state.id).toBe(gameId)
      expect(state.mode).toBe('campaign')
      expect(state.userId).toBe('user-1')
      expect(state.level).toBe(3)
      expect(state.campaignProgressId).toBe('progress-1')
      expect(state.currentRound).toBe(1)
      expect(state.phase).toBe('lobby')
      expect(state.turnTimer).toBe(0)
      expect(state.players).toEqual({})
    })

    it('should save and load campaign game', async () => {
      const gameId = 'campaign-game-2'
      await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 1,
        campaignProgressId: 'progress-1'
      })

      const loaded = await manager.getGame(gameId)
      expect(loaded).not.toBeNull()
      expect(loaded!.id).toBe(gameId)
      expect(loaded!.mode).toBe('campaign')
    })
  })

  describe('Multiplayer Game', () => {
    it('should create multiplayer game state', async () => {
      const gameId = 'multi-game-1'
      const state = await manager.createMultiplayerGame(gameId, {
        roomId: 'room-1',
        maxPlayers: 4
      })

      expect(state.id).toBe(gameId)
      expect(state.mode).toBe('multiplayer')
      expect(state.roomId).toBe('room-1')
      expect(state.maxPlayers).toBe(4)
      expect(state.currentRound).toBe(1)
      expect(state.phase).toBe('lobby')
    })

    it('should save and load multiplayer game', async () => {
      const gameId = 'multi-game-2'
      await manager.createMultiplayerGame(gameId, {
        roomId: 'room-1',
        maxPlayers: 8
      })

      const loaded = await manager.getGame(gameId)
      expect(loaded).not.toBeNull()
      expect(loaded!.id).toBe(gameId)
      expect(loaded!.mode).toBe('multiplayer')
    })
  })

  describe('Common Operations', () => {
    it('should add player to game', async () => {
      const gameId = 'test-game-3'
      await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 1,
        campaignProgressId: 'progress-1'
      })

      const playerId = 'player-1'
      await manager.addPlayer(gameId, {
        id: playerId,
        username: 'TestPlayer'
      })

      const state = await manager.getGame(gameId)
      expect(state!.players[playerId]).toBeDefined()
      expect(state!.players[playerId].id).toBe(playerId)
      expect(state!.players[playerId].username).toBe('TestPlayer')
      expect(state!.players[playerId].health).toBe(40)
      expect(state!.players[playerId].maxHealth).toBe(40)
      expect(state!.players[playerId].gold).toBe(6)
      expect(state!.players[playerId].shopLevel).toBe(1)
      expect(state!.players[playerId].shopExp).toBe(0)
      expect(state!.players[playerId].battlefield).toHaveLength(6)
      expect(state!.players[playerId].hand).toEqual([])
      expect(state!.players[playerId].shop).toHaveLength(6)
      expect(state!.players[playerId].shopLocked).toBe(false)
      expect(state!.players[playerId].isReady).toBe(false)
      expect(state!.players[playerId].isAlive).toBe(true)
    })

    it('should update player gold', async () => {
      const gameId = 'test-game-4'
      await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 1,
        campaignProgressId: 'progress-1'
      })

      const playerId = 'player-1'
      await manager.addPlayer(gameId, { id: playerId, username: 'Test' })

      const newGold = await manager.updatePlayerGold(gameId, playerId, -3)
      expect(newGold).toBe(3)

      const state = await manager.getGame(gameId)
      expect(state!.players[playerId].gold).toBe(3)
    })

    it('should update player health', async () => {
      const gameId = 'test-game-5'
      await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 1,
        campaignProgressId: 'progress-1'
      })

      const playerId = 'player-1'
      await manager.addPlayer(gameId, { id: playerId, username: 'Test' })

      const newHealth = await manager.updatePlayerHealth(gameId, playerId, -10)
      expect(newHealth).toBe(30)

      const state = await manager.getGame(gameId)
      expect(state!.players[playerId].health).toBe(30)
    })

    it('should transition phase', async () => {
      const gameId = 'test-game-6'
      await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 1,
        campaignProgressId: 'progress-1'
      })

      await manager.transitionPhase(gameId, 'recruit')

      const state = await manager.getGame(gameId)
      expect(state!.phase).toBe('recruit')
    })

    it('should update combat subPhase', async () => {
      const gameId = 'test-game-7'
      await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 1,
        campaignProgressId: 'progress-1'
      })

      await manager.transitionPhase(gameId, 'combat')
      await manager.updateSubPhase(gameId, 'dice_roll')

      const state = await manager.getGame(gameId)
      expect(state!.phase).toBe('combat')
      expect(state!.subPhase).toBe('dice_roll')
    })

    it('should delete game', async () => {
      const gameId = 'test-game-8'
      await manager.createCampaignGame(gameId, {
        userId: 'user-1',
        level: 1,
        campaignProgressId: 'progress-1'
      })

      await manager.deleteGame(gameId)

      const state = await manager.getGame(gameId)
      expect(state).toBeNull()
    })
  })
})
