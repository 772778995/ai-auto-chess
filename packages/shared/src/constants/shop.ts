// 商店系统常量

/**
 * 商店等级配置
 * 包含每个等级所需经验和星级概率分布
 */
export const SHOP_LEVEL_CONFIG: Record<number, {
  expRequired: number
  stars: Record<number, number> // 星级: 概率(%)
}> = {
  1: { expRequired: 0, stars: { 1: 100 } },
  2: { expRequired: 5, stars: { 1: 60, 2: 40 } },
  3: { expRequired: 7, stars: { 1: 10, 2: 30, 3: 60 } },
  4: { expRequired: 9, stars: { 1: 10, 2: 20, 3: 30, 4: 40 } },
  5: { expRequired: 11, stars: { 2: 11, 3: 22, 4: 37, 5: 30 } },
  6: { expRequired: 13, stars: { 3: 25, 4: 35, 5: 30, 6: 10 } },
}

/**
 * 商店基础配置
 */
export const SHOP_CONFIG = {
  SLOT_COUNT: 6,
  REFRESH_COST: 1,
  BUY_BASE_PRICE: 3,
  SELL_BASE_PRICE: 1,
  EXP_PER_ROUND: 2,
  EQUIPMENT_PROBABILITY: 0.2,
  MAX_LEVEL: 6,
  MIN_LEVEL: 1,
} as const

/**
 * 根据商店等级获取星级概率分布
 * @param level 商店等级 (1-6)
 * @returns 星级概率分布对象，key为星级，value为概率(0-1)
 */
export function getStarDistribution(level: number): Record<number, number> {
  const config = SHOP_LEVEL_CONFIG[level]
  if (!config) {
    throw new Error(`Invalid shop level: ${level}`)
  }

  // 将百分比转换为小数概率
  const distribution: Record<number, number> = {}
  let totalProb = 0

  for (const [star, prob] of Object.entries(config.stars)) {
    const probDecimal = prob / 100
    distribution[parseInt(star)] = probDecimal
    totalProb += probDecimal
  }

  // 验证概率总和为1（允许浮点误差）
  if (Math.abs(totalProb - 1) > 0.001) {
    throw new Error(`Star probabilities for level ${level} do not sum to 1: ${totalProb}`)
  }

  return distribution
}

/**
 * 根据商店等级随机 roll 出星级
 * @param level 商店等级 (1-6)
 * @returns 抽中的星级 (1-6)
 */
export function rollStarLevel(level: number): number {
  const distribution = getStarDistribution(level)
  const random = Math.random()

  let cumulativeProb = 0
  for (const [star, prob] of Object.entries(distribution)) {
    cumulativeProb += prob
    if (random < cumulativeProb) {
      return parseInt(star)
    }
  }

  // 如果由于浮点精度问题未返回，返回最大星级
  return Math.max(...Object.keys(distribution).map(Number))
}

/**
 * 获取升级所需经验
 * @param level 当前商店等级
 * @returns 升级到下一级所需经验
 */
export function getExpRequired(level: number): number {
  const nextLevel = level + 1
  const config = SHOP_LEVEL_CONFIG[nextLevel]
  return config?.expRequired ?? 0
}
