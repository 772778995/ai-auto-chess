import type { Follower, FollowerInstance, EffectContext } from '../types/follower'
import { defaultOnAttack } from '../utils/effects'

// 4星随从
export const FOLLOWERS_4STAR: Record<string, Follower> = {
  'F034': {
    id: 'F034',
    name: '战神',
    description: '先手+3/+3',
    level: 4,
    baseAttack: 6,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onFirstStrike: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 3, health: 3, permanent: false, source: '先手效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f034.png'
  },

  'F035': {
    id: 'F035',
    name: '暗影刺客',
    description: '击杀造成2点伤害',
    level: 4,
    baseAttack: 4,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onKill: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
        if (target) {
          target.currentHealth -= 2
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f035.png'
  },

  'F036': {
    id: 'F036',
    name: '圣盾守护者',
    description: '护盾, 嘲讽',
    level: 4,
    baseAttack: 3,
    baseHealth: 5,
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
    imageUrl: '/assets/followers/f036.png'
  },

  'F037': {
    id: 'F037',
    name: '城堡守卫',
    description: '嘲讽',
    level: 4,
    baseAttack: 2,
    baseHealth: 8,
    effects: {
      onAttack: [defaultOnAttack]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f037.png'
  },

  'F038': {
    id: 'F038',
    name: '远古巨树',
    description: '成长+3/+3',
    level: 4,
    baseAttack: 3,
    baseHealth: 5,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 3, health: 3, permanent: true, source: '成长效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f038.png'
  },

  'F039': {
    id: 'F039',
    name: '深渊领主',
    description: '成长+4攻击',
    level: 4,
    baseAttack: 4,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onGrowth: [(ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 4, permanent: true, source: '成长效果' })
        }
        return { gameState: newState }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f039.png'
  },

  'F040': {
    id: 'F040',
    name: '骨龙',
    description: '遗言召唤4/4骨龙',
    level: 4,
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
    imageUrl: '/assets/followers/f040.png'
  },

  'F041': {
    id: 'F041',
    name: '召唤大师',
    description: '光环召唤物+1/+1',
    level: 4,
    baseAttack: 3,
    baseHealth: 3,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f041.png'
  },

  'F042': {
    id: 'F042',
    name: '栖湖古龙',
    description: '光环先手×2',
    level: 4,
    baseAttack: 3,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onEnter: [(ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f042.png'
  },

  'F043': {
    id: 'F043',
    name: '时间守护者',
    description: '准备获得2金币',
    level: 4,
    baseAttack: 2,
    baseHealth: 4,
    effects: {
      onAttack: [defaultOnAttack],
      onRoundEnd: [(ctx: EffectContext) => {
        // TODO: 实现金币逻辑
        return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f043.png'
  }
}