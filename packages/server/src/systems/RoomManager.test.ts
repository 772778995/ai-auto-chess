// packages/server/src/systems/RoomManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { RoomManager } from './RoomManager'
import { createMemoryRedisClient } from '../redis/memory-client'

describe('RoomManager', () => {
  let manager: RoomManager
  let redis: ReturnType<typeof createMemoryRedisClient>

  beforeEach(async () => {
    redis = createMemoryRedisClient()
    await redis.connect()
    manager = new RoomManager(redis)
  })

  it('should create room', async () => {
    const room = await manager.createRoom('host-1', 'Test Room', 4)
    expect(room.hostId).toBe('host-1')
    expect(room.name).toBe('Test Room')
    expect(room.maxPlayers).toBe(4)
    expect(room.status).toBe('waiting')
    expect(room.players[room.hostId]).toBeDefined()
  })

  it('should get room by id', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    const fetched = await manager.getRoom(room.id)
    expect(fetched).not.toBeNull()
    expect(fetched!.id).toBe(room.id)
    expect(fetched!.name).toBe('Test Room')
  })

  it('should add player to room', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    await manager.joinRoom(room.id, 'player-1', 'Alice')

    const updated = await manager.getRoom(room.id)
    expect(updated!.players['player-1'].username).toBe('Alice')
    expect(updated!.players['player-1'].isReady).toBe(false)
  })

  it('should set player ready', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    await manager.joinRoom(room.id, 'player-1', 'Alice')
    await manager.setPlayerReady(room.id, 'player-1', true)

    const updated = await manager.getRoom(room.id)
    expect(updated!.players['player-1'].isReady).toBe(true)
  })

  it('should track player room mapping', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    await manager.joinRoom(room.id, 'player-1', 'Alice')

    const roomId = await manager.getPlayerRoom('player-1')
    expect(roomId).toBe(room.id)
  })

  it('should start game', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    await manager.joinRoom(room.id, 'player-1', 'Alice')
    await manager.setPlayerReady(room.id, 'host-1', true)
    await manager.setPlayerReady(room.id, 'player-1', true)

    await manager.startGame(room.id, 'game-123')

    const updated = await manager.getRoom(room.id)
    expect(updated!.status).toBe('playing')
    expect(updated!.currentGameId).toBe('game-123')
    expect(updated!.startedAt).toBeDefined()
  })

  it('should end game', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    await manager.startGame(room.id, 'game-123')
    await manager.endGame(room.id)

    const updated = await manager.getRoom(room.id)
    expect(updated!.status).toBe('ended')
    expect(updated!.endedAt).toBeDefined()
  })

  it('should throw error when joining full room', async () => {
    const room = await manager.createRoom('host-1', 'Test Room', 2)
    await manager.joinRoom(room.id, 'player-1', 'Alice')

    // Room is now full (host + player-1)
    await expect(manager.joinRoom(room.id, 'player-2', 'Bob')).rejects.toThrow('Room is full')
  })

  it('should throw error when joining non-waiting room', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    await manager.startGame(room.id, 'game-123')

    await expect(manager.joinRoom(room.id, 'player-1', 'Alice')).rejects.toThrow('Game already started')
  })

  it('should remove player from room', async () => {
    const room = await manager.createRoom('host-1', 'Test Room')
    await manager.joinRoom(room.id, 'player-1', 'Alice')

    await manager.leaveRoom(room.id, 'player-1')

    const updated = await manager.getRoom(room.id)
    expect(updated!.players['player-1']).toBeUndefined()

    const playerRoom = await manager.getPlayerRoom('player-1')
    expect(playerRoom).toBeNull()
  })
})
