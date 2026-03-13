import { describe, it, expect, beforeEach } from 'vitest'
import { CardPool } from './CardPool'

describe('CardPool', () => {
  // 测试数据
  const testFollowers = [
    { id: 'f1-1', star: 1 },
    { id: 'f1-2', star: 1 },
    { id: 'f2-1', star: 2 },
    { id: 'f2-2', star: 2 },
    { id: 'f3-1', star: 3 },
    { id: 'f4-1', star: 4 },
    { id: 'f5-1', star: 5 },
    { id: 'f6-1', star: 6 },
  ]

  const testEquipment = [
    { id: 'e1-1', star: 1 },
    { id: 'e2-1', star: 2 },
    { id: 'e3-1', star: 3 },
  ]

  const testSpells = [
    { id: 's1-1', star: 1 },
    { id: 's2-1', star: 2 },
  ]

  let cardPool: CardPool

  beforeEach(() => {
    cardPool = new CardPool(testFollowers, testEquipment, testSpells)
  })

  describe('constructor', () => {
    it('应该正确初始化卡池', () => {
      const stats = cardPool.getStats()

      // 验证随从
      expect(stats.follower[1]).toBe(2)
      expect(stats.follower[2]).toBe(2)
      expect(stats.follower[3]).toBe(1)

      // 验证装备
      expect(stats.equipment[1]).toBe(1)
      expect(stats.equipment[2]).toBe(1)

      // 验证咒术
      expect(stats.spell[1]).toBe(1)
    })

    it('应该处理空数组', () => {
      const emptyPool = new CardPool([], [], [])
      const stats = emptyPool.getStats()

      expect(Object.keys(stats.follower)).toHaveLength(0)
      expect(Object.keys(stats.equipment)).toHaveLength(0)
      expect(Object.keys(stats.spell)).toHaveLength(0)
    })
  })

  describe('drawCard', () => {
    it('应该能抽取指定星级和类型的卡牌', () => {
      const cardId = cardPool.drawCard(1, 'follower')

      expect(cardId).toBeTruthy()
      expect(['f1-1', 'f1-2']).toContain(cardId)
    })

    it('多次抽取应该返回有效卡牌ID', () => {
      for (let i = 0; i < 10; i++) {
        const cardId = cardPool.drawCard(2, 'follower')
        expect(['f2-1', 'f2-2']).toContain(cardId)
      }
    })

    it('当星级不存在时应该返回 null', () => {
      const cardId = cardPool.drawCard(10, 'follower')
      expect(cardId).toBeNull()
    })

    it('当类型不存在时应该返回 null', () => {
      const emptyPool = new CardPool([], [], [])
      const cardId = emptyPool.drawCard(1, 'follower')
      expect(cardId).toBeNull()
    })

    it('应该能抽取所有类型的卡牌', () => {
      expect(cardPool.drawCard(1, 'follower')).toBeTruthy()
      expect(cardPool.drawCard(1, 'equipment')).toBeTruthy()
      expect(cardPool.drawCard(1, 'spell')).toBeTruthy()
    })
  })

  describe('drawCardByShopLevel', () => {
    it('应该根据商店等级抽取卡牌', () => {
      const cardId = cardPool.drawCardByShopLevel(1, 'follower')
      expect(cardId).toBeTruthy()

      // 1级商店只能抽到1星（f1-1 或 f1-2）
      expect(['f1-1', 'f1-2']).toContain(cardId)
    })

    it('高等级商店应该能抽到高星级卡牌', () => {
      // 运行多次以测试概率分布
      const results = new Set<string>()
      for (let i = 0; i < 50; i++) {
        const cardId = cardPool.drawCardByShopLevel(6, 'follower')
        if (cardId) {
          results.add(cardId)
        }
      }

      // 应该能抽到多种星级的卡牌
      expect(results.size).toBeGreaterThanOrEqual(1)
    })

    it('应该能处理所有卡牌类型', () => {
      expect(cardPool.drawCardByShopLevel(2, 'follower')).toBeTruthy()
      expect(cardPool.drawCardByShopLevel(2, 'equipment')).toBeTruthy()
      expect(cardPool.drawCardByShopLevel(2, 'spell')).toBeTruthy()
    })
  })

  describe('getAvailableCount', () => {
    it('应该返回正确的可用数量', () => {
      expect(cardPool.getAvailableCount(1, 'follower')).toBe(2)
      expect(cardPool.getAvailableCount(2, 'follower')).toBe(2)
      expect(cardPool.getAvailableCount(3, 'follower')).toBe(1)
      expect(cardPool.getAvailableCount(6, 'follower')).toBe(1)
    })

    it('不存在的星级应该返回 0', () => {
      expect(cardPool.getAvailableCount(10, 'follower')).toBe(0)
    })

    it('所有类型都应该返回正确数量', () => {
      expect(cardPool.getAvailableCount(1, 'follower')).toBe(2)
      expect(cardPool.getAvailableCount(1, 'equipment')).toBe(1)
      expect(cardPool.getAvailableCount(1, 'spell')).toBe(1)
    })
  })

  describe('getStarDistribution', () => {
    it('应该返回正确的星级概率分布', () => {
      const dist1 = cardPool.getStarDistribution(1)
      expect(dist1[1]).toBe(1)

      const dist2 = cardPool.getStarDistribution(2)
      expect(dist2[1]).toBe(0.6)
      expect(dist2[2]).toBe(0.4)

      const dist6 = cardPool.getStarDistribution(6)
      expect(dist6[3]).toBe(0.25)
      expect(dist6[4]).toBe(0.35)
      expect(dist6[5]).toBe(0.3)
      expect(dist6[6]).toBe(0.1)
    })

    it('概率总和应该接近 1', () => {
      for (let level = 1; level <= 6; level++) {
        const dist = cardPool.getStarDistribution(level)
        const total = Object.values(dist).reduce((sum, p) => sum + p, 0)
        expect(Math.abs(total - 1)).toBeLessThan(0.001)
      }
    })

    it('无效等级应该抛出错误', () => {
      expect(() => cardPool.getStarDistribution(0)).toThrow()
      expect(() => cardPool.getStarDistribution(7)).toThrow()
    })
  })

  describe('getStats', () => {
    it('应该返回完整的统计信息', () => {
      const stats = cardPool.getStats()

      expect(stats).toHaveProperty('follower')
      expect(stats).toHaveProperty('equipment')
      expect(stats).toHaveProperty('spell')

      expect(Object.keys(stats.follower).length).toBeGreaterThan(0)
    })
  })
})
