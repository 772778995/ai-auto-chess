import { z } from 'zod'

// 基础游戏类型
export type Vector2 = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Rectangle = Vector2 & Size

// 玩家状态
export enum PlayerState {
  Idle = 'idle',
  Walking = 'walking',
  Running = 'running',
  Jumping = 'jumping',
  Attacking = 'attacking',
  Damaged = 'damaged',
  Dead = 'dead',
}

// 玩家方向
export enum PlayerDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

// 玩家数据
export type Player = {
  id: string
  username: string
  position: Vector2
  velocity: Vector2
  state: PlayerState
  direction: PlayerDirection
  health: number
  maxHealth: number
  score: number
  color: string
  lastUpdated: number
}

// 游戏对象
export type GameObject = {
  id: string
  type: string
  position: Vector2
  size: Size
  properties: Record<string, any>
}

// 游戏世界
export type GameWorld = {
  id: string
  name: string
  size: Size
  players: Record<string, Player>
  objects: Record<string, GameObject>
  physics: {
    gravity: number
    friction: number
  }
}

// 游戏状态
export type GameState = {
  world: GameWorld
  tick: number
  timestamp: number
  playerCount: number
}

// Zod 模式
export const vector2Schema = z.object({
  x: z.number(),
  y: z.number(),
})

export const sizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

export const rectangleSchema = vector2Schema.merge(sizeSchema)

export const playerStateSchema = z.nativeEnum(PlayerState)
export const playerDirectionSchema = z.nativeEnum(PlayerDirection)

export const playerSchema = z.object({
  id: z.string(),
  username: z.string().min(1).max(32),
  position: vector2Schema,
  velocity: vector2Schema,
  state: playerStateSchema,
  direction: playerDirectionSchema,
  health: z.number().min(0).max(100),
  maxHealth: z.number().min(1).max(1000),
  score: z.number().min(0),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  lastUpdated: z.number(),
})

export const gameObjectSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: vector2Schema,
  size: sizeSchema,
  properties: z.record(z.any()),
})

export const gameWorldSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: sizeSchema,
  players: z.record(playerSchema),
  objects: z.record(gameObjectSchema),
  physics: z.object({
    gravity: z.number(),
    friction: z.number(),
  }),
})

export const gameStateSchema = z.object({
  world: gameWorldSchema,
  tick: z.number(),
  timestamp: z.number(),
  playerCount: z.number(),
})

// 类型推断
export type Vector2Type = z.infer<typeof vector2Schema>
export type SizeType = z.infer<typeof sizeSchema>
export type RectangleType = z.infer<typeof rectangleSchema>
export type PlayerType = z.infer<typeof playerSchema>
export type GameObjectType = z.infer<typeof gameObjectSchema>
export type GameWorldType = z.infer<typeof gameWorldSchema>
export type GameStateType = z.infer<typeof gameStateSchema>