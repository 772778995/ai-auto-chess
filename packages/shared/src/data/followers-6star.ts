import type { Follower, FollowerInstance, EffectContext } from '../types/follower'
import { defaultOnAttack } from '../utils/effects'

// 6星随从
export const FOLLOWERS_6STAR: Record<string, Follower> = {
  'F054': {
    id: 'F054',
    name: '混沌领主',
    description: '先手+8/+8',
    level: 6,
    baseAttack: 10,
    baseHealth: 8,
    effects: {
      onAttack: [defaultOnAttack],
      onFirstStrike: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 8, health: 8, permanent: false, source: '先手效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f054.png'
  },

  'F055': {
    id: 'F055',
    name: '死亡之翼',
    description: '',
    level: 6,
    baseAttack: 12,
    baseHealth: 6,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f055.png'
  },

  'F056': {
    id: 'F056',
    name: '世界守护者',
    description: '嘲讽, 护盾×2',
    level: 6,
    baseAttack: 5,
    baseHealth: 15,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 2, permanent: true, source: '入场护盾' })
          self.taunt = true
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f056.png'
  },

  'F057': {
    id: 'F057',
    name: '不朽巨人',
    description: '嘲讽, 受击+1生命',
    level: 6,
    baseAttack: 3,
    baseHealth: 12,
    effects: {
      onAttack: [defaultOnAttack],
      onHit: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ health: 1, permanent: true, source: '受击效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f057.png'
  },

  'F058': {
    id: 'F058',
    name: '永恒之树',
    description: '成长+5/+5',
    level: 6,
    baseAttack: 5,
    baseHealth: 8,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 5, health: 5, permanent: true, source: '成长效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f058.png'
  },

  'F059': {
    id: 'F059',
    name: '时间巨龙',
    description: '成长所有随从+1/+1',
    level: 6,
    baseAttack: 6,
    baseHealth: 6,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const allies = ctx.tools.getAllAllies(newState)
        for (const ally of allies) {
          ally.statusList.push({ attack: 1, health: 1, permanent: true, source: '时间巨龙成长' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f059.png'
  },

  'F060': {
    id: 'F060',
    name: '军团指挥官',
    description: '入场填满战场6/6士兵',
    level: 6,
    baseAttack: 6,
    baseHealth: 7,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f060.png'
  },

  'F061': {
    id: 'F061',
    name: '堕落天使',
    description: '遗言召唤6/6天使和恶魔',
    level: 6,
    baseAttack: 5,
    baseHealth: 6,
    effects: {
      onAttack: [defaultOnAttack],
      onDeath: [(ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f061.png'
  },

  'F062': {
    id: 'F062',
    name: '全知者',
    description: '成长发现1张随从',
    level: 6,
    baseAttack: 4,
    baseHealth: 6,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f062.png'
  },

  'F063': {
    id: 'F063',
    name: '命运编织者',
    description: '拼点+3',
    level: 6,
    baseAttack: 5,
    baseHealth: 5,
    effects: {
      onAttack: [defaultOnAttack],
      onFirstStrike: [(ctx: EffectContext) => {
        // TODO: 拼点效果需要特殊处理
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f063.png'
  }
}