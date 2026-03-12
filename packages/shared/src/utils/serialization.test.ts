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
import type {
  Follower,
  EffectContext,
  EffectFunction,
  FollowerInstance,
  TriggerTiming,
  BattlePosition
} from '../types/follower'

describe('序列化工具', () => {
  // 创建模拟的 EffectContext
  function createMockContext(overrides?: Partial<EffectContext>): EffectContext {
    const mockPosition: BattlePosition = { side: 'ally', x: 0, y: 0 }
    const mockFollower: FollowerInstance = {
      id: 'test-follower',
      name: 'Test Follower',
      description: 'Test',
      level: 1,
      baseAttack: 2,
      baseHealth: 3,
      instanceId: 'test-instance',
      ownerId: 'player-1',
      position: mockPosition,
      currentHealth: 3,
      statusList: [],
      equipment: [],
      equipmentSlots: 1,
      imageUrl: 'test.png'
    }

    return {
      gameState: {
        allies: [mockFollower],
        enemies: [],
        turn: 1
      },
      self: mockFollower,
      tools: {
        cloneDeep: <T>(obj: T) => JSON.parse(JSON.stringify(obj)),
        getRandomEnemy: () => null,
        getRandomAlly: () => mockFollower,
        getAllAllies: () => [mockFollower],
        getAllEnemies: () => [],
        getColumnAllies: () => [mockFollower]
      },
      event: undefined,
      ...overrides
    }
  }

  describe('serializeEffect / deserializeEffect', () => {
    it('应该能够序列化和反序列化简单的效果函数', () => {
      const effect: EffectFunction = (ctx) => {
        // 简单效果：返回修改后的游戏状态
        return {
          gameState: ctx.gameState,
          events: []
        }
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      const mockCtx = createMockContext()
      const result = deserialized(mockCtx)

      expect(result).toEqual({
        gameState: mockCtx.gameState,
        events: []
      })
    })

    it('应该能够处理空效果', () => {
      const effect: EffectFunction = () => {
        // 空效果
        return {
          gameState: {},
          events: []
        }
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      expect(deserialized).toBeInstanceOf(Function)

      const mockCtx = createMockContext()
      const result = deserialized(mockCtx)
      expect(result).toBeDefined()
    })

    it('应该能够处理复杂的效果函数（包含条件判断）', () => {
      const effect: EffectFunction = (ctx) => {
        // 条件判断效果
        const allies = ctx.tools.getAllAllies(ctx.gameState)
        if (allies.length > 0) {
          return {
            gameState: ctx.gameState,
            events: [{
              type: 'heal',
              targets: [ctx.self],
              value: 1
            }]
          }
        }
        return {
          gameState: ctx.gameState,
          events: []
        }
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      const mockCtx = createMockContext()
      const result = deserialized(mockCtx)

      expect(result.events).toBeDefined()
      expect(result.events?.[0].type).toBe('heal')
    })

    it('应该能够处理带有多个操作的效果函数', () => {
      const effect: EffectFunction = (ctx) => {
        // 多个操作效果
        return {
          gameState: ctx.gameState,
          events: [
            {
              type: 'damage',
              targets: [ctx.self],
              value: 2,
              damageType: 'physical',
              source: ctx.self
            },
            {
              type: 'heal',
              targets: [ctx.self],
              value: 1
            }
          ]
        }
      }

      const serialized = serializeEffect(effect)
      const deserialized = deserializeEffect(serialized)

      const mockCtx = createMockContext()
      const result = deserialized(mockCtx)

      expect(result.events).toHaveLength(2)
      expect(result.events?.[0].type).toBe('damage')
      expect(result.events?.[1].type).toBe('heal')
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
        description: '测试',
        level: 1,
        baseAttack: 2,
        baseHealth: 3,
        equipmentSlots: 1,
        imageUrl: 'test.png',
        effects: {
          onAttack: [
            (ctx) => {
              return {
                gameState: ctx.gameState,
                events: [{
                  type: 'damage',
                  targets: [ctx.self],
                  value: 1,
                  damageType: 'physical',
                  source: ctx.self
                }]
              }
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(deserialized.id).toBe(follower.id)
      expect(deserialized.name).toBe(follower.name)
      expect(deserialized.effects).toBeDefined()
      expect(deserialized.effects?.onAttack).toHaveLength(1)

      // 测试反序列化后的效果函数是否正常工作
      const mockCtx = createMockContext()

      if (deserialized.effects?.onAttack) {
        const result = deserialized.effects.onAttack[0](mockCtx)
        expect(result.events).toBeDefined()
        expect(result.events?.[0].type).toBe('damage')
      }
    })

    it('应该能够处理多个 TriggerTiming 的效果', () => {
      const follower: Follower = {
        id: 'follower-2',
        name: '多效果随从',
        description: '测试',
        level: 1,
        baseAttack: 2,
        baseHealth: 3,
        equipmentSlots: 1,
        imageUrl: 'test.png',
        effects: {
          onAttack: [
            (ctx) => {
              return {
                gameState: ctx.gameState,
                events: [{
                  type: 'damage',
                  targets: [ctx.self],
                  value: 1,
                  damageType: 'physical',
                  source: ctx.self
                }]
              }
            }
          ],
          onTakeDamage: [
            (ctx) => {
              return {
                gameState: ctx.gameState,
                events: [{
                  type: 'heal',
                  targets: [ctx.self],
                  value: 1
                }]
              }
            }
          ],
          onDeath: [
            (ctx) => {
              return {
                gameState: ctx.gameState,
                events: [{
                  type: 'summon',
                  followers: [ctx.self],
                  positions: [{ side: 'ally', x: 0, y: 0 }]
                }]
              }
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(Object.keys(deserialized.effects || {})).toHaveLength(3)

      // 测试每个效果
      const mockCtx1 = createMockContext()

      if (deserialized.effects?.onAttack) {
        const result = deserialized.effects.onAttack[0](mockCtx1)
        expect(result.events?.[0].type).toBe('damage')
      }

      const mockCtx2 = createMockContext()

      if (deserialized.effects?.onTakeDamage) {
        const result = deserialized.effects.onTakeDamage[0](mockCtx2)
        expect(result.events?.[0].type).toBe('heal')
      }

      const mockCtx3 = createMockContext()

      if (deserialized.effects?.onDeath) {
        const result = deserialized.effects.onDeath[0](mockCtx3)
        expect(result.events?.[0].type).toBe('summon')
      }
    })

    it('应该能够处理同一个 Timing 有多个效果', () => {
      const follower: Follower = {
        id: 'follower-3',
        name: '多效果同timing随从',
        description: '测试',
        level: 1,
        baseAttack: 2,
        baseHealth: 3,
        equipmentSlots: 1,
        imageUrl: 'test.png',
        effects: {
          onAttack: [
            (ctx) => {
              return {
                gameState: ctx.gameState,
                events: [{
                  type: 'damage',
                  targets: [ctx.self],
                  value: 1,
                  damageType: 'physical',
                  source: ctx.self
                }]
              }
            },
            (ctx) => {
              return {
                gameState: ctx.gameState,
                events: [{
                  type: 'heal',
                  targets: [ctx.self],
                  value: 1
                }]
              }
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(deserialized.effects?.onAttack).toHaveLength(2)

      const mockCtx = createMockContext()

      if (deserialized.effects?.onAttack) {
        const result1 = deserialized.effects.onAttack[0](mockCtx)
        expect(result1.events?.[0].type).toBe('damage')

        const result2 = deserialized.effects.onAttack[1](mockCtx)
        expect(result2.events?.[0].type).toBe('heal')
      }
    })

    it('应该能够处理没有效果的随从', () => {
      const follower: Follower = {
        id: 'follower-4',
        name: '无效果随从',
        description: '测试',
        level: 1,
        baseAttack: 2,
        baseHealth: 3,
        equipmentSlots: 1,
        imageUrl: 'test.png'
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
        description: '测试',
        level: 1,
        baseAttack: 2,
        baseHealth: 3,
        equipmentSlots: 1,
        imageUrl: 'test.png',
        effects: {
          onAttack: []
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      // 空数组应该被保留
      expect(deserialized.effects?.onAttack).toEqual([])
    })

    it('应该能够处理随从的其他属性', () => {
      const follower: Follower = {
        id: 'follower-6',
        name: '完整属性随从',
        description: '测试',
        level: 3,
        baseAttack: 5,
        baseHealth: 10,
        equipmentSlots: 2,
        imageUrl: 'test.png',
        effects: {
          onAttack: [
            (ctx) => {
              return {
                gameState: ctx.gameState,
                events: [{
                  type: 'damage',
                  targets: [ctx.self],
                  value: 1,
                  damageType: 'physical',
                  source: ctx.self
                }]
              }
            }
          ]
        }
      }

      const serialized = serializeFollower(follower)
      const deserialized = deserializeFollower(serialized)

      expect(deserialized.id).toBe(follower.id)
      expect(deserialized.name).toBe(follower.name)
      expect(deserialized.level).toBe(follower.level)
      expect(deserialized.baseAttack).toBe(follower.baseAttack)
      expect(deserialized.baseHealth).toBe(follower.baseHealth)
    })
  })
})