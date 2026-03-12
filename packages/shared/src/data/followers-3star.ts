import type { Follower, FollowerInstance, EffectContext } from '../types/follower'
import { defaultOnAttack } from '../utils/effects'

// 3星随从
export const FOLLOWERS_3STAR: Record<string, Follower> = {
  'F024': {
    id: 'F024',
    name: '狼王',
    description: '击杀+1/+1',
    level: 3,
    baseAttack: 4,
    baseHealth: 3,
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
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f024.png'
  },

  'F025': {
    id: 'F025',
    name: '双持剑士',
    description: '疯狂',
    level: 3,
    baseAttack: 3,
    baseHealth: 3,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f025.png'
  },

  'F026': {
    id: 'F026',
    name: '钢铁巨人',
    description: '嘲讽',
    level: 3,
    baseAttack: 3,
    baseHealth: 6,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f026.png'
  },

  'F027': {
    id: 'F027',
    name: '守护天使',
    description: '光环同列+1/+1',
    level: 3,
    baseAttack: 2,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f027.png'
  },

  'F028': {
    id: 'F028',
    name: '古树',
    description: '成长+2/+2',
    level: 3,
    baseAttack: 2,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, health: 2, permanent: true, source: '成长效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f028.png'
  },

  'F029': {
    id: 'F029',
    name: '龙蛋',
    description: '成长变成龙',
    level: 3,
    baseAttack: 0,
    baseHealth: 3,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        // TODO: 实现变形逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f029.png'
  },

  'F030': {
    id: 'F030',
    name: '渡魂者',
    description: '遗言召唤3/3亡魂',
    level: 3,
    baseAttack: 3,
    baseHealth: 3,
    effects: {
      onAttack: [defaultOnAttack],
      onDeath: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f030.png'
  },

  'F031': {
    id: 'F031',
    name: '恐怖番茄',
    description: '成长召唤1/1番茄',
    level: 3,
    baseAttack: 2,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f031.png'
  },

  'F032': {
    id: 'F032',
    name: '祭司',
    description: '入场获得随机随从',
    level: 3,
    baseAttack: 2,
    baseHealth: 2,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f032.png'
  },

  'F033': {
    id: 'F033',
    name: '泉水之灵',
    description: '光环成长×2',
    level: 3,
    baseAttack: 1,
    baseHealth: 3,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f033.png'
  }
}