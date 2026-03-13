// packages/server/src/systems/DeltaSyncManager.ts
// DeltaSyncManager - 版本号 + Delta 同步管理器

import { diff } from 'jsondiffpatch'
import type { StateChange } from '@game/shared'
import type { GameState } from './GameStateManager'

/**
 * 状态增量（Delta）
 */
export interface StateDelta {
  fromVersion: number
  toVersion: number
  changes: StateChange[]
  delta: unknown  // jsondiffpatch delta
}

/**
 * 客户端版本信息
 */
export interface ClientVersion {
  playerId: string
  version: number
  lastSyncAt: number
}

/**
 * GameStateManager 接口（需要的最小接口）
 */
interface GameStateManagerInterface {
  getState(gameId: string): Promise<GameState | null>
  incrementVersion(gameId: string): Promise<number>
  updateByPath(gameId: string, path: string, value: unknown): Promise<void>
}

/**
 * Redis 客户端接口
 */
interface RedisClient {
  json: {
    set(key: string, path: string, value: unknown): Promise<unknown>
    get(key: string, path?: string): Promise<unknown>
    numIncrBy(key: string, path: string, increment: number): Promise<unknown>
  }
  del(key: string): Promise<number>
}

/**
 * DeltaSyncManager - 管理版本号和 Delta 同步
 *
 * 核心职责：
 * 1. 计算状态变更的 Delta
 * 2. 管理版本号递增
 * 3. 追踪客户端同步版本
 * 4. 决定是否需要全量同步
 */
export class DeltaSyncManager {
  private clientVersions: Map<string, ClientVersion> = new Map()

  constructor(
    _redis: RedisClient,
    private stateManager: GameStateManagerInterface
  ) {
    // redis 客户端保留供将来使用（广播 Delta）
    // 目前使用内存中的 clientVersions Map
  }

  /**
   * 计算并返回 Delta
   * @param gameId 游戏ID
   * @param oldState 变更前的状态
   * @param newState 变更后的状态
   * @returns StateDelta 包含版本信息和 delta
   */
  async computeDelta(
    _gameId: string,
    oldState: GameState,
    newState: GameState
  ): Promise<StateDelta> {
    const fromVersion = oldState.version ?? 0
    const toVersion = newState.version ?? 0

    // 使用 jsondiffpatch 计算 delta
    const delta = diff(oldState, newState)

    // 转换为 StateChange 数组（可选，用于审计日志）
    const changes = this.deltaToChanges(delta)

    return {
      fromVersion,
      toVersion,
      changes,
      delta
    }
  }

  /**
   * 应用 Delta 并增加版本号
   * @param gameId 游戏ID
   * @param changes 状态变更列表
   * @returns StateDelta 包含版本信息
   */
  async applyDelta(
    gameId: string,
    changes: StateChange[]
  ): Promise<StateDelta> {
    const state = await this.stateManager.getState(gameId)
    if (!state) {
      throw new Error(`Game not found: ${gameId}`)
    }

    const fromVersion = state.version ?? 0

    // 应用变更
    for (const change of changes) {
      await this.stateManager.updateByPath(gameId, change.path, change.newValue)
    }

    // 增加版本号
    const toVersion = await this.stateManager.incrementVersion(gameId)

    return {
      fromVersion,
      toVersion,
      changes,
      delta: null  // 不需要完整 delta
    }
  }

  /**
   * 获取全量状态（用于客户端版本不连续时）
   * @param gameId 游戏ID
   * @returns 包含版本号和状态
   */
  async getFullState(gameId: string): Promise<{ version: number; state: GameState | null }> {
    const state = await this.stateManager.getState(gameId)
    if (!state) {
      return { version: 0, state: null }
    }
    return {
      version: state.version ?? 0,
      state
    }
  }

  /**
   * 注册客户端版本
   * @param playerId 玩家ID
   * @param version 初始版本号
   */
  registerClient(playerId: string, version: number): void {
    this.clientVersions.set(playerId, {
      playerId,
      version,
      lastSyncAt: Date.now()
    })
  }

  /**
   * 更新客户端版本
   * @param playerId 玩家ID
   * @param version 新版本号
   */
  updateClientVersion(playerId: string, version: number): void {
    const existing = this.clientVersions.get(playerId)
    if (existing) {
      this.clientVersions.set(playerId, {
        ...existing,
        version,
        lastSyncAt: Date.now()
      })
    }
  }

  /**
   * 检查客户端版本是否连续
   * @param playerId 玩家ID
   * @param expectedVersion 期望的版本号
   * @returns 是否连续
   */
  isVersionContinuous(playerId: string, expectedVersion: number): boolean {
    const client = this.clientVersions.get(playerId)
    if (!client) return false

    // 版本应该正好比客户端当前版本大 1
    return expectedVersion === client.version + 1
  }

  /**
   * 获取客户端当前版本
   * @param playerId 玩家ID
   * @returns 版本号，未注册返回 0
   */
  getClientVersion(playerId: string): number {
    return this.clientVersions.get(playerId)?.version ?? 0
  }

  /**
   * 获取客户端完整信息
   * @param playerId 玩家ID
   * @returns ClientVersion 或 undefined
   */
  getClientInfo(playerId: string): ClientVersion | undefined {
    return this.clientVersions.get(playerId)
  }

  /**
   * 判断是否需要全量同步
   * @param playerId 玩家ID
   * @param currentVersion 服务端当前版本
   * @param maxDeltaGap 允许的最大版本差距（默认 5）
   * @returns 是否需要全量同步
   */
  needsFullSync(playerId: string, currentVersion: number, maxDeltaGap: number = 5): boolean {
    const clientVersion = this.getClientVersion(playerId)
    
    // 客户端版本差距超过阈值，需要全量同步
    const versionGap = currentVersion - clientVersion
    return versionGap >= maxDeltaGap
  }

  /**
   * 移除客户端追踪
   * @param playerId 玩家ID
   */
  removeClient(playerId: string): void {
    this.clientVersions.delete(playerId)
  }

  /**
   * 清理所有客户端追踪
   */
  clearClients(): void {
    this.clientVersions.clear()
  }

  /**
   * 将 jsondiffpatch delta 转换为 StateChange 数组
   * @param delta jsondiffpatch delta 对象
   * @returns StateChange 数组
   */
  private deltaToChanges(delta: unknown): StateChange[] {
    const changes: StateChange[] = []

    if (!delta || typeof delta !== 'object') return changes

    // 递归解析 delta 对象
    this.extractChanges(delta as Record<string, unknown>, '', changes)

    return changes
  }

  /**
   * 递归提取变更
   */
  private extractChanges(
    obj: Record<string, unknown>,
    currentPath: string,
    changes: StateChange[]
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      // jsondiffpatch 特殊键
      if (key === '_t') continue

      const path = currentPath ? `${currentPath}.${key}` : `.${key}`

      if (Array.isArray(value)) {
        // 数组表示值变更：[oldValue, newValue] 或 [newValue]（新增）或 [oldValue, 0, 0]（删除）
        if (value.length === 2) {
          // 值变更
          changes.push({
            path,
            oldValue: value[0],
            newValue: value[1]
          })
        } else if (value.length === 1) {
          // 新增
          changes.push({
            path,
            oldValue: undefined,
            newValue: value[0]
          })
        } else if (value.length === 3 && value[1] === 0 && value[2] === 0) {
          // 删除
          changes.push({
            path,
            oldValue: value[0],
            newValue: undefined
          })
        }
      } else if (value && typeof value === 'object') {
        // 递归处理嵌套对象
        this.extractChanges(value as Record<string, unknown>, path, changes)
      }
    }
  }

  /**
   * 广播 Delta 给所有客户端（WebSocket 相关，后续实现）
   * @param gameId 游戏ID
   * @param delta 状态增量
   */
  async broadcastDelta(_gameId: string, _delta: StateDelta): Promise<void> {
    // TODO: 实现 WebSocket 广播
    // 1. 获取房间内所有玩家
    // 2. 检查每个玩家的版本连续性
    // 3. 发送 delta 或触发全量同步
  }
}
