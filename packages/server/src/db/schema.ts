import { pgTable, text, integer, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { relations } from 'drizzle-orm'

// 用户表
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  isAdmin: boolean('is_admin').default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 用户关系
export const usersRelations = relations(users, ({ many }) => ({
  gameSessions: many(gameSessions),
  playerStats: many(playerStats),
}))

// 游戏会话表
export const gameSessions = pgTable('game_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id').notNull(),
  gameId: text('game_id'),
  status: text('status').default('active'),
  clientInfo: jsonb('client_info'),
  connectedAt: timestamp('connected_at').defaultNow().notNull(),
  disconnectedAt: timestamp('disconnected_at'),
  lastPingAt: timestamp('last_ping_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata'),
})

// 游戏会话关系
export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
}))

// 游戏房间表
export const gameRooms = pgTable('game_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomCode: text('room_code').notNull().unique(),
  name: text('name').notNull(),
  hostId: uuid('host_id').references(() => users.id),
  maxPlayers: integer('max_players').default(10),
  currentPlayers: integer('current_players').default(0),
  isPrivate: boolean('is_private').default(false),
  password: text('password'),
  gameState: jsonb('game_state'),
  config: jsonb('config'),
  status: text('status').default('waiting'), // waiting, playing, finished
  startedAt: timestamp('started_at'),
  finishedAt: timestamp('finished_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 游戏房间关系
export const gameRoomsRelations = relations(gameRooms, ({ many, one }) => ({
  host: one(users, {
    fields: [gameRooms.hostId],
    references: [users.id],
  }),
  roomPlayers: many(roomPlayers),
}))

// 房间玩家表
export const roomPlayers = pgTable('room_players', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => gameRooms.id),
  userId: uuid('user_id').references(() => users.id),
  playerIndex: integer('player_index'),
  isReady: boolean('is_ready').default(false),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  leftAt: timestamp('left_at'),
  metadata: jsonb('metadata'),
})

// 房间玩家关系
export const roomPlayersRelations = relations(roomPlayers, ({ one }) => ({
  room: one(gameRooms, {
    fields: [roomPlayers.roomId],
    references: [gameRooms.id],
  }),
  user: one(users, {
    fields: [roomPlayers.userId],
    references: [users.id],
  }),
}))

// 玩家统计表
export const playerStats = pgTable('player_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  gameId: text('game_id').notNull(),
  totalGames: integer('total_games').default(0),
  wins: integer('wins').default(0),
  losses: integer('losses').default(0),
  draws: integer('draws').default(0),
  totalPlayTime: integer('total_play_time').default(0), // 秒
  totalScore: integer('total_score').default(0),
  maxScore: integer('max_score').default(0),
  kills: integer('kills').default(0),
  deaths: integer('deaths').default(0),
  assists: integer('assists').default(0),
  lastPlayedAt: timestamp('last_played_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 玩家统计关系
export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  user: one(users, {
    fields: [playerStats.userId],
    references: [users.id],
  }),
}))

// 玩家闯关进度表
export const playerProgress = pgTable('player_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),

  // 关卡解锁进度
  highestClearedLevel: integer('highest_cleared_level').default(0).notNull(), // 最高通关关卡
  unlockedLevels: integer('unlocked_levels').array().default([1]).notNull(), // 已解锁关卡列表

  // 难度解锁
  unlockedDifficulties: text('unlocked_difficulties').array().default(['normal']).notNull(),

  // 元数据
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 玩家进度关系
export const playerProgressRelations = relations(playerProgress, ({ one }) => ({
  user: one(users, {
    fields: [playerProgress.userId],
    references: [users.id],
  }),
}))

// 游戏事件表
export const gameEvents = pgTable('game_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => gameRooms.id),
  userId: uuid('user_id').references(() => users.id),
  eventType: text('event_type').notNull(),
  eventData: jsonb('event_data').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  metadata: jsonb('metadata'),
})

// Zod 模式
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3).max(32),
  email: z.string().email(),
  displayName: z.string().min(1).max(64).optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
  })
  .extend({
    password: z.string().min(8),
  })

export const selectUserSchema = createSelectSchema(users).omit({
  hashedPassword: true,
})

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  connectedAt: true,
  disconnectedAt: true,
  lastPingAt: true,
})

export const insertGameRoomSchema = createInsertSchema(gameRooms).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  finishedAt: true,
  currentPlayers: true,
})

export const insertRoomPlayerSchema = createInsertSchema(roomPlayers).omit({
  id: true,
  joinedAt: true,
  leftAt: true,
})

export const insertPlayerProgressSchema = createInsertSchema(playerProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const selectPlayerProgressSchema = createSelectSchema(playerProgress)

// 导出的类型
export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
export type GameSession = typeof gameSessions.$inferSelect
export type InsertGameSession = typeof gameSessions.$inferInsert
export type GameRoom = typeof gameRooms.$inferSelect
export type InsertGameRoom = typeof gameRooms.$inferInsert
export type RoomPlayer = typeof roomPlayers.$inferSelect
export type InsertRoomPlayer = typeof roomPlayers.$inferInsert
export type PlayerStats = typeof playerStats.$inferSelect
export type GameEvent = typeof gameEvents.$inferSelect
export type PlayerProgress = typeof playerProgress.$inferSelect
export type InsertPlayerProgress = typeof playerProgress.$inferInsert