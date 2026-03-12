import type { Follower, FollowerInstance, EffectContext } from '../types/follower'
import { defaultOnAttack } from '../utils/effects'

// 1星随从
export const FOLLOWERS_1STAR: Record<string, Follower> = {
  'F001': {
    id: 'F001',
    name: '小狼',
    description: '',
    level: 1,
    baseAttack: 2,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f001.png'
  },

  'F002': {
    id: 'F002',
    name: '刺客学徒',
    description: '击杀后获得+1/+1',
    level: 1,
    baseAttack: 1,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onKill: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 1, health: 1, permanent: true, source: '击杀效果' })
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f002.png'
  },

  'F003': {
    id: 'F003',
    name: '火焰精灵',
    description: '入场时对随机敌人造成2点伤害',
    level: 1,
    baseAttack: 2,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
        if (target) {
          target.currentHealth -= 2
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f003.png'
  },

  'F004': {
    id: 'F004',
    name: '铁皮猪',
    description: '',
    level: 1,
    baseAttack: 1,
    baseHealth: 3,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f004.png'
  },

  'F005': {
    id: 'F005',
    name: '持盾新兵',
    description: '入场获得护盾',
    level: 1,
    baseAttack: 1,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f005.png'
  },

  'F006': {
    id: 'F006',
    name: '嘲讽石像',
    description: '嘲讽',
    level: 1,
    baseAttack: 0,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f006.png'
  },

  'F007': {
    id: 'F007',
    name: '种子精灵',
    description: '成长+1/+1',
    level: 1,
    baseAttack: 1,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 1, health: 1, permanent: true, source: '成长效果' })
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f007.png'
  },

  'F008': {
    id: 'F008',
    name: '幼龙',
    description: '成长+1攻击',
    level: 1,
    baseAttack: 1,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 1, permanent: true, source: '成长效果' })
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f008.png'
  },

  'F009': {
    id: 'F009',
    name: '母蜘蛛',
    description: '遗言召唤1/1蜘蛛',
    level: 1,
    baseAttack: 1,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onDeath: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f009.png'
  },

  'F010': {
    id: 'F010',
    name: '分裂史莱姆',
    description: '遗言召唤2个1/1史莱姆',
    level: 1,
    baseAttack: 1,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack],
      onDeath: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f010.png'
  },

  'F011': {
    id: 'F011',
    name: '信鸽',
    description: '入场获得随机随从',
    level: 1,
    baseAttack: 1,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f011.png'
  },

  'F012': {
    id: 'F012',
    name: '商人学徒',
    description: '卖出获得1金币',
    level: 1,
    baseAttack: 1,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f012.png'
  }
}