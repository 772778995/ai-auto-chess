// packages/server/src/systems/CampaignManager.ts
import type { CampaignProgress } from '@game/shared'

// 扩展 CampaignProgress 类型以包含 userId
export interface CampaignProgressWithUserId extends CampaignProgress {
  userId: string
  currentHealth: number
  currentGameId?: string | null
}

export class CampaignManager {
  constructor(private redis: {
    json: {
      set(key: string, path: string, value: unknown): Promise<void>
      get(key: string, path?: string): Promise<unknown | null>
      numIncrBy(key: string, path: string, increment: number): Promise<number>
      arrAppend(key: string, path: string, ...values: unknown[]): Promise<void>
    }
    del(key: string): Promise<void>
  }) {}

  async createCampaign(userId: string): Promise<CampaignProgressWithUserId> {
    const progress: CampaignProgressWithUserId = {
      userId,
      currentLevel: 1,
      maxHealth: 40,
      currentHealth: 40,
      health: 40, // 兼容类型定义
      gold: 6,
      shopLevel: 1,
      shopExp: 0,
      followers: [],
      equipment: [],
      spells: [],
      isVictory: false,
      isDefeated: false
    }

    await this.redis.json.set(`campaign:${userId}`, '.', progress)
    return progress
  }

  async getCampaign(userId: string): Promise<CampaignProgressWithUserId | null> {
    const result = await this.redis.json.get(`campaign:${userId}`)
    return result as CampaignProgressWithUserId | null
  }

  async deleteCampaign(userId: string): Promise<void> {
    await this.redis.del(`campaign:${userId}`)
  }

  async updateHealth(userId: string, delta: number): Promise<number> {
    const result = await this.redis.json.numIncrBy(
      `campaign:${userId}`,
      '.currentHealth',
      delta
    )
    
    // 同时更新 health 字段保持兼容
    await this.redis.json.numIncrBy(
      `campaign:${userId}`,
      '.health',
      delta
    )

    // 检查是否死亡
    if (result <= 0) {
      await this.redis.json.set(
        `campaign:${userId}`,
        '.isDefeated',
        true
      )
    }

    return result
  }

  async updateGold(userId: string, delta: number): Promise<number> {
    const result = await this.redis.json.numIncrBy(
      `campaign:${userId}`,
      '.gold',
      delta
    )
    return result
  }

  async advanceLevel(userId: string, gameId: string): Promise<void> {
    await this.redis.json.numIncrBy(
      `campaign:${userId}`,
      '.currentLevel',
      1
    )
    await this.redis.json.set(
      `campaign:${userId}`,
      '.currentGameId',
      gameId
    )
  }

  async setVictory(userId: string): Promise<void> {
    await this.redis.json.set(
      `campaign:${userId}`,
      '.isVictory',
      true
    )
    await this.redis.json.set(
      `campaign:${userId}`,
      '.currentGameId',
      null
    )
  }

  async addFollower(userId: string, followerId: string): Promise<void> {
    await this.redis.json.arrAppend(
      `campaign:${userId}`,
      '.followers',
      { id: followerId }
    )
  }
}
