import type { Follower, FollowerInstance, EffectContext } from '../types/follower'
import { defaultOnAttack } from '../utils/effects'

export type { Follower, FollowerInstance } from '../types/follower'

// 随从数据 - 函数驱动格式
export const FOLLOWERS: Record<string, Follower> = {
  // ===== 1星随从 =====

  'F001': {
    id: 'F001',
    name: '小狼',
    description: '',
    level: 1,
    baseAttack: 2,
    baseHealth: 1,
    effects: {
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onKill: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 1, health: 1, permanent: true, source: '击杀效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
        if (target) {
          target.currentHealth -= 2
        }
        return newState
      }
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
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 1, health: 1, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 1, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f012.png'
  },

  // ===== 2星随从 =====

  'F013': {
    id: 'F013',
    name: '剑客',
    description: '',
    level: 2,
    baseAttack: 3,
    baseHealth: 2,
    effects: {
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 疯狂是静态属性，需要在 FollowerInstance 中标记
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onFirstStrike: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, permanent: false, source: '先手效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, health: 1, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f023.png'
  },

  // ===== 3星随从 =====

  'F024': {
    id: 'F024',
    name: '狼王',
    description: '击杀+1/+1',
    level: 3,
    baseAttack: 4,
    baseHealth: 3,
    effects: {
      onAttack: defaultOnAttack,
      onKill: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 1, health: 1, permanent: true, source: '击杀效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 2, health: 2, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        // TODO: 实现变形逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return ctx.tools.cloneDeep(ctx.gameState)
      }
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f033.png'
  },

  // ===== 4星随从 =====

  'F034': {
    id: 'F034',
    name: '战神',
    description: '先手+3/+3',
    level: 4,
    baseAttack: 6,
    baseHealth: 4,
    effects: {
      onAttack: defaultOnAttack,
      onFirstStrike: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 3, health: 3, permanent: false, source: '先手效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onKill: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
        if (target) {
          target.currentHealth -= 2
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
          self.taunt = true
        }
        return newState
      }
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
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 3, health: 3, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 4, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onRoundEnd: (ctx: EffectContext) => {
        // TODO: 实现金币逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f043.png'
  },

  // ===== 5星随从 =====

  'F044': {
    id: 'F044',
    name: '毁灭者',
    description: '先手+5/+5',
    level: 5,
    baseAttack: 8,
    baseHealth: 5,
    effects: {
      onAttack: defaultOnAttack,
      onFirstStrike: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 5, health: 5, permanent: false, source: '先手效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onKill: (ctx: EffectContext) => {
        // TODO: 实现消灭逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
          self.taunt = true
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 光环效果需要特殊处理
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 4, health: 4, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.currentHealth = self.baseHealth + 
            self.statusList.reduce((sum, s) => sum + (s.health ?? 0), 0)
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onFirstStrike: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const allies = ctx.tools.getAllAllies(newState)
        for (const ally of allies) {
          ally.statusList.push({ attack: 2, health: 2, permanent: false, source: '先手效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f053.png'
  },

  // ===== 6星随从 =====

  'F054': {
    id: 'F054',
    name: '混沌领主',
    description: '先手+8/+8',
    level: 6,
    baseAttack: 10,
    baseHealth: 8,
    effects: {
      onAttack: defaultOnAttack,
      onFirstStrike: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 8, health: 8, permanent: false, source: '先手效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 2, permanent: true, source: '入场护盾' })
          self.taunt = true
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onHit: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ health: 1, permanent: true, source: '受击效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ attack: 5, health: 5, permanent: true, source: '成长效果' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const allies = ctx.tools.getAllAllies(newState)
        for (const ally of allies) {
          ally.statusList.push({ attack: 1, health: 1, permanent: true, source: '时间巨龙成长' })
        }
        return newState
      }
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
      onAttack: defaultOnAttack,
      onEnter: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onDeath: (ctx: EffectContext) => {
        // TODO: 实现召唤逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onGrowth: (ctx: EffectContext) => {
        // TODO: 实现发现逻辑
        return ctx.tools.cloneDeep(ctx.gameState)
      }
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
      onAttack: defaultOnAttack,
      onFirstStrike: (ctx: EffectContext) => {
        // TODO: 拼点效果需要特殊处理
        return ctx.tools.cloneDeep(ctx.gameState)
      }
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f063.png'
  }
}

// 快捷获取随从
export function getFollower(id: string): Follower | undefined {
  return FOLLOWERS[id]
}

// 获取所有随从
export function getAllFollowers(): Follower[] {
  return Object.values(FOLLOWERS)
}

// 按星级获取随从
export function getFollowersByLevel(level: 1 | 2 | 3 | 4 | 5 | 6): Follower[] {
  return Object.values(FOLLOWERS).filter(f => f.level === level)
}