import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createRedisClient } from './client'

describe('Redis Client', () => {
  let client: ReturnType<typeof createRedisClient>
  let isRedisAvailable = false
  let authError = false

  beforeAll(async () => {
    client = createRedisClient()
    try {
      await client.connect()
      // Test if Redis requires authentication by executing a simple command
      await client.exists('test:ping')
      isRedisAvailable = true
    } catch (err: any) {
      if (err?.message?.includes('NOAUTH') || err?.message?.includes('authentication')) {
        authError = true
        console.log('Redis authentication required, skipping integration tests')
      } else {
        // Redis not available, skip tests
        console.log('Redis not available, skipping integration tests')
      }
    }
  })

  afterAll(async () => {
    if (isRedisAvailable) {
      await client.disconnect()
    }
  })

  it('should create client with correct structure', () => {
    expect(client).toHaveProperty('connect')
    expect(client).toHaveProperty('disconnect')
    expect(client).toHaveProperty('isConnected')
    expect(client).toHaveProperty('del')
    expect(client).toHaveProperty('exists')
    expect(client).toHaveProperty('expire')
    expect(client).toHaveProperty('json')
    expect(client.json).toHaveProperty('set')
    expect(client.json).toHaveProperty('get')
    expect(client.json).toHaveProperty('numIncrBy')
    expect(client.json).toHaveProperty('arrAppend')
  })

  it('should connect to Redis', async () => {
    if (!isRedisAvailable || authError) {
      console.log('Skipping: Redis not available or auth required')
      return
    }
    expect(client.isConnected()).toBe(true)
  })

  it('should support JSON.GET command', async () => {
    if (!isRedisAvailable || authError) {
      console.log('Skipping: Redis not available or auth required')
      return
    }
    await client.json.set('test:key', '.', { foo: 'bar' })
    const result = await client.json.get('test:key', '.foo')
    expect(result).toBe('bar')
    await client.del('test:key')
  })

  it('should support JSON.SET command', async () => {
    if (!isRedisAvailable || authError) {
      console.log('Skipping: Redis not available or auth required')
      return
    }
    await client.json.set('test:key2', '.', { count: 0 })
    await client.json.numIncrBy('test:key2', '.count', 5)
    const result = await client.json.get('test:key2', '.count')
    expect(result).toBe(5)
    await client.del('test:key2')
  })

  it('should support EXISTS command', async () => {
    if (!isRedisAvailable || authError) {
      console.log('Skipping: Redis not available or auth required')
      return
    }
    await client.json.set('test:exists', '.', { foo: 'bar' })
    const exists = await client.exists('test:exists')
    expect(exists).toBe(1)
    const notExists = await client.exists('test:notexists')
    expect(notExists).toBe(0)
    await client.del('test:exists')
  })

  it('should support EXPIRE command', async () => {
    if (!isRedisAvailable || authError) {
      console.log('Skipping: Redis not available or auth required')
      return
    }
    await client.json.set('test:expire', '.', { foo: 'bar' })
    const result = await client.expire('test:expire', 1)
    expect(result).toBe(true)
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 1100))
    const exists = await client.exists('test:expire')
    expect(exists).toBe(0)
  })
})

import { resetRedisClient } from './client'

describe('Redis Client - reset function', () => {
  it('resetRedisClient should be exported', () => {
    expect(typeof resetRedisClient).toBe('function')
  })
})
