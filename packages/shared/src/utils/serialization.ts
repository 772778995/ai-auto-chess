// packages/shared/src/utils/serialization.ts
import type {
  Follower,
  SerializedFollower,
  EffectDefinition,
  SerializedEffect,
  TriggerTiming,
  EffectFunction
} from '../types/follower'

/**
 * 序列化效果定义
 */
export function serializeEffect(effect: EffectDefinition): SerializedEffect {
  return {
    description: effect.description,
    execute: effect.execute.toString()
  }
}

/**
 * 反序列化效果定义
 */
export function deserializeEffect(serialized: SerializedEffect): EffectDefinition {
  return {
    description: serialized.description,
    execute: new Function('ctx', `return (${serialized.execute})(ctx)`) as EffectFunction
  }
}

/**
 * 序列化随从模板
 */
export function serializeFollower(follower: Follower): SerializedFollower {
  const serialized: SerializedFollower = {
    ...follower,
    effects: {}
  }
  
  for (const [trigger, effect] of Object.entries(follower.effects)) {
    if (effect) {
      serialized.effects[trigger as TriggerTiming] = serializeEffect(effect)
    }
  }
  
  return serialized
}

/**
 * 反序列化随从模板
 */
export function deserializeFollower(serialized: SerializedFollower): Follower {
  const follower: Follower = {
    ...serialized,
    effects: {}
  }
  
  for (const [trigger, effect] of Object.entries(serialized.effects)) {
    if (effect) {
      follower.effects[trigger as TriggerTiming] = deserializeEffect(effect)
    }
  }
  
  return follower
}
