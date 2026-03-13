import { getStarDistribution, rollStarLevel } from '@game/shared/constants'

type CardType = 'follower' | 'equipment' | 'spell'

interface CardData {
  id: string
  star: number
}

/**
 * 卡池管理系统
 * 负责按星级分类存储卡牌，并提供抽卡功能
 */
export class CardPool {
  // 按类型和星级分组的卡牌ID
  private pools: Record<CardType, Map<number, string[]>> = {
    follower: new Map(),
    equipment: new Map(),
    spell: new Map(),
  }

  /**
   * 初始化卡池
   * @param followers 随从卡牌数据数组
   * @param equipment 装备卡牌数据数组
   * @param spells 咒术卡牌数据数组
   */
  constructor(
    followers: CardData[],
    equipment: CardData[],
    spells: CardData[],
  ) {
    this.initializePool('follower', followers)
    this.initializePool('equipment', equipment)
    this.initializePool('spell', spells)
  }

  /**
   * 初始化指定类型的卡池
   */
  private initializePool(type: CardType, cards: CardData[]): void {
    const pool = this.pools[type]

    for (const card of cards) {
      const star = card.star
      if (!pool.has(star)) {
        pool.set(star, [])
      }
      pool.get(star)!.push(card.id)
    }
  }

  /**
   * 按星级和类型抽取一张卡牌
   * @param star 目标星级
   * @param type 卡牌类型
   * @returns 抽中的卡牌ID，如果该星级无卡牌则返回 null
   */
  drawCard(star: number, type: CardType): string | null {
    const pool = this.pools[type]
    const cards = pool.get(star)

    if (!cards || cards.length === 0) {
      return null
    }

    // 从该星级的卡牌中随机选择一张
    const randomIndex = Math.floor(Math.random() * cards.length)
    return cards[randomIndex]!
  }

  /**
   * 根据商店等级抽取卡牌（自动按概率决定星级）
   * @param level 商店等级
   * @param type 卡牌类型
   * @returns 抽中的卡牌ID，如果无法抽取则返回 null
   */
  drawCardByShopLevel(level: number, type: CardType): string | null {
    // 根据商店等级 roll 出星级
    const star = rollStarLevel(level)
    return this.drawCard(star, type)
  }

  /**
   * 获取指定星级和类型的可用卡牌数量
   * @param star 目标星级
   * @param type 卡牌类型
   * @returns 可用卡牌数量
   */
  getAvailableCount(star: number, type: CardType): number {
    const pool = this.pools[type]
    const cards = pool.get(star)
    return cards?.length ?? 0
  }

  /**
   * 根据商店等级获取星级概率分布
   * @param level 商店等级
   * @returns 星级概率分布对象
   */
  getStarDistribution(level: number): Record<number, number> {
    return getStarDistribution(level)
  }

  /**
   * 获取卡池的统计信息（用于调试）
   * @returns 各类型各星级的卡牌数量统计
   */
  getStats(): Record<CardType, Record<number, number>> {
    const stats: Record<CardType, Record<number, number>> = {
      follower: {},
      equipment: {},
      spell: {},
    }

    for (const type of ['follower', 'equipment', 'spell'] as CardType[]) {
      const pool = this.pools[type]
      for (const [star, cards] of pool.entries()) {
        stats[type][star] = cards.length
      }
    }

    return stats
  }
}
