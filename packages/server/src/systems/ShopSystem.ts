import type { CardPool } from './CardPool'
import type { GameStateManager, PlayerState, ShopSlot } from './GameStateManager'
import {
  SHOP_CONFIG,
  getExpRequired,
} from '@game/shared/constants/shop'

// 结果类型定义
export interface RefreshResult {
  success: boolean
  error?: string
  shop?: (ShopSlot | null)[]
  goldRemaining?: number
}

export interface BuyResult {
  success: boolean
  error?: string
  cardInstanceId?: string
  goldRemaining?: number
}

export interface SellResult {
  success: boolean
  error?: string
  goldReceived?: number
  goldTotal?: number
}

export interface UpgradeResult {
  success: boolean
  error?: string
  level?: number
  exp?: number
  leveledUp?: boolean
  rewardSpellId?: string
}

// 商店系统选项
export interface ShopSystemOptions {
  cardPool: CardPool
  gameStateManager: GameStateManager
}

/**
 * 商店系统
 * 处理商店刷新、购买、出售、升级等操作
 */
export class ShopSystem {
  private cardPool: CardPool
  private gameStateManager: GameStateManager

  constructor(options: ShopSystemOptions) {
    this.cardPool = options.cardPool
    this.gameStateManager = options.gameStateManager
  }

  /**
   * 刷新商店
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @returns 刷新结果
   */
  async refresh(gameId: string, playerId: string): Promise<RefreshResult> {
    // 获取玩家状态
    const playerState = await this.gameStateManager.getPlayerState(gameId, playerId)
    if (!playerState) {
      return { success: false, error: 'Player not found' }
    }

    // 检查金币是否足够
    if (playerState.gold < SHOP_CONFIG.REFRESH_COST) {
      return { success: false, error: 'Insufficient gold' }
    }

    // 扣除金币
    const goldRemaining = await this.gameStateManager.updatePlayerGold(
      gameId,
      playerId,
      -SHOP_CONFIG.REFRESH_COST
    )

    // 刷新商店槽位
    const newShop = await this.generateShopSlots(playerState)

    // 更新商店状态
    await this.gameStateManager.updatePlayerShop(gameId, playerId, newShop)

    return {
      success: true,
      shop: newShop,
      goldRemaining,
    }
  }

  /**
   * 购买卡牌
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param slotIndex 商店槽位索引
   * @returns 购买结果
   */
  async buy(
    gameId: string,
    playerId: string,
    slotIndex: number
  ): Promise<BuyResult> {
    // 验证槽位索引
    if (slotIndex < 0 || slotIndex >= SHOP_CONFIG.SLOT_COUNT) {
      return { success: false, error: 'Invalid slot index' }
    }

    // 获取玩家状态
    const playerState = await this.gameStateManager.getPlayerState(gameId, playerId)
    if (!playerState) {
      return { success: false, error: 'Player not found' }
    }

    // 检查槽位是否有卡牌
    const slot = playerState.shop[slotIndex]
    if (!slot || slot.cardId === '') {
      return { success: false, error: 'Slot is empty' }
    }

    // 检查金币是否足够
    const price = SHOP_CONFIG.BUY_BASE_PRICE
    if (playerState.gold < price) {
      return { success: false, error: 'Insufficient gold' }
    }

    // 扣除金币
    const goldRemaining = await this.gameStateManager.updatePlayerGold(
      gameId,
      playerId,
      -price
    )

    // 生成卡牌实例ID
    const cardInstanceId = `${slot.cardId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 添加卡牌到手牌
    await this.gameStateManager.addCardToHand(
      gameId,
      playerId,
      cardInstanceId,
      slot.type
    )

    // 清空槽位
    const newShop = [...playerState.shop]
    newShop[slotIndex] = {
      type: 'follower',
      cardId: '',
      isLocked: false,
      discount: 0,
    }
    await this.gameStateManager.updatePlayerShop(gameId, playerId, newShop)

    return {
      success: true,
      cardInstanceId,
      goldRemaining,
    }
  }

  /**
   * 出售卡牌
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param cardInstanceId 卡牌实例ID
   * @param from 来源位置（手牌或战场）
   * @returns 出售结果
   */
  async sell(
    gameId: string,
    playerId: string,
    cardInstanceId: string,
    from: 'hand' | 'battlefield'
  ): Promise<SellResult> {
    // 获取玩家状态
    const playerState = await this.gameStateManager.getPlayerState(gameId, playerId)
    if (!playerState) {
      return { success: false, error: 'Player not found' }
    }

    // 根据来源移除卡牌
    let removed = false
    if (from === 'hand') {
      removed = await this.gameStateManager.removeCardFromHand(
        gameId,
        playerId,
        cardInstanceId
      )
    } else {
      removed = await this.gameStateManager.removeCardFromBattlefield(
        gameId,
        playerId,
        cardInstanceId
      )
    }

    if (!removed) {
      return { success: false, error: 'Card not found' }
    }

    // 获得金币
    const goldReceived = SHOP_CONFIG.SELL_BASE_PRICE
    const goldTotal = await this.gameStateManager.updatePlayerGold(
      gameId,
      playerId,
      goldReceived
    )

    return {
      success: true,
      goldReceived,
      goldTotal,
    }
  }

  /**
   * 升级商店（金币换经验）
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param goldAmount 投入的金币数量
   * @returns 升级结果
   */
  async upgrade(
    gameId: string,
    playerId: string,
    goldAmount: number
  ): Promise<UpgradeResult> {
    // 验证金币数量
    if (goldAmount <= 0) {
      return { success: false, error: 'Invalid gold amount' }
    }

    // 获取玩家状态
    const playerState = await this.gameStateManager.getPlayerState(gameId, playerId)
    if (!playerState) {
      return { success: false, error: 'Player not found' }
    }

    // 检查是否已达到最高等级
    if (playerState.shopLevel >= SHOP_CONFIG.MAX_LEVEL) {
      return { success: false, error: 'Already at max level' }
    }

    // 检查金币是否足够
    if (playerState.gold < goldAmount) {
      return { success: false, error: 'Insufficient gold' }
    }

    // 扣除金币
    await this.gameStateManager.updatePlayerGold(gameId, playerId, -goldAmount)

    // 增加经验
    let newExp = playerState.shopExp + goldAmount
    let newLevel = playerState.shopLevel
    let leveledUp = false
    let rewardSpellId: string | undefined

    // 检查是否可以升级
    while (newLevel < SHOP_CONFIG.MAX_LEVEL) {
      const expRequired = getExpRequired(newLevel)
      if (newExp >= expRequired) {
        newExp -= expRequired
        newLevel++
        leveledUp = true
      } else {
        break
      }
    }

    // 更新等级和经验
    if (leveledUp) {
      await this.gameStateManager.updatePlayerShopLevel(
        gameId,
        playerId,
        newLevel,
        newExp
      )

      // 发放升级奖励（咒术）
      rewardSpellId = this.generateRewardSpell(newLevel)
      if (rewardSpellId) {
        await this.gameStateManager.addSpellToHand(gameId, playerId, rewardSpellId)
      }
    } else {
      await this.gameStateManager.updatePlayerShopExp(gameId, playerId, goldAmount)
    }

    return {
      success: true,
      level: newLevel,
      exp: newExp,
      leveledUp,
      rewardSpellId,
    }
  }

  /**
   * 锁定/解锁商店槽位
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @returns 新的锁定状态
   */
  async toggleLock(gameId: string, playerId: string): Promise<boolean> {
    // 获取玩家状态
    const playerState = await this.gameStateManager.getPlayerState(gameId, playerId)
    if (!playerState) {
      throw new Error('Player not found')
    }

    // 切换锁定状态
    const newLocked = !playerState.shopLocked
    await this.gameStateManager.setShopLocked(gameId, playerId, newLocked)

    return newLocked
  }

  /**
   * 回合开始处理
   * +2经验，检查升级，如未锁定则自动刷新
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   */
  async onRoundStart(gameId: string, playerId: string): Promise<void> {
    // 获取玩家状态
    const playerState = await this.gameStateManager.getPlayerState(gameId, playerId)
    if (!playerState) {
      throw new Error('Player not found')
    }

    // 增加回合经验
    let newExp = playerState.shopExp + SHOP_CONFIG.EXP_PER_ROUND
    let newLevel = playerState.shopLevel
    let leveledUp = false

    // 检查是否可以升级
    while (newLevel < SHOP_CONFIG.MAX_LEVEL) {
      const expRequired = getExpRequired(newLevel)
      if (newExp >= expRequired) {
        newExp -= expRequired
        newLevel++
        leveledUp = true
      } else {
        break
      }
    }

    // 更新等级和经验
    if (leveledUp) {
      await this.gameStateManager.updatePlayerShopLevel(
        gameId,
        playerId,
        newLevel,
        newExp
      )

      // 发放升级奖励
      const rewardSpellId = this.generateRewardSpell(newLevel)
      if (rewardSpellId) {
        await this.gameStateManager.addSpellToHand(gameId, playerId, rewardSpellId)
      }
    } else {
      await this.gameStateManager.updatePlayerShopExp(
        gameId,
        playerId,
        SHOP_CONFIG.EXP_PER_ROUND
      )
    }

    // 如果商店未锁定，自动刷新
    if (!playerState.shopLocked) {
      // 免费刷新，不扣除金币
      const newShop = await this.generateShopSlots(playerState)
      await this.gameStateManager.updatePlayerShop(gameId, playerId, newShop)
    }
  }

  /**
   * 初始化玩家商店
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   */
  async initPlayerShop(gameId: string, playerId: string): Promise<void> {
    // 获取玩家状态
    const playerState = await this.gameStateManager.getPlayerState(gameId, playerId)
    if (!playerState) {
      throw new Error('Player not found')
    }

    // 生成初始商店
    const initialShop = await this.generateShopSlots(playerState)
    await this.gameStateManager.updatePlayerShop(gameId, playerId, initialShop)

    // 确保商店未锁定
    await this.gameStateManager.setShopLocked(gameId, playerId, false)
  }

  /**
   * 生成商店槽位
   * @param playerState 玩家状态
   * @returns 商店槽位数组
   */
  private async generateShopSlots(
    playerState: PlayerState
  ): Promise<(ShopSlot | null)[]> {
    const shopLevel = playerState.shopLevel
    const currentShop = playerState.shop
    const newShop: (ShopSlot | null)[] = []

    for (let i = 0; i < SHOP_CONFIG.SLOT_COUNT; i++) {
      const currentSlot = currentShop[i]

      // 如果槽位被锁定且有效，保留该槽位
      if (currentSlot?.isLocked && currentSlot.cardId) {
        newShop.push({ ...currentSlot })
        continue
      }

      // 生成新槽位
      const slot = await this.generateRandomSlot(shopLevel)
      newShop.push(slot)
    }

    return newShop
  }

  /**
   * 生成随机槽位
   * @param shopLevel 商店等级
   * @returns 商店槽位
   */
  private generateRandomSlot(shopLevel: number): ShopSlot | null {
    // 决定卡牌类型（80%随从，20%装备）
    const random = Math.random()
    const type: 'follower' | 'equipment' =
      random < SHOP_CONFIG.EQUIPMENT_PROBABILITY ? 'equipment' : 'follower'

    // 根据商店等级抽取卡牌
    const cardId = this.cardPool.drawCardByShopLevel(shopLevel, type)

    if (!cardId) {
      return null
    }

    return {
      type,
      cardId,
      isLocked: false,
      discount: 0,
    }
  }

  /**
   * 生成升级奖励咒术
   * @param level 新等级
   * @returns 咒术ID或undefined
   */
  private generateRewardSpell(level: number): string | undefined {
    // 根据等级生成对应的奖励咒术
    // 这里简化处理，从卡池抽取一张咒术
    return this.cardPool.drawCardByShopLevel(level, 'spell') ?? undefined
  }
}
