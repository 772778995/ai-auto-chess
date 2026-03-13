// packages/server/src/systems/CampaignManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { CampaignManager } from './CampaignManager'
import { createMemoryRedisClient } from '../redis/memory-client'

describe('CampaignManager', () => {
  let manager: CampaignManager
  let redis: ReturnType<typeof createMemoryRedisClient>

  beforeEach(async () => {
    redis = createMemoryRedisClient()
    await redis.connect()
    manager = new CampaignManager(redis)
  })

  it('should create new campaign', async () => {
    const progress = await manager.createCampaign('user-1')
    expect(progress.userId).toBe('user-1')
    expect(progress.currentLevel).toBe(1)
    expect(progress.maxHealth).toBe(40)
    expect(progress.currentHealth).toBe(40)
    expect(progress.gold).toBe(6)
    expect(progress.followers).toEqual([])
    expect(progress.equipment).toEqual([])
    expect(progress.spells).toEqual([])
    expect(progress.isVictory).toBe(false)
    expect(progress.isDefeated).toBe(false)
  })

  it('should get campaign progress', async () => {
    await manager.createCampaign('user-2')
    const progress = await manager.getCampaign('user-2')
    expect(progress).not.toBeNull()
    expect(progress!.currentLevel).toBe(1)
    expect(progress!.currentHealth).toBe(40)
    expect(progress!.gold).toBe(6)
  })

  it('should return null for non-existent campaign', async () => {
    const progress = await manager.getCampaign('non-existent-user')
    expect(progress).toBeNull()
  })

  it('should update health after battle', async () => {
    await manager.createCampaign('user-3')
    const newHealth = await manager.updateHealth('user-3', -10)
    expect(newHealth).toBe(30)
    
    const progress = await manager.getCampaign('user-3')
    expect(progress!.currentHealth).toBe(30)
  })

  it('should mark defeated when health <= 0', async () => {
    await manager.createCampaign('user-4')
    await manager.updateHealth('user-4', -40)
    
    const progress = await manager.getCampaign('user-4')
    expect(progress!.currentHealth).toBe(0)
    expect(progress!.isDefeated).toBe(true)
  })

  it('should advance to next level', async () => {
    await manager.createCampaign('user-5')
    await manager.advanceLevel('user-5', 'game-123')
    
    const progress = await manager.getCampaign('user-5')
    expect(progress!.currentLevel).toBe(2)
    expect(progress!.currentGameId).toBe('game-123')
  })

  it('should update gold', async () => {
    await manager.createCampaign('user-6')
    const newGold = await manager.updateGold('user-6', 10)
    expect(newGold).toBe(16)
    
    const progress = await manager.getCampaign('user-6')
    expect(progress!.gold).toBe(16)
  })

  it('should set victory', async () => {
    await manager.createCampaign('user-7')
    await manager.advanceLevel('user-7', 'game-456')
    await manager.setVictory('user-7')
    
    const progress = await manager.getCampaign('user-7')
    expect(progress!.isVictory).toBe(true)
    expect(progress!.currentGameId).toBeNull()
  })

  it('should delete campaign', async () => {
    await manager.createCampaign('user-8')
    await manager.deleteCampaign('user-8')
    
    const progress = await manager.getCampaign('user-8')
    expect(progress).toBeNull()
  })

  it('should add follower', async () => {
    await manager.createCampaign('user-9')
    await manager.addFollower('user-9', 'follower-001')
    
    const progress = await manager.getCampaign('user-9')
    expect(progress!.followers.length).toBe(1)
    expect(progress!.followers[0]).toEqual({ id: 'follower-001' })
  })
})
