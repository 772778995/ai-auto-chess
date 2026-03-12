import type { Follower, FollowerInstance, EffectContext } from '../types/follower'
import { defaultOnAttack } from '../utils/effects'

// 2星随从
export const FOLLOWERS_2STAR: Record<string, Follower> = {
  'F013': {
    id: 'F013',
    name: '剑客',
    description: '',
    level: 2,
    baseAttack: 3,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f013.png'
  },

  'F014': {
    id: 'F014',
    name: '狂战士',
    description: '疯狂',
    level: 2,
    baseAttack: 4,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 疯狂是静态属性，需要在 FollowerInstance 中标记
        return ctx.tools.cloneDeep(ctx.gameState)
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f014.png'
  },

  'F015': {
    id: 'F015',
    name: '暗杀者',
    description: '先手+2攻击',
    level: 2,
    baseAttack: 2,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onFirstStrike: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, permanent: false, source: '先手效果' })
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f015.png'
  },

  'F016': {
    id: 'F016',
    name: '铁甲卫兵',
    description: '嘲讽',
    level: 2,
    baseAttack: 2,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f016.png'
  },

  'F017': {
    id: 'F017',
    name: '圣盾骑士',
    description: '护盾',
    level: 2,
    baseAttack: 2,
    baseHealth: 3,
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
    imageUrl: '/assets/followers/f017.png'
  },

  'F018': {
    id: 'F018',
    name: '森林守卫',
    description: '成长+2/+1',
    level: 2,
    baseAttack: 2,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, health: 1, permanent: true, source: '成长效果' })
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f018.png'
  },

  'F019': {
    id: 'F019',
    name: '火焰幼龙',
    description: '成长+2攻击',
    level: 2,
    baseAttack: 2,
    baseHealth: 1,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, permanent: true, source: '成长效果' })
        }
        return newState
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f019.png'
  },

  'F020': {
    id: 'F020',
    name: '亡灵召唤师',
    description: '遗言召唤2/2亡灵',
    level: 2,
    baseAttack: 2,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onDeath: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f020.png'
  },

  'F021': {
    id: 'F021',
    name: '麦田傀儡',
    description: '遗言召唤2个1/1稻草人',
    level: 2,
    baseAttack: 2,
    baseHealth: 3,
    effects: {
      onAttack: [defaultOnAttack],
      onDeath: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f021.png'
  },

  'F022': {
    id: 'F022',
    name: '鉴赏家',
    description: '卖出商店+1星',
    level: 2,
    baseAttack: 1,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f022.png'
  },

  'F023': {
    id: 'F023',
    name: '大厨',
    description: '卖出获得随机咒术',
    level: 2,
    baseAttack: 1,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f023.png'
  }
}