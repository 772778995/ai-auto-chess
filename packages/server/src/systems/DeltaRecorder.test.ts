// packages/server/src/systems/DeltaRecorder.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { DeltaRecorder } from './DeltaRecorder'
import { createMemoryRedisClient } from '../redis/memory-client'
import type { Delta } from 'jsondiffpatch'

describe('DeltaRecorder', () => {
  let recorder: DeltaRecorder
  let redis: ReturnType<typeof createMemoryRedisClient>

  beforeEach(async () => {
    redis = createMemoryRedisClient()
    await redis.connect()
    recorder = new DeltaRecorder(redis)
  })

  describe('record', () => {
    it('should record delta', async () => {
      const oldState = { count: 0, name: 'initial' }
      const newState = { count: 1, name: 'initial' }

      await recorder.record('game-1', oldState, newState)

      const deltas = await recorder.getDeltas('game-1')
      expect(deltas).toHaveLength(1)
      expect(deltas[0]).toHaveProperty('count')
    })

    it('should record multiple deltas in order', async () => {
      const state1 = { turn: 1, hp: 100 }
      const state2 = { turn: 2, hp: 90 }
      const state3 = { turn: 3, hp: 80 }

      await recorder.record('game-1', state1, state2)
      await recorder.record('game-1', state2, state3)

      const deltas = await recorder.getDeltas('game-1')
      expect(deltas).toHaveLength(2)
      // First delta: turn 1->2, hp 100->90
      expect(deltas[0]).toHaveProperty('turn')
      expect(deltas[0]).toHaveProperty('hp')
      // Second delta: turn 2->3, hp 90->80
      expect(deltas[1]).toHaveProperty('turn')
      expect(deltas[1]).toHaveProperty('hp')
    })

    it('should handle nested object changes', async () => {
      const oldState = { player: { x: 0, y: 0 }, enemies: [] }
      const newState = { player: { x: 1, y: 0 }, enemies: [{ id: 1 }] }

      await recorder.record('game-1', oldState, newState)

      const deltas = await recorder.getDeltas('game-1')
      expect(deltas).toHaveLength(1)
      expect(deltas[0]).toHaveProperty('player')
      expect(deltas[0]).toHaveProperty('enemies')
    })

    it('should handle array changes', async () => {
      const oldState = { items: ['a', 'b'] }
      const newState = { items: ['a', 'b', 'c'] }

      await recorder.record('game-1', oldState, newState)

      const deltas = await recorder.getDeltas('game-1')
      expect(deltas).toHaveLength(1)
      expect(deltas[0]).toHaveProperty('items')
    })
  })

  describe('getDeltas', () => {
    it('should return empty array when no deltas', async () => {
      const deltas = await recorder.getDeltas('non-existent-game')
      expect(deltas).toEqual([])
    })

    it('should get deltas in order', async () => {
      for (let i = 0; i < 3; i++) {
        await recorder.record('game-1', { value: i }, { value: i + 1 })
      }

      const deltas = await recorder.getDeltas('game-1')
      expect(deltas).toHaveLength(3)
      // Verify order: each delta should show the increment
      for (let i = 0; i < 3; i++) {
        expect(deltas[i]).toHaveProperty('value')
      }
    })

    it('should isolate deltas by gameId', async () => {
      await recorder.record('game-1', { x: 1 }, { x: 2 })
      await recorder.record('game-2', { y: 1 }, { y: 2 })

      const deltas1 = await recorder.getDeltas('game-1')
      const deltas2 = await recorder.getDeltas('game-2')

      expect(deltas1).toHaveLength(1)
      expect(deltas2).toHaveLength(1)
      expect(deltas1[0]).toHaveProperty('x')
      expect(deltas2[0]).toHaveProperty('y')
    })
  })

  describe('getDeltaCount', () => {
    it('should return 0 when no deltas', async () => {
      const count = await recorder.getDeltaCount('non-existent-game')
      expect(count).toBe(0)
    })

    it('should return correct count', async () => {
      await recorder.record('game-1', { a: 1 }, { a: 2 })
      await recorder.record('game-1', { a: 2 }, { a: 3 })

      const count = await recorder.getDeltaCount('game-1')
      expect(count).toBe(2)
    })

    it('should count deltas by gameId', async () => {
      await recorder.record('game-1', { x: 1 }, { x: 2 })
      await recorder.record('game-1', { x: 2 }, { x: 3 })
      await recorder.record('game-2', { y: 1 }, { y: 2 })

      expect(await recorder.getDeltaCount('game-1')).toBe(2)
      expect(await recorder.getDeltaCount('game-2')).toBe(1)
    })
  })

  describe('clearDeltas', () => {
    it('should clear all deltas', async () => {
      await recorder.record('game-1', { a: 1 }, { a: 2 })
      await recorder.record('game-1', { a: 2 }, { a: 3 })

      await recorder.clearDeltas('game-1')

      const deltas = await recorder.getDeltas('game-1')
      expect(deltas).toEqual([])
    })

    it('should only clear specified game deltas', async () => {
      await recorder.record('game-1', { x: 1 }, { x: 2 })
      await recorder.record('game-2', { y: 1 }, { y: 2 })

      await recorder.clearDeltas('game-1')

      expect(await recorder.getDeltas('game-1')).toEqual([])
      expect(await recorder.getDeltas('game-2')).toHaveLength(1)
    })

    it('should reset count to 0 after clear', async () => {
      await recorder.record('game-1', { a: 1 }, { a: 2 })
      await recorder.clearDeltas('game-1')

      expect(await recorder.getDeltaCount('game-1')).toBe(0)
    })
  })

  describe('getDeltasInRange', () => {
    it('should return empty array for empty range', async () => {
      const deltas = await recorder.getDeltasInRange('game-1', 0, 5)
      expect(deltas).toEqual([])
    })

    it('should get deltas in specified range', async () => {
      // Record 5 deltas
      for (let i = 0; i < 5; i++) {
        await recorder.record('game-1', { value: i }, { value: i + 1 })
      }

      const deltas = await recorder.getDeltasInRange('game-1', 1, 3)
      expect(deltas).toHaveLength(3) // indices 1, 2, 3
    })

    it('should handle range beyond bounds', async () => {
      await recorder.record('game-1', { a: 1 }, { a: 2 })

      const deltas = await recorder.getDeltasInRange('game-1', 0, 100)
      expect(deltas).toHaveLength(1)
    })

    it('should handle negative end index', async () => {
      for (let i = 0; i < 5; i++) {
        await recorder.record('game-1', { value: i }, { value: i + 1 })
      }

      // Get all but last 2 (indices 0, 1, 2)
      const deltas = await recorder.getDeltasInRange('game-1', 0, -3)
      expect(deltas).toHaveLength(3)
    })

    it('should return deltas in correct order', async () => {
      for (let i = 0; i < 3; i++) {
        await recorder.record('game-1', { step: i }, { step: i + 1 })
      }

      const deltas = await recorder.getDeltasInRange('game-1', 0, 1)
      expect(deltas).toHaveLength(2)
      expect(deltas[0]).toHaveProperty('step')
      expect(deltas[1]).toHaveProperty('step')
    })

    it('should isolate by gameId', async () => {
      await recorder.record('game-1', { x: 1 }, { x: 2 })
      await recorder.record('game-1', { x: 2 }, { x: 3 })
      await recorder.record('game-2', { y: 1 }, { y: 2 })

      const deltas = await recorder.getDeltasInRange('game-1', 0, 0)
      expect(deltas).toHaveLength(1)
      expect(deltas[0]).toHaveProperty('x')
    })
  })
})
