// packages/server/src/systems/BattleRecorder.ts
// BattleRecorder - 战斗事件记录器，用于记录战斗过程和回放

import { pack, unpack } from 'msgpackr'
import type { BattleEvent, BattleSnapshot } from '@game/shared'

/**
 * Redis 客户端接口
 * 需要支持 JSON 操作和 List 操作
 */
interface RedisClient {
  // JSON 操作
  json: {
    set(key: string, path: string, value: unknown): Promise<unknown>
    get(key: string, path?: string): Promise<unknown>
  }

  // List 操作
  rpush(key: string, ...values: string[]): Promise<number>
  lrange(key: string, start: number, stop: number): Promise<string[]>
  llen(key: string): Promise<number>

  // 通用操作
  del(key: string): Promise<number>
}

/**
 * BattleRecorder - 战斗事件记录器
 *
 * 用于记录战斗过程，支持：
 * - 创建和获取战斗快照（BattleSnapshot）
 * - 记录战斗事件（BattleEvent）到 Redis List
 * - 使用 msgpackr 进行二进制序列化
 * - 支持战斗回放
 *
 * Redis Key 设计：
 * - 快照：`battle:snapshot:${battleId}`
 * - 事件：`battle:events:${battleId}`
 */
export class BattleRecorder {
  constructor(private redis: RedisClient) {}

  /**
   * 创建战斗快照
   * @param battleId 战斗ID
   * @param snapshot 战斗快照数据
   */
  async createSnapshot(battleId: string, snapshot: BattleSnapshot): Promise<void> {
    const key = this.getSnapshotKey(battleId)
    await this.redis.json.set(key, '$', snapshot)
  }

  /**
   * 获取战斗快照
   * @param battleId 战斗ID
   * @returns 战斗快照，不存在则返回 null
   */
  async getSnapshot(battleId: string): Promise<BattleSnapshot | null> {
    const key = this.getSnapshotKey(battleId)
    const data = await this.redis.json.get(key)

    if (!data) return null

    return data as BattleSnapshot
  }

  /**
   * 记录单个战斗事件
   * @param battleId 战斗ID
   * @param event 战斗事件
   */
  async recordEvent(battleId: string, event: BattleEvent): Promise<void> {
    const key = this.getEventsKey(battleId)
    const buffer = pack(event)
    // Redis 存储二进制需要转 base64
    await this.redis.rpush(key, buffer.toString('base64'))
  }

  /**
   * 批量记录战斗事件
   * @param battleId 战斗ID
   * @param events 战斗事件数组
   */
  async recordEvents(battleId: string, events: BattleEvent[]): Promise<void> {
    if (events.length === 0) return

    const key = this.getEventsKey(battleId)
    const buffers = events.map((e) => pack(e).toString('base64'))
    await this.redis.rpush(key, ...buffers)
  }

  /**
   * 获取所有战斗事件
   * @param battleId 战斗ID
   * @returns 按时间顺序排列的战斗事件数组
   */
  async getEvents(battleId: string): Promise<BattleEvent[]> {
    const key = this.getEventsKey(battleId)
    const data = await this.redis.lrange(key, 0, -1)

    if (!data || data.length === 0) return []

    return data.map((item: string) => {
      const buffer = Buffer.from(item, 'base64')
      return unpack(buffer) as BattleEvent
    })
  }

  /**
   * 获取事件数量
   * @param battleId 战斗ID
   * @returns 事件数量
   */
  async getEventCount(battleId: string): Promise<number> {
    const key = this.getEventsKey(battleId)
    return this.redis.llen(key)
  }

  /**
   * 清除战斗数据（包括快照和事件）
   * @param battleId 战斗ID
   */
  async clearBattle(battleId: string): Promise<void> {
    await this.redis.del(this.getSnapshotKey(battleId))
    await this.redis.del(this.getEventsKey(battleId))
  }

  /**
   * 生成快照 Redis Key
   */
  private getSnapshotKey(battleId: string): string {
    return `battle:snapshot:${battleId}`
  }

  /**
   * 生成事件 Redis Key
   */
  private getEventsKey(battleId: string): string {
    return `battle:events:${battleId}`
  }
}
