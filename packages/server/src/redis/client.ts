import { createClient, RedisClientType } from 'redis'

let client: RedisClientType | null = null

function ensureClient(): RedisClientType {
  if (!client) {
    throw new Error('Redis client not initialized')
  }
  return client
}

export function resetRedisClient() {
  client = null
}

export function createRedisClient() {
  if (client) return client

  const redisUrl = process.env['REDIS_URL'] || 'redis://localhost:6379'
  const password = process.env['REDIS_PASSWORD']
  client = createClient({
    url: redisUrl,
    ...(password ? { password } : {}),
  })

  client.on('error', (err) => {
    console.error('Redis Client Error:', err)
  })

  return {
    async connect() {
      const c = ensureClient()
      await c.connect()
    },

    async disconnect() {
      const c = ensureClient()
      await c.disconnect()
      client = null
    },

    isConnected() {
      return client?.isReady ?? false
    },

    async del(key: string) {
      const c = ensureClient()
      return c.del(key)
    },

    async rpush(key: string, ...values: string[]) {
      const c = ensureClient()
      return c.rPush(key, values)
    },

    async lrange(key: string, start: number, stop: number) {
      const c = ensureClient()
      return c.lRange(key, start, stop)
    },

    async llen(key: string) {
      const c = ensureClient()
      return c.lLen(key)
    },

    async exists(key: string) {
      const c = ensureClient()
      return c.exists(key)
    },

    async expire(key: string, seconds: number) {
      const c = ensureClient()
      return c.expire(key, seconds)
    },

    json: {
      async set(key: string, path: string, value: unknown) {
        const c = ensureClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return c.json.set(key, path, value as any)
      },

      async get(key: string, path?: string) {
        const c = ensureClient()
        return c.json.get(key, { path: path || '.' })
      },

      async numIncrBy(key: string, path: string, increment: number) {
        const c = ensureClient()
        return c.json.numIncrBy(key, path, increment)
      },

      async arrAppend(key: string, path: string, ...values: unknown[]) {
        const c = ensureClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return c.json.arrAppend(key, path, values as any[])
      },
    },
  }
}
