// packages/server/src/systems/DeltaSyncManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { diff, patch } from 'jsondiffpatch'
import { DeltaSyncManager, type StateDelta, type ClientVersion } from './DeltaSyncManager'
import type { GameState } from './GameStateManager'

// Mock Redis 客户端
function createMockRedis() {
  const store = new Map<string, unknown>()
  return {
    store,
    json: {
      set: async (key: string, path: string, value: unknown) => {
        if (path === '.') {
          store.set(key, value)
        } else {
          const existing = store.get(key) as Record<string, unknown>
          if (existing) {
            const keys = path.slice(1).split('.')
            let current = existing
            for (let i = 0; i < keys.length - 1; i++) {
              current = current[keys[i]] as Record<string, unknown>
            }
            current[keys[keys.length - 1]] = value
          }
        }
        return 'OK'
      },
      get: async (key: string, path?: string) => {
        const value = store.get(key)
        return value ?? null
      },
      numIncrBy: async (key: string, path: string, increment: number) => {
        const existing = store.get(key) as Record<string, unknown> | undefined
        if (!existing) return 0

        const keys = path.slice(1).split('.')
        let current = existing
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] as Record<string, unknown>
        }
        const currentValue = (current[keys[keys.length - 1]] as number) ?? 0
        const newValue = currentValue + increment
        current[keys[keys.length - 1]] = newValue
        return newValue
      }
    },
    del: async (key: string) => {
      store.delete(key)
      return 1
    }
  }
}

// Mock GameStateManager
function createMockGameStateManager() {
  const games = new Map<string, GameState>()
  return {
    games,
    async getState(gameId: string): Promise<GameState | null> {
      return games.get(gameId) ?? null
    },
    async setState(gameId: string, state: GameState): Promise<void> {
      games.set(gameId, state)
    },
    async incrementVersion(gameId: string): Promise<number> {
      const state = games.get(gameId)
      if (!state) throw new Error('Game not found')
      state.version = (state.version ?? 0) + 1
      return state.version
    },
    async updateByPath(gameId: string, path: string, value: unknown): Promise<void> {
      const state = games.get(gameId)
      if (!state) throw new Error('Game not found')
      
      // 简化的路径更新逻辑
      const keys = path.slice(1).split('.')
      let current = state as Record<string, unknown>
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>
      }
      current[keys[keys.length - 1]] = value
    }
  }
}

// 创建测试用的游戏状态
function createTestGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    id: 'test-game',
    mode: 'campaign',
    version: 0,
    currentRound: 1,
    phase: 'recruit',
    turnTimer: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    players: {},
    userId: 'user-1',
    level: 1,
    campaignProgressId: 'progress-1',
    ...overrides
  } as GameState
}

describe('DeltaSyncManager', () => {
  let mockRedis: ReturnType<typeof createMockRedis>
  let mockStateManager: ReturnType<typeof createMockGameStateManager>
  let manager: DeltaSyncManager

  beforeEach(() => {
    mockRedis = createMockRedis()
    mockStateManager = createMockGameStateManager()
    manager = new DeltaSyncManager(mockRedis as unknown as Parameters<typeof DeltaSyncManager>[0], mockStateManager)
  })

  describe('computeDelta', () => {
    it('should increment version on state change', async () => {
      const gameId = 'test-game'
      const oldState = createTestGameState({ version: 1 })
      const newState = createTestGameState({ 
        version: 2,
        currentRound: 2 
      })

      const delta = await manager.computeDelta(gameId, oldState, newState)

      expect(delta.fromVersion).toBe(1)
      expect(delta.toVersion).toBe(2)
    })

    it('should compute delta between states', async () => {
      const gameId = 'test-game'
      const oldState = createTestGameState({ 
        version: 1,
        players: {
          'player-1': {
            id: 'player-1',
            gold: 10
          }
        }
      } as GameState)
      
      const newState = createTestGameState({ 
        version: 2,
        players: {
          'player-1': {
            id: 'player-1',
            gold: 8  // 花费了2金币
          }
        }
      } as GameState)

      const result = await manager.computeDelta(gameId, oldState, newState)

      expect(result.delta).toBeDefined()
      expect(result.fromVersion).toBe(1)
      expect(result.toVersion).toBe(2)
    })

    it('should create StateDeltaMessage with version info', async () => {
      const gameId = 'test-game'
      const oldState = createTestGameState({ version: 5 })
      const newState = createTestGameState({ version: 6, currentRound: 3 })

      const stateDelta = await manager.computeDelta(gameId, oldState, newState)

      expect(stateDelta.fromVersion).toBe(5)
      expect(stateDelta.toVersion).toBe(6)
      expect(stateDelta.delta).toBeDefined()
    })
  })

  describe('getFullState', () => {
    it('should provide full state when requested', async () => {
      const gameId = 'test-game'
      const state = createTestGameState({ version: 3 })
      await mockStateManager.setState(gameId, state)

      const result = await manager.getFullState(gameId)

      expect(result.version).toBe(3)
      expect(result.state).toEqual(state)
    })

    it('should return null state for non-existent game', async () => {
      const result = await manager.getFullState('non-existent')

      expect(result.state).toBeNull()
      expect(result.version).toBe(0)
    })
  })

  describe('client version tracking', () => {
    it('should track client versions', () => {
      const playerId = 'player-1'
      
      // 初始版本为0
      expect(manager.getClientVersion(playerId)).toBe(0)

      // 注册客户端
      manager.registerClient(playerId, 1)
      expect(manager.getClientVersion(playerId)).toBe(1)

      // 更新版本
      manager.updateClientVersion(playerId, 5)
      expect(manager.getClientVersion(playerId)).toBe(5)
    })

    it('should check version continuity', () => {
      const playerId = 'player-1'
      
      manager.registerClient(playerId, 3)
      
      // 版本 4 是连续的（3 + 1）
      expect(manager.isVersionContinuous(playerId, 4)).toBe(true)
      
      // 版本 5 不连续（跳跃了）
      expect(manager.isVersionContinuous(playerId, 5)).toBe(false)
      
      // 版本 3 不连续（相同版本）
      expect(manager.isVersionContinuous(playerId, 3)).toBe(false)
    })

    it('should handle unregistered clients', () => {
      const playerId = 'unknown-player'
      
      // 未注册的客户端版本为0
      expect(manager.getClientVersion(playerId)).toBe(0)
      
      // 版本检查返回 false
      expect(manager.isVersionContinuous(playerId, 1)).toBe(false)
    })

    it('should track lastSyncAt timestamp', () => {
      const playerId = 'player-1'
      const beforeTime = Date.now()
      
      manager.registerClient(playerId, 1)
      
      const clientVersion = manager.getClientInfo(playerId)
      expect(clientVersion).toBeDefined()
      expect(clientVersion!.lastSyncAt).toBeGreaterThanOrEqual(beforeTime)
    })
  })

  describe('applyDelta', () => {
    it('should apply changes and increment version', async () => {
      const gameId = 'test-game'
      const state = createTestGameState({ version: 1 })
      await mockStateManager.setState(gameId, state)

      const changes = [
        { path: '.currentRound', oldValue: 1, newValue: 2 }
      ]

      const result = await manager.applyDelta(gameId, changes)

      expect(result.fromVersion).toBe(1)
      expect(result.toVersion).toBe(2)
      expect(result.changes).toEqual(changes)
    })
  })

  describe('needsFullSync', () => {
    it('should determine if full sync is needed', async () => {
      const playerId = 'player-1'
      const gameId = 'test-game'
      
      manager.registerClient(playerId, 1)
      
      // 当前版本 1，服务端版本 3，差距过大需要全量同步
      expect(manager.needsFullSync(playerId, 3, 2)).toBe(true)
      
      // 版本连续，不需要全量同步
      expect(manager.needsFullSync(playerId, 2, 2)).toBe(false)
    })
  })
})
