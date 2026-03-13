// packages/server/src/redis/memory-client.ts
// 内存版 Redis 客户端，用于测试环境

interface JsonValue {
  [key: string]: unknown
}

// Stream entry type
interface StreamEntry {
  id: string
  fields: Record<string, string>
}

export function createMemoryRedisClient() {
  const store = new Map<string, unknown>()
  const jsonStore = new Map<string, JsonValue>()
  const listStore = new Map<string, unknown[]>()
  const streamStore = new Map<string, StreamEntry[]>()

  return {
    async connect() {
      // No-op
    },

    async disconnect() {
      // No-op
    },

    isConnected() {
      return true
    },

    async del(key: string) {
      listStore.delete(key)
      jsonStore.delete(key)
      return store.delete(key) ? 1 : 0
    },

    // List operations for delta recording
    async lpush(key: string, ...values: unknown[]) {
      const list = listStore.get(key) || []
      list.unshift(...values)
      listStore.set(key, list)
      return list.length
    },

    async rpush(key: string, ...values: string[]) {
      const list = listStore.get(key) || []
      list.push(...values)
      listStore.set(key, list)
      return list.length
    },

    async lrange(key: string, start: number, end: number) {
      const list = listStore.get(key) || []
      // Redis lrange end is inclusive, -1 means last element
      const actualEnd = end < 0 ? list.length + end + 1 : end + 1
      return list.slice(start, actualEnd)
    },

    async llen(key: string) {
      const list = listStore.get(key)
      return list ? list.length : 0
    },

    async exists(key: string) {
      return store.has(key) || jsonStore.has(key) ? 1 : 0
    },

    async expire(_key: string, _seconds: number) {
      // No-op in memory mode
      return 1
    },

    async set(key: string, value: string) {
      store.set(key, value)
      return 'OK'
    },

    async get(key: string) {
      return store.get(key) as string | null ?? null
    },

    json: {
      async set(key: string, path: string, value: unknown) {
        // 支持 `$` 和 `.` 作为根路径
        if (path === '.' || path === '$') {
          jsonStore.set(key, value as JsonValue)
        } else {
          const obj = jsonStore.get(key) || {}
          const keys = path.slice(1).split('.').filter(Boolean)
          if (keys.length === 0) {
            jsonStore.set(key, value as JsonValue)
          } else {
            let current: Record<string, unknown> = obj
            for (let i = 0; i < keys.length - 1; i++) {
              const k = keys[i]
              if (k && !(k in current)) {
                current[k] = {}
              }
              if (k) {
                current = current[k] as Record<string, unknown>
              }
            }
            const lastKey = keys[keys.length - 1]
            if (lastKey) {
              current[lastKey] = value
            }
            jsonStore.set(key, obj)
          }
        }
        return 'OK'
      },

      async get(key: string, path?: string) {
        const obj = jsonStore.get(key)
        if (!obj) return null
        if (!path || path === '.' || path === '$') return obj

        const keys = path.slice(1).split('.')
        let current: unknown = obj
        for (const k of keys) {
          if (current && typeof current === 'object') {
            current = (current as Record<string, unknown>)[k]
          } else {
            return null
          }
        }
        return current
      },

      async numIncrBy(key: string, path: string, increment: number) {
        const obj = jsonStore.get(key)
        if (!obj) return null

        const keys = path.slice(1).split('.').filter(Boolean)
        if (keys.length === 0) return null

        let current: Record<string, unknown> = obj
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i]
          if (!k) return null
          current = current[k] as Record<string, unknown>
        }
        const lastKey = keys[keys.length - 1]
        if (!lastKey) return null
        const currentValue = (current[lastKey] as number) || 0
        const newValue = currentValue + increment
        current[lastKey] = newValue
        return newValue
      },

      async arrAppend(key: string, path: string, ...values: unknown[]) {
        const obj = jsonStore.get(key)
        if (!obj) return null

        if (path === '.') {
          // Not supported for root
          return null
        }

        const keys = path.slice(1).split('.').filter(Boolean)
        if (keys.length === 0) return null

        let current: Record<string, unknown> = obj
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i]
          if (!k) return null
          current = current[k] as Record<string, unknown>
        }
        const lastKey = keys[keys.length - 1]
        if (!lastKey) return null
        const arr = (current[lastKey] as unknown[]) || []
        arr.push(...values)
        current[lastKey] = arr
        return arr.length
      },

      async del(key: string, path: string) {
        const obj = jsonStore.get(key)
        if (!obj) return 0

        if (path === '.') {
          return jsonStore.delete(key) ? 1 : 0
        }

        const keys = path.slice(1).split('.').filter(Boolean)
        if (keys.length === 0) return 0

        let current: Record<string, unknown> = obj
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i]
          if (k) {
            current = current[k] as Record<string, unknown>
          }
        }
        const lastKey = keys[keys.length - 1]
        if (lastKey) {
          delete current[lastKey]
        }
        return 1
      }
    },

    // Stream operations for command recording
    async xadd(key: string, id: string, ...args: string[]) {
      const stream = streamStore.get(key) || []
      // Parse field-value pairs from args
      const fields: Record<string, string> = {}
      for (let i = 0; i < args.length; i += 2) {
        const fieldKey = args[i]
        const fieldValue = args[i + 1]
        if (fieldKey !== undefined && fieldValue !== undefined) {
          fields[fieldKey] = fieldValue
        }
      }
      // Generate ID if '*' is passed
      const entryId = id === '*' 
        ? `${Date.now()}-${stream.length}` 
        : id
      stream.push({ id: entryId, fields })
      streamStore.set(key, stream)
      return entryId
    },

    async xrange(_key: string, _start: string, _end: string) {
      const stream = streamStore.get(_key)
      if (!stream) return []
      // Simplified range query - return all entries
      return stream.map(entry => [entry.id, entry.fields])
    },
  }
}