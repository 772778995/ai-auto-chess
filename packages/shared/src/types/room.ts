import { z } from 'zod'

export interface RoomPlayer {
  id: string
  username: string
  isReady: boolean
  joinedAt: number
}

export interface RoomInfo {
  id: string
  name: string
  hostId: string
  maxPlayers: number
  players: Record<string, RoomPlayer>
  status: 'waiting' | 'playing' | 'ended'
  currentGameId?: string
  createdAt: number
  startedAt?: number
  endedAt?: number
}

export const roomPlayerSchema = z.object({
  id: z.string(),
  username: z.string(),
  isReady: z.boolean(),
  joinedAt: z.number(),
})

export const roomInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  hostId: z.string(),
  maxPlayers: z.number(),
  players: z.record(roomPlayerSchema),
  status: z.enum(['waiting', 'playing', 'ended']),
  currentGameId: z.string().optional(),
  createdAt: z.number(),
  startedAt: z.number().optional(),
  endedAt: z.number().optional(),
})

export type RoomInfoType = z.infer<typeof roomInfoSchema>
