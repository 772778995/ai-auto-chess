import { create } from 'jsondiffpatch'
import type { Delta } from 'jsondiffpatch'

// 创建 jsondiffpatch 实例
const diffpatcher = create({
  objectHash: (obj: any) => obj.id || JSON.stringify(obj),
  arrays: {
    detectMove: true,
    includeValueOnMove: false,
  },
})

export type { Delta }

/**
 * 计算两个对象之间的差异
 */
export function computeDiff<T = any>(oldObj: T, newObj: T): Delta | undefined {
  try {
    return diffpatcher.diff(oldObj, newObj)
  } catch (error) {
    console.error('Failed to compute diff:', error)
    return undefined
  }
}

/**
 * 应用差异到对象
 */
export function applyDiff<T = any>(obj: T, delta: Delta): T {
  try {
    const result = diffpatcher.patch(obj, delta)
    return result as T
  } catch (error) {
    console.error('Failed to apply diff:', error)
    return obj
  }
}

/**
 * 反转变异（用于撤销）
 */
export function reverseDiff(delta: Delta): Delta {
  try {
    return diffpatcher.reverse(delta)
  } catch (error) {
    console.error('Failed to reverse diff:', error)
    return delta
  }
}

/**
 * 计算差异并用 msgpackr 序列化
 */
export function computeAndSerializeDiff<T = any>(oldObj: T, newObj: T): Uint8Array | null {
  const delta = computeDiff(oldObj, newObj)
  if (!delta) return null

  // 这里需要 msgpackr，但为了简化先使用 JSON
  try {
    const serialized = JSON.stringify(delta)
    return new TextEncoder().encode(serialized)
  } catch (error) {
    console.error('Failed to serialize diff:', error)
    return null
  }
}

/**
 * 反序列化并应用差异
 */
export function deserializeAndApplyDiff<T = any>(obj: T, serializedDelta: Uint8Array): T {
  try {
    const serialized = new TextDecoder().decode(serializedDelta)
    const delta = JSON.parse(serialized) as Delta
    return applyDiff(obj, delta)
  } catch (error) {
    console.error('Failed to deserialize or apply diff:', error)
    return obj
  }
}

/**
 * 比较两个游戏状态，返回优化后的差异
 */
export function computeGameStateDiff(oldState: any, newState: any): Delta | undefined {
  // 对游戏状态进行特殊处理
  const filteredOld = {
    ...oldState,
    timestamp: undefined,
  }

  const filteredNew = {
    ...newState,
    timestamp: undefined,
  }

  return computeDiff(filteredOld, filteredNew)
}

// 导出 diffpatcher 实例
export { diffpatcher }