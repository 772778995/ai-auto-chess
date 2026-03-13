// packages/server/src/systems/CommandExecutor.ts
import type { 
  Command, 
  CommandResult, 
  StateChange, 
  BuyPayload, 
  SellPayload, 
  MovePayload 
} from '@game/shared'
import type { GameStateManager, GameState, PlayerState, ShopSlot } from './GameStateManager'

// 验证结果
export interface ValidationResult {
  valid: boolean
  error?: string
}

// Redis 客户端接口（扩展 Stream 操作）
interface RedisClient {
  json: {
    set(key: string, path: string, value: unknown): Promise<unknown>
    get(key: string, path?: string): Promise<unknown>
    numIncrBy(key: string, path: string, increment: number): Promise<unknown>
  }
  del(key: string): Promise<number>
  xadd(key: string, id: string, ...args: string[]): Promise<string>
  xrange(key: string, start: string, end: string): Promise<[string, Record<string, string>][]>
}

/**
 * 指令执行器
 * 负责验证和执行玩家指令
 */
export class CommandExecutor {
  constructor(
    private redis: RedisClient,
    private stateManager: GameStateManager
  ) {}

  /**
   * 执行指令
   */
  async execute(gameId: string, command: Command): Promise<CommandResult> {
    // 1. 获取当前游戏状态
    const gameState = await this.stateManager.getGame(gameId)
    
    if (!gameState) {
      return {
        success: false,
        errorCode: 'GAME_NOT_FOUND',
        changes: []
      }
    }

    const playerState = gameState.players[command.playerId]
    
    if (!playerState) {
      return {
        success: false,
        errorCode: 'PLAYER_NOT_FOUND',
        changes: []
      }
    }
    
    // 2. 验证指令
    const validation = this.validate(command, gameState, playerState)
    if (!validation.valid) {
      return {
        success: false,
        errorCode: validation.error || 'UNKNOWN_ERROR',
        changes: []
      }
    }
    
    // 3. 计算状态变更
    const changes = this.calculateChanges(command, playerState)
    
    // 4. 应用变更
    for (const change of changes) {
      await this.applyChange(gameId, command.playerId, change)
    }
    
    // 5. 增加版本号
    await this.incrementVersion(gameId)
    
    // 6. 记录指令到 Redis Stream
    await this.recordCommand(gameId, command)
    
    // 7. 获取更新后的玩家状态
    const updatedState = await this.stateManager.getGame(gameId)
    const updatedPlayerState = updatedState?.players[command.playerId]
    
    return {
      success: true,
      changes,
      newState: updatedPlayerState ? JSON.parse(JSON.stringify(updatedPlayerState)) : undefined
    }
  }
  
  /**
   * 验证指令
   */
  private validate(
    command: Command, 
    _gameState: GameState, 
    playerState: PlayerState
  ): ValidationResult {
    switch (command.type) {
      case 'BUY':
        return this.validateBuy(command.payload as BuyPayload, playerState)
      case 'SELL':
        return this.validateSell(command.payload as SellPayload, playerState)
      case 'MOVE':
        return this.validateMove(command.payload as MovePayload, playerState)
      case 'REFRESH':
        return this.validateRefresh(playerState)
      case 'LOCK':
        return { valid: true }
      case 'UPGRADE':
        return this.validateUpgrade(playerState)
      case 'EQUIP':
        return this.validateEquip(command.payload, playerState)
      case 'USE_SPELL':
        return this.validateUseSpell(command.payload, playerState)
      case 'CONFIRM':
        return { valid: true }
      default:
        return { valid: false, error: 'UNKNOWN_COMMAND_TYPE' }
    }
  }
  
  /**
   * 验证购买指令
   */
  private validateBuy(payload: BuyPayload, playerState: PlayerState): ValidationResult {
    const slot = playerState.shop[payload.shopSlot]
    
    if (!slot || (slot as ShopSlot).type === 'null') {
      return { valid: false, error: 'EMPTY_SLOT' }
    }
    
    const cost = this.getCardCost(slot as ShopSlot)
    if (playerState.gold < cost) {
      return { valid: false, error: 'INSUFFICIENT_GOLD' }
    }
    
    return { valid: true }
  }
  
  /**
   * 验证出售指令
   */
  private validateSell(payload: SellPayload, playerState: PlayerState): ValidationResult {
    // 检查来源是否有随从
    if (payload.source === 'hand') {
      if (!playerState.hand[payload.position]) {
        return { valid: false, error: 'NO_FOLLOWER_AT_POSITION' }
      }
    } else if (payload.source === 'battlefield') {
      if (!playerState.battlefield[payload.position]) {
        return { valid: false, error: 'NO_FOLLOWER_AT_POSITION' }
      }
    }
    return { valid: true }
  }
  
  /**
   * 验证移动指令
   */
  private validateMove(payload: MovePayload, playerState: PlayerState): ValidationResult {
    // 检查来源位置
    const source = payload.from.source === 'hand' 
      ? playerState.hand[payload.from.position]
      : playerState.battlefield[payload.from.position]
    
    if (!source) {
      return { valid: false, error: 'NO_FOLLOWER_AT_SOURCE' }
    }
    
    // 检查目标位置是否为空（仅 battlefield 需要检查）
    if (payload.to.source === 'battlefield') {
      const target = playerState.battlefield[payload.to.position]
      if (target) {
        return { valid: false, error: 'TARGET_OCCUPIED' }
      }
    }
    
    return { valid: true }
  }

  /**
   * 验证刷新指令
   */
  private validateRefresh(playerState: PlayerState): ValidationResult {
    // 刷新商店需要1金币
    if (playerState.gold < 1) {
      return { valid: false, error: 'INSUFFICIENT_GOLD' }
    }
    return { valid: true }
  }

  /**
   * 验证升级指令
   */
  private validateUpgrade(playerState: PlayerState): ValidationResult {
    // 升级商店需要金币 = 当前等级 * 4
    const cost = playerState.shopLevel * 4
    if (playerState.gold < cost) {
      return { valid: false, error: 'INSUFFICIENT_GOLD' }
    }
    return { valid: true }
  }

  /**
   * 验证装备指令
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private validateEquip(_payload: unknown, _playerState: PlayerState): ValidationResult {
    // TODO: 实现装备验证逻辑
    return { valid: true }
  }

  /**
   * 验证使用咒术指令
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private validateUseSpell(_payload: unknown, _playerState: PlayerState): ValidationResult {
    // TODO: 实现咒术验证逻辑
    return { valid: true }
  }
  
  /**
   * 计算状态变更
   */
  private calculateChanges(command: Command, playerState: PlayerState): StateChange[] {
    const changes: StateChange[] = []
    
    switch (command.type) {
      case 'BUY': {
        const payload = command.payload as BuyPayload
        const slot = playerState.shop[payload.shopSlot] as ShopSlot
        const cost = this.getCardCost(slot)
        
        changes.push({
          path: 'gold',
          oldValue: playerState.gold,
          newValue: playerState.gold - cost
        })
        break
      }
      case 'SELL': {
        changes.push({
          path: 'gold',
          oldValue: playerState.gold,
          newValue: playerState.gold + 1 // 卖出得1金币
        })
        break
      }
      case 'REFRESH': {
        changes.push({
          path: 'gold',
          oldValue: playerState.gold,
          newValue: playerState.gold - 1
        })
        break
      }
      case 'UPGRADE': {
        const cost = playerState.shopLevel * 4
        changes.push({
          path: 'gold',
          oldValue: playerState.gold,
          newValue: playerState.gold - cost
        })
        changes.push({
          path: 'shopLevel',
          oldValue: playerState.shopLevel,
          newValue: playerState.shopLevel + 1
        })
        break
      }
      case 'MOVE':
      case 'EQUIP':
      case 'USE_SPELL':
      case 'LOCK':
      case 'CONFIRM':
        // 这些指令不产生数值变更
        break
    }
    
    return changes
  }
  
  /**
   * 应用状态变更
   */
  private async applyChange(
    gameId: string, 
    playerId: string, 
    change: StateChange
  ): Promise<void> {
    const key = `game:${gameId}`
    const path = `.players.${playerId}.${change.path}`
    
    if (typeof change.newValue === 'number') {
      await this.redis.json.numIncrBy(
        key,
        path,
        (change.newValue as number) - (change.oldValue as number)
      )
    } else {
      await this.redis.json.set(key, path, change.newValue)
    }
  }

  /**
   * 增加版本号
   */
  private async incrementVersion(gameId: string): Promise<void> {
    const key = `game:${gameId}`
    const state = await this.redis.json.get(key) as Record<string, unknown> | null
    const currentVersion = (state?.['version'] as number) ?? 0
    await this.redis.json.set(key, '.version', currentVersion + 1)
  }
  
  /**
   * 获取卡牌费用
   */
  private getCardCost(slot: ShopSlot): number {
    // 随从购买费用固定为3金币（根据设计文档）
    // 减去折扣
    return Math.max(0, 3 - slot.discount)
  }
  
  /**
   * 记录指令到 Redis Stream
   */
  private async recordCommand(gameId: string, command: Command): Promise<void> {
    const key = `game:${gameId}:commands`
    await this.redis.xadd(key, '*', 'data', JSON.stringify(command))
  }
}
