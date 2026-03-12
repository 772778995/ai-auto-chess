// packages/shared/src/utils/effects.test.ts
import { describe, it, expect } from 'vitest'
import { defaultOnAttack, defaultOnTakeDamage } from './effects'
import type { EffectContext, FollowerInstance, BattlePosition, DamageEvent } from '../types/follower'

describe('defaultOnAttack', () => {
  it('应对随机敌人造成等同于攻击力的伤害', () => {
    const attacker: FollowerInstance = {
      instanceId: 'attacker-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 5,
      baseHealth: 3,
      ownerId: 'player-a',
      position: { side: 'ally', x: 0, y: 0 },
      currentHealth: 3,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }
    
    const target: FollowerInstance = {
      instanceId: 'target-1',
      id: 'F002',
      name: '敌人',
      description: '',
      level: 1,
      baseAttack: 2,
      baseHealth: 5,
      ownerId: 'player-b',
      position: { side: 'enemy', x: 0, y: 0 },
      currentHealth: 5,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }
    
    const gameState = {
      allies: [attacker],
      enemies: [target]
    }
    
    const ctx: EffectContext = {
      gameState,
      self: attacker,
      tools: {
        cloneDeep: <T>(obj: T) => JSON.parse(JSON.stringify(obj)),
        getRandomEnemy: () => target,
        getRandomAlly: () => null,
        getAllAllies: () => [attacker],
        getAllEnemies: () => [target],
        getColumnAllies: () => []
      }
    }
    
    const result = defaultOnAttack(ctx)
    
    expect(result.events).toBeDefined()
    expect(result.events!.length).toBe(1)
    expect(result.events![0].type).toBe('damage')
    
    const damageEvent = result.events![0] as DamageEvent
    expect(damageEvent.targets.length).toBe(1)
    expect(damageEvent.value).toBe(5)
    expect(damageEvent.damageType).toBe('physical')
    expect(damageEvent.source?.instanceId).toBe('attacker-1')
  })
  
  it('无敌人时应返回空事件', () => {
    const attacker: FollowerInstance = {
      instanceId: 'attacker-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 5,
      baseHealth: 3,
      ownerId: 'player-a',
      position: { side: 'ally', x: 0, y: 0 },
      currentHealth: 3,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }
    
    const gameState = {
      allies: [attacker],
      enemies: []
    }
    
    const ctx: EffectContext = {
      gameState,
      self: attacker,
      tools: {
        cloneDeep: <T>(obj: T) => JSON.parse(JSON.stringify(obj)),
        getRandomEnemy: () => null,
        getRandomAlly: () => null,
        getAllAllies: () => [attacker],
        getAllEnemies: () => [],
        getColumnAllies: () => []
      }
    }
    
    const result = defaultOnAttack(ctx)
    
    expect(result.events).toBeUndefined()
  })
  
  it('应计算增伤效果', () => {
    const attacker: FollowerInstance = {
      instanceId: 'attacker-1',
      id: 'F001',
      name: '小狼',
      description: '',
      level: 1,
      baseAttack: 5,
      baseHealth: 3,
      ownerId: 'player-a',
      position: { side: 'ally', x: 0, y: 0 },
      currentHealth: 3,
      statusList: [{ damageBonus: 3, permanent: true, source: '装备' }],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }
    
    const target: FollowerInstance = {
      instanceId: 'target-1',
      id: 'F002',
      name: '敌人',
      description: '',
      level: 1,
      baseAttack: 2,
      baseHealth: 10,
      ownerId: 'player-b',
      position: { side: 'enemy', x: 0, y: 0 },
      currentHealth: 10,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }
    
    const gameState = {
      allies: [attacker],
      enemies: [target]
    }
    
    const ctx: EffectContext = {
      gameState,
      self: attacker,
      tools: {
        cloneDeep: <T>(obj: T) => JSON.parse(JSON.stringify(obj)),
        getRandomEnemy: () => target,
        getRandomAlly: () => null,
        getAllAllies: () => [attacker],
        getAllEnemies: () => [target],
        getColumnAllies: () => []
      }
    }
    
    const result = defaultOnAttack(ctx)
    
    expect(result.events).toBeDefined()
    const damageEvent = result.events![0] as DamageEvent
    expect(damageEvent.value).toBe(8) // 5 攻击 + 3 增伤
  })
})

describe('defaultOnTakeDamage', () => {
  it('应扣除目标当前血量', () => {
    const target: FollowerInstance = {
      instanceId: 'target-1',
      id: 'F002',
      name: '敌人',
      description: '',
      level: 1,
      baseAttack: 2,
      baseHealth: 5,
      ownerId: 'player-a',
      position: { side: 'ally', x: 0, y: 0 },
      currentHealth: 5,
      statusList: [],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }
    
    const gameState = {
      allies: [target],
      enemies: []
    }
    
    const damageEvent: DamageEvent = {
      type: 'damage',
      targets: [target],
      value: 3,
      damageType: 'physical'
    }
    
    const ctx: EffectContext = {
      gameState,
      self: target,
      tools: {
        cloneDeep: <T>(obj: T) => JSON.parse(JSON.stringify(obj)),
        getRandomEnemy: () => null,
        getRandomAlly: () => null,
        getAllAllies: () => [target],
        getAllEnemies: () => [],
        getColumnAllies: () => []
      },
      event: damageEvent
    }
    
    const result = defaultOnTakeDamage(ctx)
    
    const newAllies = (result.gameState as { allies: FollowerInstance[] }).allies
    expect(newAllies[0].currentHealth).toBe(2)
  })
  
  it('有护盾时应消耗护盾而不扣血', () => {
    const target: FollowerInstance = {
      instanceId: 'target-1',
      id: 'F002',
      name: '持盾随从',
      description: '',
      level: 1,
      baseAttack: 2,
      baseHealth: 5,
      ownerId: 'player-a',
      position: { side: 'ally', x: 0, y: 0 },
      currentHealth: 5,
      statusList: [{ shield: 1, permanent: true, source: '入场护盾' }],
      equipment: [],
      equipmentSlots: 2,
      imageUrl: ''
    }
    
    const gameState = {
      allies: [target],
      enemies: []
    }
    
    const damageEvent: DamageEvent = {
      type: 'damage',
      targets: [target],
      value: 3,
      damageType: 'physical'
    }
    
    const ctx: EffectContext = {
      gameState,
      self: target,
      tools: {
        cloneDeep: <T>(obj: T) => JSON.parse(JSON.stringify(obj)),
        getRandomEnemy: () => null,
        getRandomAlly: () => null,
        getAllAllies: () => [target],
        getAllEnemies: () => [],
        getColumnAllies: () => []
      },
      event: damageEvent
    }
    
    const result = defaultOnTakeDamage(ctx)
    
    const newAllies = (result.gameState as { allies: FollowerInstance[] }).allies
    expect(newAllies[0].currentHealth).toBe(5) // 血量不变
    expect(newAllies[0].statusList.length).toBe(0) // 护盾消耗
  })
})
