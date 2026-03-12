/**
 * 效果序列化/反序列化工具
 *
 * 用于将 EffectFunction 转换为可传输的字符串，以及反向转换
 * 支持通过 msgpackr 进行网络传输和持久化存储
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
 */
export function serializeEffect(effect: EffectFunction): string {
  return effect.toString()
}

/**
 * 反序列化效果函数
 * 从字符串重建 EffectFunction
 */
export function deserializeEffect(serialized: string): EffectFunction {
  // 使用 new Function 重建函数，参数为 ctx
  const fn = new Function('ctx', serialized)
  return fn as EffectFunction
}

/**
 * 序列化随从
 * 将随从的所有效果函数转换为字符串
 */
export function serializeFollower(follower: Follower): SerializedFollower {
  const serializedEffects: Partial<Record<TriggerTiming, string[]>> = {}

  // 遍历 effects 对象，转换每个 TriggerTiming 的 EffectFunction[]
  if (follower.effects) {
    for (const [timing, effectList] of Object.entries(follower.effects)) {
      if (effectList && effectList.length > 0) {
        serializedEffects[timing as TriggerTiming] = effectList.map((effect) =>
          serializeEffect(effect)
        )
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
 */
export function deserializeFollower(serialized: SerializedFollower): Follower {
  const deserializedEffects: Partial<Record<TriggerTiming, EffectFunction[]>> = {}

  // 遍历 effects 对象，转换每个 TriggerTiming 的 string[]
  if (serialized.effects) {
    for (const [timing, effectList] of Object.entries(serialized.effects)) {
      if (effectList && effectList.length > 0) {
        deserializedEffects[timing as TriggerTiming] = effectList.map((serialized) =>
          deserializeEffect(serialized)
        )
      }
    }
  }

  return {
    ...serialized,
    effects: deserializedEffects
  }
}