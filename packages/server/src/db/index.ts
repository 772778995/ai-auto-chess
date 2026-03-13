import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

// 数据库连接
const connectionString = process.env['DATABASE_URL'] || 'postgresql://game_user:game_password@localhost:5432/game_db'

// 创建查询客户端
const queryClient = postgres(connectionString, {
  max: 10, // 最大连接数
  idle_timeout: 20, // 空闲超时（秒）
  connect_timeout: 10, // 连接超时（秒）
})

// 创建 Drizzle 实例
export const db = drizzle(queryClient, { schema })

// 类型导出
export type Database = typeof db
export { schema }

// 迁移函数
export async function runMigrations() {
  try {
    console.log('Running database migrations...')
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('Migrations completed successfully')
  } catch (error) {
    // 检查是否是因为表已存在导致的错误
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('already exists')) {
      console.log('Tables already exist, skipping migration (use db:migrate for proper tracking)')
      return
    }
    console.error('Migration failed:', error)
    throw error
  }
}

// 健康检查
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean
  message: string
  timestamp: number
}> {
  try {
    const result = await queryClient`SELECT 1 as test`

    const isHealthy = Array.isArray(result) && result[0]?.['test'] === 1

    return {
      healthy: isHealthy,
      message: isHealthy ? 'Database is healthy' : 'Database check failed',
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      healthy: false,
      message: `Database error: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now(),
    }
  }
}

// 实用函数
export async function transactional<T>(callback: (tx: any) => Promise<T>): Promise<T> {
  return await db.transaction(async (tx) => {
    return await callback(tx)
  })
}

// 关闭连接
export async function closeDatabase() {
  await queryClient.end()
  console.log('Database connection closed')
}

// 默认导出
export default {
  db,
  schema,
  runMigrations,
  checkDatabaseHealth,
  transactional,
  closeDatabase,
}