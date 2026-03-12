// packages/shared/src/utils/follower.test.ts
import { describe, it, expect } from 'vitest'
import { getCurrentStats, clearTemporaryStatus, addStatus, getMaxHealth, isDead } from './follower'
import type { FollowerInstance, StatusItem, BattlePosition } from '../types/follower'

describe('getCurrentStats', () => {
  it('应计算随从基础属性（无状态）', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const stats = getCurrentStats(follower)

    expect(stats.attack).toBe(3)
    expect(stats.maxHealth).toBe(4)
    expect(stats.shield).toBe(0)
    expect(stats.damageBonus).toBe(0)
    expect(stats.currentHealth).toBe(4)
  })

  it('应包含状态加成', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 5,
      statusList: [
        { attack: 2, health: 1, shield: 1, damageBonus: 1, permanent: true, source: '成长' }
      ],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const stats = getCurrentStats(follower)

    expect(stats.attack).toBe(5) // 3 + 2
    expect(stats.maxHealth).toBe(5) // 4 + 1
    expect(stats.shield).toBe(1)
    expect(stats.damageBonus).toBe(1)
    expect(stats.currentHealth).toBe(5)
  })

  it('应累加多个状态', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 6,
      statusList: [
        { attack: 2, health: 1, permanent: true, source: '成长' },
        { attack: 1, health: 1, permanent: true, source: '击杀' }
      ],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const stats = getCurrentStats(follower)

    expect(stats.attack).toBe(6) // 3 + 2 + 1
    expect(stats.maxHealth).toBe(6) // 4 + 1 + 1
  })
})

describe('clearTemporaryStatus', () => {
  it('应清除临时状态', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [
        { attack: 2, permanent: true, source: '成长' },
        { attack: 1, permanent: false, source: '临时buff' }
      ],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const result = clearTemporaryStatus(follower)

    expect(result.statusList.length).toBe(1)
    expect(result.statusList[0].permanent).toBe(true)
    expect(result.statusList[0].source).toBe('成长')
  })

  it('应不修改原始对象', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [
        { attack: 1, permanent: false, source: '临时' }
      ],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const originalLength = follower.statusList.length
    clearTemporaryStatus(follower)

    expect(follower.statusList.length).toBe(originalLength)
  })
})

describe('addStatus', () => {
  it('应添加新状态', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const result = addStatus(follower, { attack: 2, permanent: true, source: '成长' })

    expect(result.statusList.length).toBe(1)
    expect(result.statusList[0].attack).toBe(2)
    expect(result.statusList[0].permanent).toBe(true)
    expect(result.statusList[0].source).toBe('成长')
  })

  it('应保留原有状态', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [
        { health: 1, permanent: true, source: '初始' }
      ],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const result = addStatus(follower, { attack: 2, permanent: true, source: '成长' })

    expect(result.statusList.length).toBe(2)
    expect(result.statusList[0].health).toBe(1)
    expect(result.statusList[1].attack).toBe(2)
  })

  it('应不修改原始对象', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    const originalLength = follower.statusList.length
    addStatus(follower, { attack: 2, permanent: true, source: '成长' })

    expect(follower.statusList.length).toBe(originalLength)
  })
})

describe('getMaxHealth', () => {
  it('应返回基础生命值', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    expect(getMaxHealth(follower)).toBe(4)
  })

  it('应包含生命加成', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 4,
      statusList: [
        { health: 2, permanent: true, source: '成长' },
        { health: 1, permanent: true, source: '击杀' }
      ],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    expect(getMaxHealth(follower)).toBe(7) // 4 + 2 + 1
  })
})

describe('isDead', () => {
  it('当前血量为0时应返回true', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 0,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    expect(isDead(follower)).toBe(true)
  })

  it('当前血量小于0时应返回true', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: -1,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    expect(isDead(follower)).toBe(true)
  })

  it('当前血量大于0时应返回false', () => {
    const follower: FollowerInstance = {
      instanceId: 'f-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 3,
      baseHealth: 4,
      ownerId: 'player-1',
      position: { side: 'ally', x: 0, y: 0 } as BattlePosition,
      currentHealth: 1,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }

    expect(isDead(follower)).toBe(false)
  })
})