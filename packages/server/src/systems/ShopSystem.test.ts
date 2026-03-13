import { describe, it, expect, beforeEach } from 'vitest'
import { ShopSystem } from './ShopSystem'
import { CardPool } from './CardPool'
import { GameStateManager, type PlayerState, type ShopSlot } from './GameStateManager'
import {
  SHOP_CONFIG,
} from '@game/shared/constants/shop'

// 模拟 Redis 客户端
class MockRedisClient {
  private data: Map<string, unknown> = new Map()

  json = {
    set: async (key: string, path: string, value: unknown): Promise<void> => {
      const current = (MockRedisClient.instance.data.get(key) ?? {}) as Record<string, unknown>
      if (path === '.') {
        MockRedisClient.instance.data.set(key, value)
      } else {
        const keys = path.split('.').filter(k => k)
        let target: Record<string, unknown> = current
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i]!
          if (!target[k]) target[k] = {}
          target = target[k] as Record<string, unknown>
        }
        target[keys[keys.length - 1]!] = value
        MockRedisClient.instance.data.set(key, current)
      }
    },
    get: async (key: string, path?: string): Promise<unknown> => {
      const current = MockRedisClient.instance.data.get(key)
      if (!path || path === '.') return current
      const keys = path.split('.').filter(k => k)
      let target: unknown = current
      for (const k of keys) {
        if (target === null || target === undefined) return null
        target = (target as Record<string, unknown>)[k]
      }
      return target
    },
    numIncrBy: async (key: string, path: string, increment: number): Promise<number> => {
      const current = (await MockRedisClient.instance.json.get(key, path)) as number
      const newValue = (current ?? 0) + increment
      await MockRedisClient.instance.json.set(key, path, newValue)
      return newValue
    },
  }

  del = async (key: string): Promise<number> => {
    return MockRedisClient.instance.data.delete(key) ? 1 : 0
  }

  static instance = new MockRedisClient()

  clear() {
    this.data.clear()
  }
}

// 测试数据
const testFollowers = [
  { id: 'follower_1_1', star: 1 },
  { id: 'follower_1_2', star: 1 },
  { id: 'follower_2_1', star: 2 },
  { id: 'follower_3_1', star: 3 },
]

const testEquipment = [
  { id: 'equipment_1_1', star: 1 },
  { id: 'equipment_2_1', star: 2 },
]

const testSpells = [
  { id: 'spell_1_1', star: 1 },
  { id: 'spell_2_1', star: 2 },
]

describe('ShopSystem', () => {
  let redis: MockRedisClient
  let cardPool: CardPool
  let gameStateManager: GameStateManager
  let shopSystem: ShopSystem
  let gameId: string
  let playerId: string

  beforeEach(async () => {
    redis = MockRedisClient.instance
    redis.clear()

    cardPool = new CardPool(testFollowers, testEquipment, testSpells)
    gameStateManager = new GameStateManager(redis)
    shopSystem = new ShopSystem({ cardPool, gameStateManager })

    gameId = 'test-game-1'
    playerId = 'player-1'

    // 创建游戏和玩家
    await gameStateManager.createCampaignGame(gameId, {
      userId: playerId,
      level: 1,
      campaignProgressId: 'progress-1',
    })

    await gameStateManager.addPlayer(gameId, {
      id: playerId,
      username: 'TestPlayer',
      gold: 10,
      shopLevel: 1,
      shopExp: 0,
    })
  })

  describe('initPlayerShop', () => {
    it('应该成功初始化玩家商店', async () => {
      await shopSystem.initPlayerShop(gameId, playerId)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.shop).toHaveLength(SHOP_CONFIG.SLOT_COUNT)
      expect(playerState?.shopLocked).toBe(false)
    })

    it('应该生成正确数量的槽位', async () => {
      await shopSystem.initPlayerShop(gameId, playerId)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.shop.length).toBe(6)
    })
  })

  describe('refresh', () => {
    beforeEach(async () => {
      await shopSystem.initPlayerShop(gameId, playerId)
    })

    it('应该成功刷新商店并扣除金币', async () => {
      const initialGold = 10
      const result = await shopSystem.refresh(gameId, playerId)

      expect(result.success).toBe(true)
      expect(result.goldRemaining).toBe(initialGold - SHOP_CONFIG.REFRESH_COST)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.gold).toBe(initialGold - SHOP_CONFIG.REFRESH_COST)
    })

    it('金币不足时应该失败', async () => {
      // 将金币设置为0
      await gameStateManager.updatePlayerGold(gameId, playerId, -10)

      const result = await shopSystem.refresh(gameId, playerId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient gold')
    })

    it('应该保留锁定的槽位', async () => {
      // 设置锁定槽位
      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      const lockedSlot: ShopSlot = {
        type: 'follower',
        cardId: 'locked_card',
        isLocked: true,
        discount: 0,
      }
      const newShop = [...(playerState?.shop ?? [])]
      newShop[0] = lockedSlot
      await gameStateManager.updatePlayerShop(gameId, playerId, newShop)

      // 刷新商店
      await shopSystem.refresh(gameId, playerId)

      const updatedState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(updatedState?.shop[0]?.cardId).toBe('locked_card')
      expect(updatedState?.shop[0]?.isLocked).toBe(true)
    })

    it('玩家不存在时应该失败', async () => {
      const result = await shopSystem.refresh(gameId, 'non-existent-player')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Player not found')
    })
  })

  describe('buy', () => {
    beforeEach(async () => {
      await shopSystem.initPlayerShop(gameId, playerId)
    })

    it('应该成功购买卡牌', async () => {
      // 设置一个可购买的卡牌
      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      const shopSlot: ShopSlot = {
        type: 'follower',
        cardId: 'follower_1_1',
        isLocked: false,
        discount: 0,
      }
      const newShop = [...(playerState?.shop ?? [])]
      newShop[0] = shopSlot
      await gameStateManager.updatePlayerShop(gameId, playerId, newShop)

      const initialGold = 10
      const result = await shopSystem.buy(gameId, playerId, 0)

      expect(result.success).toBe(true)
      expect(result.goldRemaining).toBe(initialGold - SHOP_CONFIG.BUY_BASE_PRICE)
      expect(result.cardInstanceId).toBeDefined()

      const updatedState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(updatedState?.gold).toBe(initialGold - SHOP_CONFIG.BUY_BASE_PRICE)
      expect(updatedState?.hand.length).toBe(1)
    })

    it('槽位为空时应该失败', async () => {
      // 确保槽位为空
      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      const newShop = [...(playerState?.shop ?? [])]
      newShop[0] = null
      await gameStateManager.updatePlayerShop(gameId, playerId, newShop)

      const result = await shopSystem.buy(gameId, playerId, 0)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Slot is empty')
    })

    it('金币不足时应该失败', async () => {
      // 设置可购买的卡牌但金币不足
      await gameStateManager.updatePlayerGold(gameId, playerId, -10)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      const shopSlot: ShopSlot = {
        type: 'follower',
        cardId: 'follower_1_1',
        isLocked: false,
        discount: 0,
      }
      const newShop = [...(playerState?.shop ?? [])]
      newShop[0] = shopSlot
      await gameStateManager.updatePlayerShop(gameId, playerId, newShop)

      const result = await shopSystem.buy(gameId, playerId, 0)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient gold')
    })

    it('无效槽位索引应该失败', async () => {
      const result = await shopSystem.buy(gameId, playerId, -1)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid slot index')

      const result2 = await shopSystem.buy(gameId, playerId, 6)
      expect(result2.success).toBe(false)
      expect(result2.error).toBe('Invalid slot index')
    })

    it('购买后应该清空槽位', async () => {
      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      const shopSlot: ShopSlot = {
        type: 'follower',
        cardId: 'follower_1_1',
        isLocked: false,
        discount: 0,
      }
      const newShop = [...(playerState?.shop ?? [])]
      newShop[0] = shopSlot
      await gameStateManager.updatePlayerShop(gameId, playerId, newShop)

      await shopSystem.buy(gameId, playerId, 0)

      const updatedState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(updatedState?.shop[0]?.cardId).toBe('')
    })
  })

  describe('sell', () => {
    beforeEach(async () => {
      await shopSystem.initPlayerShop(gameId, playerId)
    })

    it('应该成功出售手牌中的卡牌', async () => {
      // 添加卡牌到手牌
      await gameStateManager.addCardToHand(gameId, playerId, 'card_instance_1', 'follower')

      const initialGold = 10
      const result = await shopSystem.sell(gameId, playerId, 'card_instance_1', 'hand')

      expect(result.success).toBe(true)
      expect(result.goldReceived).toBe(SHOP_CONFIG.SELL_BASE_PRICE)
      expect(result.goldTotal).toBe(initialGold + SHOP_CONFIG.SELL_BASE_PRICE)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.hand.length).toBe(0)
    })

    it('应该成功出售战场上的卡牌', async () => {
      // 添加卡牌到战场
      const cardData = { id: 'card_instance_1', type: 'follower' }
      const battlefield = Array(6).fill(null)
      battlefield[0] = cardData
      await gameStateManager.updatePlayerShop(gameId, playerId, []) // 先更新一个空数组避免类型问题
      await redis.json.set(`game:${gameId}`, `.players.${playerId}.battlefield`, battlefield)

      const initialGold = 10
      const result = await shopSystem.sell(gameId, playerId, 'card_instance_1', 'battlefield')

      expect(result.success).toBe(true)
      expect(result.goldReceived).toBe(SHOP_CONFIG.SELL_BASE_PRICE)
      expect(result.goldTotal).toBe(initialGold + SHOP_CONFIG.SELL_BASE_PRICE)

      const battlefieldState = await redis.json.get(`game:${gameId}`, `.players.${playerId}.battlefield`) as unknown[]
      expect(battlefieldState[0]).toBeNull()
    })

    it('卡牌不存在时应该失败', async () => {
      const result = await shopSystem.sell(gameId, playerId, 'non-existent-card', 'hand')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Card not found')
    })

    it('玩家不存在时应该失败', async () => {
      const result = await shopSystem.sell(gameId, 'non-existent-player', 'card_instance_1', 'hand')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Player not found')
    })
  })

  describe('upgrade', () => {
    beforeEach(async () => {
      await shopSystem.initPlayerShop(gameId, playerId)
    })

    it('应该成功用金币换经验', async () => {
      const result = await shopSystem.upgrade(gameId, playerId, 3)

      expect(result.success).toBe(true)
      expect(result.exp).toBe(3)
      expect(result.leveledUp).toBe(false)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.gold).toBe(7) // 10 - 3
      expect(playerState?.shopExp).toBe(3)
    })

    it('达到升级经验时应该自动升级', async () => {
      // 设置初始经验接近升级
      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      await gameStateManager.updatePlayerShopLevel(gameId, playerId, 1, 2) // 等级1，已有2经验

      // 再投入4经验，应该升级到等级2
      const result = await shopSystem.upgrade(gameId, playerId, 4)

      expect(result.success).toBe(true)
      expect(result.leveledUp).toBe(true)
      expect(result.level).toBe(2)
      expect(result.exp).toBe(1) // 2 + 4 - 5 = 1

      const updatedState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(updatedState?.shopLevel).toBe(2)
      expect(updatedState?.shopExp).toBe(1)
    })

    it('金币不足时应该失败', async () => {
      const result = await shopSystem.upgrade(gameId, playerId, 15)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient gold')
    })

    it('已经达到最高等级时应该失败', async () => {
      // 设置最高等级
      await gameStateManager.updatePlayerShopLevel(gameId, playerId, 6, 0)

      const result = await shopSystem.upgrade(gameId, playerId, 3)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Already at max level')
    })

    it('无效金币数量应该失败', async () => {
      const result = await shopSystem.upgrade(gameId, playerId, 0)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid gold amount')

      const result2 = await shopSystem.upgrade(gameId, playerId, -1)
      expect(result2.success).toBe(false)
      expect(result2.error).toBe('Invalid gold amount')
    })
  })

  describe('toggleLock', () => {
    beforeEach(async () => {
      await shopSystem.initPlayerShop(gameId, playerId)
    })

    it('应该成功切换锁定状态', async () => {
      // 初始为 false
      const result = await shopSystem.toggleLock(gameId, playerId)
      expect(result).toBe(true)

      let playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.shopLocked).toBe(true)

      // 再次切换
      const result2 = await shopSystem.toggleLock(gameId, playerId)
      expect(result2).toBe(false)

      playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.shopLocked).toBe(false)
    })

    it('玩家不存在时应该抛出错误', async () => {
      await expect(shopSystem.toggleLock(gameId, 'non-existent-player')).rejects.toThrow('Player not found')
    })
  })

  describe('onRoundStart', () => {
    beforeEach(async () => {
      await shopSystem.initPlayerShop(gameId, playerId)
    })

    it('应该增加回合经验', async () => {
      await shopSystem.onRoundStart(gameId, playerId)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.shopExp).toBe(SHOP_CONFIG.EXP_PER_ROUND)
    })

    it('应该自动刷新未锁定的商店', async () => {
      // 记录初始商店
      const initialState = await gameStateManager.getPlayerState(gameId, playerId)
      const initialShop = initialState?.shop

      await shopSystem.onRoundStart(gameId, playerId)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      // 商店应该被刷新（随机生成新卡牌）
      expect(playerState?.shop).toBeDefined()
    })

    it('锁定的商店不应该被刷新', async () => {
      // 锁定商店并设置特定卡牌
      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      const lockedSlot: ShopSlot = {
        type: 'follower',
        cardId: 'locked_card',
        isLocked: true,
        discount: 0,
      }
      const newShop = [...(playerState?.shop ?? [])]
      newShop[0] = lockedSlot
      await gameStateManager.updatePlayerShop(gameId, playerId, newShop)
      await gameStateManager.setShopLocked(gameId, playerId, true)

      await shopSystem.onRoundStart(gameId, playerId)

      const updatedState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(updatedState?.shop[0]?.cardId).toBe('locked_card')
      expect(updatedState?.shopLocked).toBe(true)
    })

    it('经验足够时应该自动升级', async () => {
      // 设置接近升级的经验
      await gameStateManager.updatePlayerShopLevel(gameId, playerId, 1, 3)

      // 回合开始增加2经验，总共5经验，应该升级到等级2
      await shopSystem.onRoundStart(gameId, playerId)

      const playerState = await gameStateManager.getPlayerState(gameId, playerId)
      expect(playerState?.shopLevel).toBe(2)
      expect(playerState?.shopExp).toBe(0) // 3 + 2 - 5 = 0
    })

    it('玩家不存在时应该抛出错误', async () => {
      await expect(shopSystem.onRoundStart(gameId, 'non-existent-player')).rejects.toThrow('Player not found')
    })
  })
})
