import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { compress } from 'hono/compress'
import { HTTPException } from 'hono/http-exception'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

// 导入共享类型
import type { ApiResponse } from '@game/shared'

// 创建 Hono 应用
const app = new Hono<{
  Variables: {
    // 自定义上下文变量
    userId?: string
    sessionId?: string
    requestStartTime: number
  }
}>()

// 中间件
app.use('*', logger())
app.use('*', compress())
app.use('*', prettyJSON())
app.use('*', cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// 请求时间追踪中间件
app.use('*', async (c, next) => {
  c.set('requestStartTime', Date.now())
  await next()
})

// 错误处理中间件
app.onError((err, c) => {
  console.error('Server error:', err)

  const statusCode = err instanceof HTTPException ? err.status : 500
  const message = err instanceof HTTPException ? err.message : 'Internal Server Error'

  const response: ApiResponse = {
    success: false,
    data: null,
    error: message,
    timestamp: Date.now(),
  }

  return c.json(response, statusCode as ContentfulStatusCode)
})

// 404 处理
app.notFound((c) => {
  const response: ApiResponse = {
    success: false,
    data: null,
    error: 'Route not found',
    timestamp: Date.now(),
  }

  return c.json(response, 404)
})

// 健康检查路由
app.get('/health', (c) => {
  const response: ApiResponse<{ status: string; timestamp: number }> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: Date.now(),
    },
    error: null,
    timestamp: Date.now(),
  }

  return c.json(response)
})

// API 信息路由
app.get('/api', (c) => {
  const response: ApiResponse<{
    name: string
    version: string
    description: string
    endpoints: string[]
  }> = {
    success: true,
    data: {
      name: 'Game Server API',
      version: '0.1.0',
      description: 'A modern game server with WebSocket support',
      endpoints: [
        '/health',
        '/api',
        '/api/v1/auth',
        '/api/v1/game',
        '/api/v1/rooms',
        '/api/v1/stats',
        '/ws', // WebSocket endpoint
      ],
    },
    error: null,
    timestamp: Date.now(),
  }

  return c.json(response)
})

// API 版本前缀
const api = new Hono()
app.route('/api/v1', api)

// 工具函数：创建成功响应
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    timestamp: Date.now(),
  }
}

// 工具函数：创建错误响应
export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    data: null,
    error,
    timestamp: Date.now(),
  }
}

// 工具函数：验证请求体
export async function validateRequest<T>(
  c: Context,
  schema: any
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await c.req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', '),
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON body',
    }
  }
}

// 导出应用
export { app, api }
export type AppType = typeof app