/**
 * 效果序列化/反序列化工具
 *
 * 用于将 EffectFunction 转换为可传输的字符串，以及反向转换
 * 支持通过 msgpackr 进行网络传输和持久化存储
 *
 * @security-warning ⚠️ 安全警告
 *
 * 本工具使用 `new Function()` 进行动态函数创建，存在代码注入风险。
 *
 * **使用限制：**
 * - 仅应用于**可信输入**（如从游戏设计文档或预定义数据中读取）
 * - 不要用于序列化用户提供的代码或不受信任的来源
 * - 仅在受控的游戏逻辑环境中使用
 *
 * **示例场景（安全）：**
 * - 序列化游戏设计者预定义的随从效果
 * - 服务器间传输已验证的游戏数据
 * - 从配置文件读取的效果函数
 *
 * **危险场景（不安全）：**
 * - 序列化用户通过聊天输入的代码
 * - 从不受信任的第三方API接收的效果函数
 * - 允许用户上传包含自定义逻辑的卡牌数据
 *
 * 如果需要支持用户自定义效果，应考虑使用沙箱环境、代码白名单或基于配置的效果系统。
 */

import type {
  Follower,
  SerializedFollower,
  EffectFunction,
  TriggerTiming
} from '../types/follower'

/**
 * 序列化效果函数
 * 将函数转换为字符串形式
 *
 * @param effect - 要序列化的效果函数
 * @returns 函数的字符串表示
 * @throws {TypeError} 如果输入不是函数
 *
 * @example
 * ```typescript
 * const effect: EffectFunction = (ctx) => { ctx.damage += 1 }
 * const serialized = serializeEffect(effect) // "(ctx) => { ctx.damage += 1 }"
 * ```
 */
export function serializeEffect(effect: EffectFunction): string {
  if (typeof effect !== 'function') {
    throw new TypeError(`serializeEffect: 期望输入是函数，收到 ${typeof effect}`)
  }

  return effect.toString()
}

/**
 * 反序列化效果函数
 * 从字符串重建 EffectFunction
 *
 * @param serialized - 序列化的函数字符串
 * @returns 重建的效果函数
 * @throws {TypeError} 如果输入不是字符串
 * @throws {SyntaxError} 如果输入包含无效的 JavaScript 代码
 *
 * @example
 * ```typescript
 * const serialized = "(ctx) => { ctx.damage += 1 }"
 * const effect = deserializeEffect(serialized)
 *
 * const ctx: EffectContext = { sourceId: '1', targetId: '2', damage: 0, healing: 0, flags: [] }
 * effect(ctx)
 * console.log(ctx.damage) // 1
 * ```
 */
export function deserializeEffect(serialized: string): EffectFunction {
  // 输入验证
  if (typeof serialized !== 'string') {
    throw new TypeError(`deserializeEffect: 期望输入是字符串，收到 ${typeof serialized}`)
  }

  if (serialized.trim().length === 0) {
    throw new TypeError('deserializeEffect: 输入字符串不能为空')
  }

  try {
    // 提取箭头函数的主体部分
    // 支持多种格式：(ctx) => { ... }, ctx => { ... }, ctx => expression
    const match = serialized.match(/=>\s*(\{[\s\S]*\}|\([^)]*\)|[^{;]+)\s*$/)

    if (!match) {
      throw new Error(`无法解析函数格式: ${serialized}`)
    }

    const body = match[1]

    // 使用 new Function 重建函数，参数为 ctx
    // @ts-ignore - 安全警告：仅应用于可信输入
    const fn = new Function('ctx', body)

    return fn as EffectFunction
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(`deserializeEffect: 无效的 JavaScript 代码: ${serialized}`)
    }
    throw error
  }
}

/**
 * 序列化随从
 * 将随从的所有效果函数转换为字符串
 *
 * @param follower - 要序列化的随从对象
 * @returns 序列化后的随从对象
 * @throws {TypeError} 如果输入不是有效的随从对象
 *
 * @example
 * ```typescript
 * const follower: Follower = {
 *   id: 'f1',
 *   name: '战士',
 *   tags: ['melee'],
 *   baseStats: { attack: 2, hp: 3 },
 *   level: 1,
 *   effects: {
 *     onDealDamage: [(ctx) => { ctx.damage += 1 }]
 *   }
 * }
 * const serialized = serializeFollower(follower)
 * ```
 */
export function serializeFollower(follower: Follower): SerializedFollower {
  // 输入验证
  if (!follower || typeof follower !== 'object') {
    throw new TypeError('serializeFollower: 期望输入是有效的随从对象')
  }

  if (!follower.id) {
    throw new TypeError('serializeFollower: 随从对象缺少必需的 id 字段')
  }

  const serializedEffects: Partial<Record<TriggerTiming, string[]>> = {}

  // 遍历 effects 对象，转换每个 TriggerTiming 的 EffectFunction[]
  if (follower.effects) {
    for (const [timing, effectList] of Object.entries(follower.effects)) {
      if (effectList) {
        try {
          // 保留空数组，只序列化非空数组
          if (effectList.length > 0) {
            serializedEffects[timing as TriggerTiming] = effectList.map((effect) =>
              serializeEffect(effect)
            )
          } else {
            // 保留空数组
            serializedEffects[timing as TriggerTiming] = []
          }
        } catch (error) {
          console.error(
            `serializeFollower: 序列化效果失败 [timing=${timing}, follower=${follower.id}]:`,
            error
          )
          throw error
        }
      }
    }
  }

  return {
    ...follower,
    effects: serializedEffects
  }
}

/**
 * 反序列化随从
 * 将随从的所有字符串效果转换回 EffectFunction
 *
 * @param serialized - 序列化的随从对象
 * @returns 反序列化后的随从对象
 * @throws {TypeError} 如果输入不是有效的序列化随从对象
 *
 * @example
 * ```typescript
 * const serialized: SerializedFollower = {
 *   id: 'f1',
 *   name: '战士',
 *   tags: ['melee'],
 *   baseStats: { attack: 2, hp: 3 },
 *   level: 1,
 *   effects: {
 *     onDealDamage: ['ctx.damage += 1']
 *   }
 * }
 * const follower = deserializeFollower(serialized)
 * ```
 */
export function deserializeFollower(serialized: SerializedFollower): Follower {
  // 输入验证
  if (!serialized || typeof serialized !== 'object') {
    throw new TypeError('deserializeFollower: 期望输入是有效的序列化随从对象')
  }

  if (!serialized.id) {
    throw new TypeError('deserializeFollower: 序列化随从对象缺少必需的 id 字段')
  }

  const deserializedEffects: Partial<Record<TriggerTiming, EffectFunction[]>> = {}

  // 遍历 effects 对象，转换每个 TriggerTiming 的 string[]
  if (serialized.effects) {
    for (const [timing, effectList] of Object.entries(serialized.effects)) {
      if (effectList) {
        try {
          // 保留空数组，只反序列化非空数组
          if (effectList.length > 0) {
            deserializedEffects[timing as TriggerTiming] = effectList.map((serialized) =>
              deserializeEffect(serialized)
            )
          } else {
            // 保留空数组
            deserializedEffects[timing as TriggerTiming] = []
          }
        } catch (error) {
          console.error(
            `deserializeFollower: 反序列化效果失败 [timing=${timing}, follower=${serialized.id}]:`,
            error
          )
          throw error
        }
      }
    }
  }

  // 构建返回对象，如果没有任何效果，不包含 effects 属性
  const { effects: _, ...followerWithoutEffects } = serialized

  if (Object.keys(deserializedEffects).length > 0) {
    return {
      ...followerWithoutEffects,
      effects: deserializedEffects
    }
  }

  return followerWithoutEffects as Follower
}