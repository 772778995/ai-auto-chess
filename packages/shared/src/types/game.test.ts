// packages/shared/src/types/game.test.ts
import { describe, it, expect } from 'vitest'
import type { BaseGameState, GameState, CampaignGameState, MultiplayerGameState } from './game'
import { GamePhase } from './game'

describe('GameState version', () => {
  it('should have version field in BaseGameState', () => {
    // 创建一个符合 BaseGameState 的对象
    const state: BaseGameState = {
      id: 'test-game',
      mode: 'campaign',
      version: 0,
      currentRound: 1,
      phase: GamePhase.LOBBY,
      turnTimer: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: {},
    }

    expect(state.version).toBeDefined()
    expect(typeof state.version).toBe('number')
  })

  it('version should start at 0', () => {
    const state: BaseGameState = {
      id: 'test-game',
      mode: 'campaign',
      version: 0,
      currentRound: 1,
      phase: GamePhase.LOBBY,
      turnTimer: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: {},
    }

    expect(state.version).toBe(0)
  })

  it('version should increment on state changes', () => {
    const state: BaseGameState = {
      id: 'test-game',
      mode: 'campaign',
      version: 0,
      currentRound: 1,
      phase: GamePhase.LOBBY,
      turnTimer: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: {},
    }

    // 模拟状态变更：版本号递增
    state.version += 1
    state.phase = GamePhase.RECRUIT
    state.updatedAt = Date.now()

    expect(state.version).toBe(1)
    expect(state.phase).toBe(GamePhase.RECRUIT)
  })

  it('CampaignGameState should extend BaseGameState with version', () => {
    const campaignState: CampaignGameState = {
      id: 'campaign-game-1',
      mode: 'campaign',
      version: 0,
      currentRound: 1,
      phase: GamePhase.RECRUIT,
      turnTimer: 60,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: {},
      userId: 'user-1',
      level: 1,
      campaignProgressId: 'progress-1',
    }

    expect(campaignState.version).toBe(0)
    expect(campaignState.mode).toBe('campaign')
    expect(campaignState.level).toBe(1)
  })

  it('MultiplayerGameState should extend BaseGameState with version', () => {
    const multiplayerState: MultiplayerGameState = {
      id: 'multi-game-1',
      mode: 'multiplayer',
      version: 0,
      currentRound: 1,
      phase: GamePhase.LOBBY,
      turnTimer: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: {},
      roomId: 'room-1',
      maxPlayers: 8,
    }

    expect(multiplayerState.version).toBe(0)
    expect(multiplayerState.mode).toBe('multiplayer')
    expect(multiplayerState.maxPlayers).toBe(8)
  })
})