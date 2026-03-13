// packages/server/src/systems/DeltaRecorder.ts
// DeltaRecorder - 记录游戏状态变更历史

import { diff, Delta } from 'jsondiffpatch'

// Redis client interface with list operations
interface RedisClient {
  lpush(key: string, ...values: unknown[]): Promise<number>
  lrange(key: string, start: number, end: number): Promise<unknown[]>
  llen(key: string): Promise<number>
  del(key: string): Promise<number>
}

/**
 * DeltaRecorder - 记录游戏状态的变更历史
 *
 * 使用 jsondiffpatch 计算状态差异，并将 delta 存储在 Redis list 中。
 * 每个游戏实例有独立的 delta 列表，按时间顺序存储（最新的在前面）。
 */
export class DeltaRecorder {
  constructor(private redis: RedisClient) {}

  /**
   * 记录一次状态变更
   * @param gameId 游戏ID
   * @param oldState 变更前的状态
   * @param newState 变更后的状态
   */
  async record(gameId: string, oldState: unknown, newState: unknown): Promise<void> {
    const delta = diff(oldState, newState)
    if (!delta) {
      // No changes, nothing to record
      return
    }

    const key = this.getDeltaKey(gameId)
    // 将 delta 序列化为字符串存储
    await this.redis.lpush(key, JSON.stringify(delta))
  }

  /**
   * 获取所有 delta
   * @param gameId 游戏ID
   * @returns 按时间顺序排列的 delta 数组（最早的在前）
   */
  async getDeltas(gameId: string): Promise<Delta[]> {
    const key = this.getDeltaKey(gameId)
    const rawDeltas = await this.redis.lrange(key, 0, -1)

    if (!rawDeltas || rawDeltas.length === 0) {
      return []
    }

    // 解析并反转顺序（lpush 导致最新的在前面，我们需要最早的在前）
    return rawDeltas
      .map((raw) => this.parseDelta(raw))
      .filter((delta): delta is Delta => delta !== null)
      .reverse()
  }

  /**
   * 获取 delta 数量
   * @param gameId 游戏ID
   * @returns delta 数量
   */
  async getDeltaCount(gameId: string): Promise<number> {
    const key = this.getDeltaKey(gameId)
    return this.redis.llen(key)
  }

  /**
   * 清理所有 deltas
   * @param gameId 游戏ID
   */
  async clearDeltas(gameId: string): Promise<void> {
    const key = this.getDeltaKey(gameId)
    await this.redis.del(key)
  }

  /**
   * 获取指定范围的 deltas
   * @param gameId 游戏ID
   * @param start 起始索引（0-based）
   * @param end 结束索引（包含，负值表示从末尾计数）
   * @returns 按时间顺序排列的 delta 数组
   */
  async getDeltasInRange(gameId: string, start: number, end: number): Promise<Delta[]> {
    const key = this.getDeltaKey(gameId)
    const rawDeltas = await this.redis.lrange(key, start, end)

    if (!rawDeltas || rawDeltas.length === 0) {
      return []
    }

    // 解析并反转顺序（lpush 导致最新的在前面，我们需要最早的在前）
    return rawDeltas
      .map((raw) => this.parseDelta(raw))
      .filter((delta): delta is Delta => delta !== null)
      .reverse()
  }

  /**
   * 生成 Redis key
   */
  private getDeltaKey(gameId: string): string {
    return `deltas:${gameId}`
  }

  /**
   * 解析 delta 字符串
   */
  private parseDelta(raw: unknown): Delta | null {
    if (typeof raw !== 'string') {
      return null
    }

    try {
      return JSON.parse(raw) as Delta
    } catch {
      return null
    }
  }
}
