// packages/server/src/systems/RoomManager.ts
import type { RoomInfo, RoomPlayer } from '@game/shared'

interface RedisClient {
  json: {
    set(key: string, path: string, value: unknown): Promise<unknown>
    get(key: string, path?: string): Promise<unknown>
    del(key: string, path: string): Promise<number>
  }
  set(key: string, value: string): Promise<string | null>
  get(key: string): Promise<string | null>
  del(key: string): Promise<number>
}

export class RoomManager {
  constructor(private redis: RedisClient) {}

  async createRoom(
    hostId: string,
    name: string,
    maxPlayers: number = 8
  ): Promise<RoomInfo> {
    const roomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const room: RoomInfo = {
      id: roomId,
      name,
      hostId,
      maxPlayers,
      players: {},
      status: 'waiting',
      createdAt: Date.now()
    }

    await this.redis.json.set(`room:${roomId}`, '.', room)

    // 自动添加 host 为玩家
    await this.joinRoom(roomId, hostId, `Player_${hostId.slice(0, 6)}`)

    return room
  }

  async getRoom(roomId: string): Promise<RoomInfo | null> {
    const result = await this.redis.json.get(`room:${roomId}`)
    return result as RoomInfo | null
  }

  async joinRoom(roomId: string, playerId: string, username: string): Promise<void> {
    const room = await this.getRoom(roomId)
    if (!room) throw new Error('Room not found')
    if (room.status !== 'waiting') throw new Error('Game already started')
    if (Object.keys(room.players).length >= room.maxPlayers) {
      throw new Error('Room is full')
    }

    const player: RoomPlayer = {
      id: playerId,
      username,
      isReady: false,
      joinedAt: Date.now()
    }

    await this.redis.json.set(`room:${roomId}`, `.players.${playerId}`, player)
    await this.redis.set(`player-room:${playerId}`, roomId)
  }

  async leaveRoom(roomId: string, playerId: string): Promise<void> {
    await this.redis.json.del(`room:${roomId}`, `.players.${playerId}`)
    await this.redis.del(`player-room:${playerId}`)
  }

  async setPlayerReady(roomId: string, playerId: string, ready: boolean): Promise<void> {
    await this.redis.json.set(
      `room:${roomId}`,
      `.players.${playerId}.isReady`,
      ready
    )
  }

  async startGame(roomId: string, gameId: string): Promise<void> {
    await this.redis.json.set(`room:${roomId}`, '.status', 'playing')
    await this.redis.json.set(`room:${roomId}`, '.currentGameId', gameId)
    await this.redis.json.set(`room:${roomId}`, '.startedAt', Date.now())
  }

  async endGame(roomId: string): Promise<void> {
    await this.redis.json.set(`room:${roomId}`, '.status', 'ended')
    await this.redis.json.set(`room:${roomId}`, '.endedAt', Date.now())
  }

  async getPlayerRoom(playerId: string): Promise<string | null> {
    return this.redis.get(`player-room:${playerId}`)
  }
}
