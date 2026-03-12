import type { Follower, FollowerInstance, EffectContext } from '../types/follower'
import { defaultOnAttack } from '../utils/effects'

// 5星随从
export const FOLLOWERS_5STAR: Record<string, Follower> = {
  'F044': {
    id: 'F044',
    name: '毁灭者',
    description: '先手+5/+5',
    level: 5,
    baseAttack: 8,
    baseHealth: 5,
    effects: {
      onAttack: [defaultOnAttack],
      onFirstStrike: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 5, health: 5, permanent: false, source: '先手效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f044.png'
  },

  'F045': {
    id: 'F045',
    name: '死神',
    description: '击杀消灭目标',
    level: 5,
    baseAttack: 5,
    baseHealth: 5,
    effects: {
      onAttack: [defaultOnAttack],
      onKill: [(ctx: EffectContext) => {
        // TODO: 实现消灭逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f045.png'
  },

  'F046': {
    id: 'F046',
    name: '泰坦',
    description: '嘲讽, 护盾',
    level: 5,
    baseAttack: 4,
    baseHealth: 10,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
          self.taunt = true
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f046.png'
  },

  'F047': {
    id: 'F047',
    name: '守护神',
    description: '光环全场+2/+2',
    level: 5,
    baseAttack: 3,
    baseHealth: 8,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f047.png'
  },

  'F048': {
    id: 'F048',
    name: '世界树',
    description: '成长+4/+4',
    level: 5,
    baseAttack: 4,
    baseHealth: 6,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 4, health: 4, permanent: true, source: '成长效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f048.png'
  },

  'F049': {
    id: 'F049',
    name: '凤凰',
    description: '成长满血复活',
    level: 5,
    baseAttack: 5,
    baseHealth: 5,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.currentHealth = self.baseHealth +
            self.statusList.reduce((sum, s) => sum + (s.health ?? 0), 0)
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f049.png'
  },

  'F050': {
    id: 'F050',
    name: '亡灵之王',
    description: '入场召唤所有本局死亡的随从',
    level: 5,
    baseAttack: 5,
    baseHealth: 6,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f050.png'
  },

  'F051': {
    id: 'F051',
    name: '虚空行者',
    description: '遗言召唤5/5虚空兽',
    level: 5,
    baseAttack: 4,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onDeath: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f051.png'
  },

  'F052': {
    id: 'F052',
    name: '时钟女士',
    description: '先手全场+2/+2',
    level: 5,
    baseAttack: 4,
    baseHealth: 5,
    effects: {
      onAttack: [defaultOnAttack],
      onFirstStrike: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const allies = ctx.tools.getAllAllies(newState)
        for (const ally of allies) {
          ally.statusList.push({ attack: 2, health: 2, permanent: false, source: '先手效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f052.png'
  },

  'F053': {
    id: 'F053',
    name: '命运女神',
    description: '入场发现3张5星随从',
    level: 5,
    baseAttack: 3,
    baseHealth: 5,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f053.png'
  }
}