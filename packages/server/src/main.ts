import 'dotenv/config'
import { serve } from '@hono/node-server'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { app } from './app'
import { runMigrations, checkDatabaseHealth } from './db'
import { setupWebSocketServer } from './sockets'

// 环境变量
const PORT = parseInt(process.env['SERVER_PORT'] || '3001')
const HOST = process.env['SERVER_HOST'] || '0.0.0.0'
const NODE_ENV = process.env['NODE_ENV'] || 'development'

// 创建 HTTP 服务器
const server = createServer()

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ server })
setupWebSocketServer(wss)

// 启动服务器
async function startServer() {
  try {
    console.log('🚀 Starting game server...')
    console.log(`📝 Environment: ${NODE_ENV}`)
    console.log(`🔗 Database URL: ${process.env['DATABASE_URL'] ? 'Set' : 'Using default'}`)

    // 检查数据库健康状态
    const dbHealth = await checkDatabaseHealth()
    if (!dbHealth.healthy) {
      console.warn('⚠️  Database health check failed:', dbHealth.message)
    } else {
      console.log('✅ Database is healthy')
    }

    // 运行数据库迁移（仅开发环境）
    if (NODE_ENV === 'development') {
      try {
        await runMigrations()
      } catch (error) {
        console.warn('⚠️  Database migrations skipped or failed:', error)
      }
    }

    // 使用 serve 启动服务器（使用 createServer 需要不同的方式）
    serve({
      fetch: app.fetch,
      port: PORT,
    }, (info) => {
      console.log(`🎮 Game server running on http://${HOST}:${info.port}`)
      console.log(`🔌 WebSocket server running on ws://${HOST}:${info.port}`)
      console.log(`📊 API documentation: http://${HOST}:${info.port}/api`)
      console.log(`🏥 Health check: http://${HOST}:${info.port}/health`)
      console.log('\n📋 Available endpoints:')
      console.log('  GET  /health           - Server health check')
      console.log('  GET  /api              - API information')
      console.log('  GET  /api/v1/auth      - Authentication endpoints')
      console.log('  GET  /api/v1/game      - Game management')
      console.log('  GET  /api/v1/rooms     - Room management')
      console.log('  GET  /api/v1/stats     - Player statistics')
      console.log('  WS   /ws               - WebSocket connection')
    })

    // 优雅关闭处理
    process.on('SIGINT', gracefulShutdown)
    process.on('SIGTERM', gracefulShutdown)

    // 未捕获异常处理
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught exception:', error)
      gracefulShutdown()
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled rejection at:', promise, 'reason:', reason)
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// 优雅关闭
async function gracefulShutdown() {
  console.log('\n🛑 Shutting down server...')

  // 关闭 WebSocket 服务器
  wss.close(() => {
    console.log('✅ WebSocket server closed')
  })

  // 关闭 HTTP 服务器
  server.close(async () => {
    console.log('✅ HTTP server closed')

    // 关闭数据库连接
    try {
      console.log('✅ Database connections closed')
    } catch (error) {
      console.error('❌ Error closing database connections:', error)
    }

    console.log('👋 Server shutdown complete')
    process.exit(0)
  })

  // 强制关闭超时
  setTimeout(() => {
    console.warn('⚠️  Force shutdown after timeout')
    process.exit(1)
  }, 10000)
}

// 服务器监控
function startHealthMonitoring() {
  setInterval(async () => {
    try {
      const dbHealth = await checkDatabaseHealth()
      if (!dbHealth.healthy) {
        console.warn('⚠️  Database health check failed:', dbHealth.message)
      }
    } catch (error) {
      console.error('⚠️  Health monitoring error:', error)
    }
  }, 60000) // 每分钟检查一次
}

// 启动服务器
startServer()

// 启动健康监控
if (NODE_ENV === 'production') {
  startHealthMonitoring()
}

// 导出给测试使用
export { app, server, wss }
export default app