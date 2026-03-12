/**
 * 序列化工具测试
 */

import { describe, it, expect } from 'vitest'
import {
  serializeEffect,
  deserializeEffect,
  serializeFollower,
  deserializeFollower
} from './serialization'
import type { Follower, EffectContext, TriggerTiming } from '../types/follower'

describe('序列化工具', () => {
  describe('serializeEffect / deserializeEffect', () => {
    it('应该能够序列化和反序列化简单的效果函数', () => {
      const effect: EffectFunction = (ctx) => {
        ctx.damage += 1
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      const mockCtx: EffectContext = {
        sourceId: 'follower-1',
        targetId: 'follower-2',
        damage: 0,
        healing: 0,
        flags: []
      }

      deserialized(mockCtx)
      expect(mockCtx.damage).toBe(1)
    })

    it('应该能够处理空效果', () => {
      const effect: EffectFunction = () => {
        // 空效果
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      expect(deserialized).toBeInstanceOf(Function)
    })

    it('应该能够处理复杂的效果函数（包含条件判断）', () => {
      const effect: EffectFunction = (ctx) => {
        if (ctx.damage > 0) {
          ctx.damage *= 2
        }
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      const mockCtx1: EffectContext = {
        sourceId: 'follower-1',
        targetId: 'follower-2',
        damage: 2,
        healing: 0,
        flags: []
      }

      deserialized(mockCtx1)
      expect(mockCtx1.damage).toBe(4)

      const mockCtx2: EffectContext = {
        sourceId: 'follower-1',
        targetId: 'follower-2',
        damage: 0,
        healing: 0,
        flags: []
      }

      deserialized(mockCtx2)
      expect(mockCtx2.damage).toBe(0)
    })

    it('应该能够处理带有多个操作的效果函数', () => {
      const effect: EffectFunction = (ctx) => {
        ctx.damage += 2
        ctx.healing += 1
        ctx.flags.push('test-flag')
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      const mockCtx: EffectContext = {
        sourceId: 'follower-1',
        targetId: 'follower-2',
        damage: 0,
        healing: 0,
        flags: []
      }

      deserialized(mockCtx)
      expect(mockCtx.damage).toBe(2)
      expect(mockCtx.healing).toBe(1)
      expect(mockCtx.flags).toEqual(['test-flag'])
    })

    it('应该拒绝非字符串输入（反序列化）', () => {
      expect(() => deserializeEffect(null as any)).toThrow()
      expect(() => deserializeEffect(undefined as any)).toThrow()
      expect(() => deserializeEffect(123 as any)).toThrow()
      expect(() => deserializeEffect({} as any)).toThrow()
    })

    it('应该拒绝非函数输入（序列化）', () => {
      expect(() => serializeEffect(null as any)).toThrow()
      expect(() => serializeEffect(undefined as any)).toThrow()
      expect(() => serializeEffect('string' as any)).toThrow()
      expect(() => serializeEffect(123 as any)).toThrow()
      expect(() => serializeEffect({} as any)).toThrow()
    })

    it('应该能够处理无效的反序列化输入', () => {
      expect(() => deserializeEffect('invalid javascript code')).toThrow()
    })
  })

  describe('serializeFollower / deserializeFollower', () => {
    it('应该能够序列化和反序列化带有效果的随从', () => {
      const follower: Follower = {
        id: 'follower-1',
        name: '测试随从',
        tags: ['test'],
        baseStats: { attack: 2, hp: 3 },
        level: 1,
        effects: {
          onDealDamage: [
            (ctx) => {
              ctx.damage += 1
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(deserialized.id).toBe(follower.id)
      expect(deserialized.name).toBe(follower.name)
      expect(deserialized.effects).toBeDefined()
      expect(deserialized.effects?.onDealDamage).toHaveLength(1)

      // 测试反序列化后的效果函数是否正常工作
      const mockCtx: EffectContext = {
        sourceId: 'follower-1',
        targetId: 'follower-2',
        damage: 0,
        healing: 0,
        flags: []
      }

      if (deserialized.effects?.onDealDamage) {
        deserialized.effects.onDealDamage[0](mockCtx)
      }

      expect(mockCtx.damage).toBe(1)
    })

    it('应该能够处理多个 TriggerTiming 的效果', () => {
      const follower: Follower = {
        id: 'follower-2',
        name: '多效果随从',
        tags: ['test'],
        baseStats: { attack: 2, hp: 3 },
        level: 1,
        effects: {
          onDealDamage: [
            (ctx) => {
              ctx.damage += 1
            }
          ],
          onTakeDamage: [
            (ctx) => {
              ctx.healing += 1
            }
          ],
          onDeath: [
            (ctx) => {
              ctx.flags.push('death-effect')
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(Object.keys(deserialized.effects || {})).toHaveLength(3)

      // 测试每个效果
      const mockCtx1: EffectContext = {
        sourceId: 'follower-2',
        targetId: 'follower-3',
        damage: 0,
        healing: 0,
        flags: []
      }

      if (deserialized.effects?.onDealDamage) {
        deserialized.effects.onDealDamage[0](mockCtx1)
      }
      expect(mockCtx1.damage).toBe(1)

      const mockCtx2: EffectContext = {
        sourceId: 'follower-3',
        targetId: 'follower-2',
        damage: 0,
        healing: 0,
        flags: []
      }

      if (deserialized.effects?.onTakeDamage) {
        deserialized.effects.onTakeDamage[0](mockCtx2)
      }
      expect(mockCtx2.healing).toBe(1)

      const mockCtx3: EffectContext = {
        sourceId: 'follower-2',
        targetId: 'follower-2',
        damage: 0,
        healing: 0,
        flags: []
      }

      if (deserialized.effects?.onDeath) {
        deserialized.effects.onDeath[0](mockCtx3)
      }
      expect(mockCtx3.flags).toContain('death-effect')
    })

    it('应该能够处理同一个 Timing 有多个效果', () => {
      const follower: Follower = {
        id: 'follower-3',
        name: '多效果同timing随从',
        tags: ['test'],
        baseStats: { attack: 2, hp: 3 },
        level: 1,
        effects: {
          onDealDamage: [
            (ctx) => {
              ctx.damage += 1
            },
            (ctx) => {
              ctx.damage *= 2
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(deserialized.effects?.onDealDamage).toHaveLength(2)

      const mockCtx: EffectContext = {
        sourceId: 'follower-3',
        targetId: 'follower-4',
        damage: 2,
        healing: 0,
        flags: []
      }

      if (deserialized.effects?.onDealDamage) {
        deserialized.effects.onDealDamage.forEach((effect) => effect(mockCtx))
      }

      // 初始 damage=2，第一个效果 +1 变成 3，第二个效果 *2 变成 6
      expect(mockCtx.damage).toBe(6)
    })

    it('应该能够处理没有效果的随从', () => {
      const follower: Follower = {
        id: 'follower-4',
        name: '无效果随从',
        tags: ['test'],
        baseStats: { attack: 2, hp: 3 },
        level: 1
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(deserialized.effects).toBeUndefined()
      expect(deserialized.id).toBe(follower.id)
      expect(deserialized.name).toBe(follower.name)
    })

    it('应该能够处理空的 effects 数组', () => {
      const follower: Follower = {
        id: 'follower-5',
        name: '空effects随从',
        tags: ['test'],
        baseStats: { attack: 2, hp: 3 },
        level: 1,
        effects: {
          onDealDamage: []
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      // 空数组应该被保留
      expect(deserialized.effects?.onDealDamage).toEqual([])
    })

    it('应该能够处理随从的其他属性', () => {
      const follower: Follower = {
        id: 'follower-6',
        name: '完整属性随从',
        tags: ['test1', 'test2'],
        baseStats: { attack: 5, hp: 10 },
        level: 3,
        effects: {
          onDealDamage: [
            (ctx) => {
              ctx.damage += 1
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(deserialized.id).toBe(follower.id)
      expect(deserialized.name).toBe(follower.name)
      expect(deserialized.tags).toEqual(follower.tags)
      expect(deserialized.baseStats).toEqual(follower.baseStats)
      expect(deserialized.level).toBe(follower.level)
    })
  })
})