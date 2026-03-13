// packages/server/src/systems/GameStateManager.ts
import type { CombatSubPhase } from './StateMachine'

// 本地类型定义（因为这些类型在 shared 包中尚未定义）
export type GamePhase = 'lobby' | 'hero_select' | 'recruit' | 'combat' | 'settlement' | 'ended'

export interface ShopSlot {
  type: 'follower' | 'equipment' | 'spell' | 'null'
  cardId: string
  isLocked: boolean
  discount: number
}

export interface PlayerState {
  id: string
  username: string
  heroId?: string
  health: number
  maxHealth: number
  gold: number
  shopLevel: number
  shopExp: number
  battlefield: (unknown | null)[]
  hand: unknown[]
  shop: (ShopSlot | null)[]
  shopLocked: boolean
  isReady: boolean
  isAlive: boolean
}

// 基础游戏状态（通用字段）
export interface BaseGameState {
  id: string
  mode: 'campaign' | 'multiplayer'
  version: number              // 状态版本号，每次变更 +1
  currentRound: number
  phase: GamePhase
  subPhase?: CombatSubPhase  // 仅战斗阶段有子阶段
  turnTimer: number
  createdAt: number
  updatedAt: number
  players: Record<string, PlayerState>
}

// 单机闯关游戏状态
export interface CampaignGameState extends BaseGameState {
  mode: 'campaign'
  userId: string           // 单机只有一个玩家
  level: number           // 第几关（1-10）
  campaignProgressId: string  // 关联 CampaignProgress
}

// 联机对战游戏状态
export interface MultiplayerGameState extends BaseGameState {
  mode: 'multiplayer'
  roomId: string
  maxPlayers: number
}

// 联合类型
export type GameState = CampaignGameState | MultiplayerGameState

// Redis 客户端接口
interface RedisClient {
  json: {
    set(key: string, path: string, value: unknown): Promise<unknown>
    get(key: string, path?: string): Promise<unknown>
    numIncrBy(key: string, path: string, increment: number): Promise<unknown>
  }
  del(key: string): Promise<number>
}

// 创建单机游戏状态的选项
interface CreateCampaignGameOptions {
  mode: 'campaign'
  userId: string
  level: number
  campaignProgressId: string
}

// 创建联机游戏状态的选项
interface CreateMultiplayerGameOptions {
  mode: 'multiplayer'
  roomId: string
  maxPlayers: number
}

export class GameStateManager {
  constructor(private redis: RedisClient) {}

  // 创建单机闯关游戏
  async createCampaignGame(
    gameId: string,
    options: Omit<CreateCampaignGameOptions, 'mode'>
  ): Promise<CampaignGameState> {
    const now = Date.now()
    const state: CampaignGameState = {
      id: gameId,
      mode: 'campaign',
      version: 0,
      userId: options.userId,
      level: options.level,
      campaignProgressId: options.campaignProgressId,
      currentRound: 1,
      phase: 'lobby',
      turnTimer: 0,
      createdAt: now,
      updatedAt: now,
      players: {}
    }

    await this.redis.json.set(`game:${gameId}`, '.', state)
    return state
  }

  // 创建联机对战游戏
  async createMultiplayerGame(
    gameId: string,
    options: Omit<CreateMultiplayerGameOptions, 'mode'>
  ): Promise<MultiplayerGameState> {
    const now = Date.now()
    const state: MultiplayerGameState = {
      id: gameId,
      mode: 'multiplayer',
      version: 0,
      roomId: options.roomId,
      maxPlayers: options.maxPlayers,
      currentRound: 1,
      phase: 'lobby',
      turnTimer: 0,
      createdAt: now,
      updatedAt: now,
      players: {}
    }

    await this.redis.json.set(`game:${gameId}`, '.', state)
    return state
  }

  async getGame(gameId: string): Promise<GameState | null> {
    const result = await this.redis.json.get(`game:${gameId}`)
    return result as GameState | null
  }

  async deleteGame(gameId: string): Promise<void> {
    await this.redis.del(`game:${gameId}`)
  }

  async addPlayer(
    gameId: string,
    player: Partial<PlayerState> & { id: string }
  ): Promise<void> {
    const fullPlayer: PlayerState = {
      username: player.username || 'Unknown',
      health: player.health ?? 40,
      maxHealth: player.maxHealth ?? 40,
      gold: player.gold ?? 6,
      shopLevel: player.shopLevel ?? 1,
      shopExp: player.shopExp ?? 0,
      battlefield: Array(6).fill(null),
      hand: [],
      shop: Array(6).fill(null),
      shopLocked: false,
      isReady: false,
      isAlive: true,
      ...player,
      id: player.id,  // 确保 id 是最终的值
    }

    await this.redis.json.set(`game:${gameId}`, `.players.${player.id}`, fullPlayer)
    await this.updateTimestamp(gameId)
  }

  async updatePlayerGold(gameId: string, playerId: string, delta: number): Promise<number> {
    const result = await this.redis.json.numIncrBy(
      `game:${gameId}`,
      `.players.${playerId}.gold`,
      delta
    )
    await this.updateTimestamp(gameId)
    return result as number
  }

  async updatePlayerHealth(gameId: string, playerId: string, delta: number): Promise<number> {
    const result = await this.redis.json.numIncrBy(
      `game:${gameId}`,
      `.players.${playerId}.health`,
      delta
    )
    await this.updateTimestamp(gameId)
    return result as number
  }

  async transitionPhase(gameId: string, targetPhase: GamePhase): Promise<void> {
    await this.redis.json.set(`game:${gameId}`, '.phase', targetPhase)
    await this.updateTimestamp(gameId)
  }

  async updateSubPhase(gameId: string, subPhase: CombatSubPhase): Promise<void> {
    await this.redis.json.set(`game:${gameId}`, '.subPhase', subPhase)
    await this.updateTimestamp(gameId)
  }

  private async updateTimestamp(gameId: string): Promise<void> {
    await this.redis.json.set(`game:${gameId}`, '.updatedAt', Date.now())
  }
}