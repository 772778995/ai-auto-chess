import { createClient } from './client'
import { auth } from './auth'
import { game } from './game'
import { rooms } from './rooms'
import { stats } from './stats'
import { ws } from './websocket'

// 创建 API 客户端
const client = createClient()

// API 模块
export const api = {
  auth: auth(client),
  game: game(client),
  rooms: rooms(client),
  stats: stats(client),
  ws,
}

// 导出类型
export type { ApiClient } from './client'
export type { AuthApi } from './auth'
export type { GameApi } from './game'
export type { RoomsApi } from './rooms'
export type { StatsApi } from './stats'

// 默认导出
export default api