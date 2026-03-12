import { pgTable, text, integer, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { relations } from 'drizzle-orm'

// ===== 共用基础字段 =====

// id + createdAt + updatedAt（完整基础字段）
export const baseFields = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

// id + createdAt（无 updatedAt）
export const baseFieldsNoUpdate = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}

// 仅 id
export const idField = {
  id: uuid('id').primaryKey().defaultRandom(),
}

// ===== Zod Schema 辅助函数 =====

// 标准的 omit 字段（id + timestamps）
export const standardOmit = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const

// 仅 omit id 和 createdAt（无 updatedAt 的表）
export const noUpdateOmit = {
  id: true,
  createdAt: true,
} as const

// 创建标准的 insert schema（自动 omit id + timestamps）
export function createStandardInsertSchema<
  TTable extends Parameters<typeof createInsertSchema>[0]
>(table: TTable, extend?: Record<string, z.ZodTypeAny>) {
  return createInsertSchema(table, extend as any).omit(standardOmit as any)
}

// 创建仅 omit id + createdAt 的 insert schema
export function createNoUpdateInsertSchema<
  TTable extends Parameters<typeof createInsertSchema>[0]
>(table: TTable, extend?: Record<string, z.ZodTypeAny>) {
  return createInsertSchema(table, extend as any).omit(noUpdateOmit as any)
}

// 用户表
export const users = pgTable('users', {
  ...baseFields,
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  isAdmin: boolean('is_admin').default(false),
  lastLoginAt: timestamp('last_login_at'),
})

// 用户关系
export const usersRelations = relations(users, ({ many }) => ({
  gameSessions: many(gameSessions),
  playerStats: many(playerStats),
  gameSaves: many(gameSaves),
  campaignStats: many(campaignStats),
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

// 游戏存档表（单机闯关进行中的游戏）
export const gameSaves = pgTable('game_saves', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  // 存档基本信息
  saveName: text('save_name').notNull(),
  difficulty: text('difficulty').default('normal').notNull(), // normal, hard, nightmare

  // 游戏进度
  currentLevel: integer('current_level').notNull(), // 当前关卡（1-10）
  currentNode: integer('current_node').notNull(), // 当前节点在路线图中的位置

  // 玩家状态（JSON 存储完整游戏状态）
  heroId: text('hero_id').notNull(), // 选择的英雄
  health: integer('health').notNull(), // 当前生命
  maxHealth: integer('max_health').notNull(), // 最大生命
  gold: integer('gold').default(0).notNull(), // 金币

  // 卡组状态
  followers: jsonb('followers').notNull(), // 随从列表（包含实例状态）
  equipment: jsonb('equipment').array().default([]).notNull(), // 装备列表
  spells: jsonb('spells').array().default([]).notNull(), // 咒术列表

  // 路线图状态
  roadmapState: jsonb('roadmap_state').notNull(), // 路线图节点状态
  clearedNodes: integer('cleared_nodes').array().default([]).notNull(), // 已清除节点

  // 游戏统计
  totalBattles: integer('total_battles').default(0).notNull(),
  totalWins: integer('total_wins').default(0).notNull(),
  startTime: timestamp('start_time').defaultNow().notNull(),
  lastSaveTime: timestamp('last_save_time').defaultNow().notNull(),

  // 存档元数据
  isActive: boolean('is_active').default(true).notNull(), // 是否活跃存档
  isCompleted: boolean('is_completed').default(false).notNull(), // 是否已完成
  victory: boolean('victory').default(false).notNull(), // 是否胜利通关
})

// 游戏存档关系
export const gameSavesRelations = relations(gameSaves, ({ one }) => ({
  user: one(users, {
    fields: [gameSaves.userId],
    references: [users.id],
  }),
}))

// 闯关战绩统计表
export const campaignStats = pgTable('campaign_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  // 游戏标识
  saveId: uuid('save_id').references(() => gameSaves.id), // 关联存档（可选）
  difficulty: text('difficulty').notNull(),

  // 结果
  victory: boolean('victory').notNull(),
  clearedLevel: integer('cleared_level').notNull(), // 到达第几关

  // 详细统计
  totalBattles: integer('total_battles').default(0).notNull(),
  totalWins: integer('total_wins').default(0).notNull(),
  totalLosses: integer('total_losses').default(0).notNull(),

  // 经济统计
  totalGoldEarned: integer('total_gold_earned').default(0).notNull(),
  totalGoldSpent: integer('total_gold_spent').default(0).notNull(),

  // 战斗统计
  totalDamageDealt: integer('total_damage_dealt').default(0).notNull(),
  totalDamageTaken: integer('total_damage_taken').default(0).notNull(),
  totalKills: integer('total_kills').default(0).notNull(),

  // 卡牌统计
  followersRecruited: integer('followers_recruited').default(0).notNull(),
  equipmentAcquired: integer('equipment_acquired').default(0).notNull(),
  spellsCast: integer('spells_cast').default(0).notNull(),

  // 时间统计
  playTimeSeconds: integer('play_time_seconds').default(0).notNull(),
  startedAt: timestamp('started_at').notNull(),
  finishedAt: timestamp('finished_at'),

  // 元数据
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 战绩统计关系
export const campaignStatsRelations = relations(campaignStats, ({ one }) => ({
  user: one(users, {
    fields: [campaignStats.userId],
    references: [users.id],
  }),
  save: one(gameSaves, {
    fields: [campaignStats.saveId],
    references: [gameSaves.id],
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

// users 表有特殊验证逻辑：需要额外 omit lastLoginAt
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3).max(32),
  email: z.string().email(),
  displayName: z.string().min(1).max(64).optional(),
})
  .omit({
    ...standardOmit,
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

export const insertGameSaveSchema = createInsertSchema(gameSaves).omit({
  id: true,
  startTime: true,
  lastSaveTime: true,
})

export const selectGameSaveSchema = createSelectSchema(gameSaves)

export const insertCampaignStatsSchema = createInsertSchema(campaignStats).omit({
  id: true,
  createdAt: true,
  finishedAt: true,
})

export const selectCampaignStatsSchema = createSelectSchema(campaignStats)

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
export type GameSave = typeof gameSaves.$inferSelect
export type InsertGameSave = typeof gameSaves.$inferInsert
export type CampaignStat = typeof campaignStats.$inferSelect
export type InsertCampaignStat = typeof campaignStats.$inferInsert