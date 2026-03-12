// packages/shared/src/data/equipment.ts
import type { EffectContext, EffectResult, FollowerInstance, TriggerTiming } from '../types/follower'

// ===== 装备类型定义 =====

// 装备属性加成
export interface EquipmentBonuses {
  attack?: number
  health?: number
  shield?: number
  damageBonus?: number
}

// 装备模板
export interface Equipment {
  id: string
  name: string
  description: string
  level: 2 | 3 | 4 | 5 | 6
  bonuses: EquipmentBonuses
  effects: Partial<Record<TriggerTiming, ((ctx: EffectContext) => EffectResult)[]>>
  imageUrl: string
}

// ===== 辅助效果函数 =====

/** 入场护盾效果 */
function createShieldEffect(shieldCount: number, source: string): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.statusList.push({ shield: shieldCount, permanent: true, source })
    }
    return { gameState: newState }
  }
}

/** 疯狂效果（设置 windfury 标记）*/
function createWindfuryEffect(): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.windfury = true
    }
    return { gameState: newState }
  }
}

/** 嘲讽效果 */
function createTauntEffect(): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.taunt = true
    }
    return { gameState: newState }
  }
}

/** 击杀+X/+Y 效果 */
function createOnKillBuffEffect(attack: number, health: number, source: string): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.statusList.push({ attack, health, permanent: true, source })
    }
    return { gameState: newState }
  }
}

// ===== 装备数据 =====

export const EQUIPMENTS: Record<string, Equipment> = {
  // ===== 2星装备 =====

  'E001': {
    id: 'E001',
    name: '炎龙剑',
    description: '+3攻击',
    level: 2,
    bonuses: { attack: 3 },
    effects: {},
    imageUrl: '/assets/equipment/e001.png'
  },

  'E002': {
    id: 'E002',
    name: '暗杀匕首',
    description: '+2攻击, 疯狂',
    level: 2,
    bonuses: { attack: 2 },
    effects: {
      onEnter: [createWindfuryEffect()]
    },
    imageUrl: '/assets/equipment/e002.png'
  },

  'E003': {
    id: 'E003',
    name: '锋利短剑',
    description: '+2攻击',
    level: 2,
    bonuses: { attack: 2 },
    effects: {},
    imageUrl: '/assets/equipment/e003.png'
  },

  'E004': {
    id: 'E004',
    name: '铁甲',
    description: '+3生命',
    level: 2,
    bonuses: { health: 3 },
    effects: {},
    imageUrl: '/assets/equipment/e004.png'
  },

  'E005': {
    id: 'E005',
    name: '木盾',
    description: '+2生命',
    level: 2,
    bonuses: { health: 2 },
    effects: {},
    imageUrl: '/assets/equipment/e005.png'
  },

  'E006': {
    id: 'E006',
    name: '天使手镜',
    description: '入场护盾',
    level: 2,
    bonuses: {},
    effects: {
      onEnter: [createShieldEffect(1, '天使手镜')]
    },
    imageUrl: '/assets/equipment/e006.png'
  },

  'E007': {
    id: 'E007',
    name: '猎手长弓',
    description: '攻击无视嘲讽',
    level: 2,
    bonuses: {},
    effects: {}, // 无视嘲讽需要在战斗系统中处理
    imageUrl: '/assets/equipment/e007.png'
  },

  'E008': {
    id: 'E008',
    name: '吸血镰刀',
    description: '击杀回复2生命',
    level: 2,
    bonuses: {},
    effects: {
      onKill: [(ctx: EffectContext): EffectResult => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.currentHealth = Math.min(
            self.currentHealth + 2,
            self.baseHealth + self.statusList.reduce((sum, s) => sum + (s.health ?? 0), 0)
          )
        }
        return { gameState: newState }
      }]
    },
    imageUrl: '/assets/equipment/e008.png'
  },

  // ===== 3星装备 =====

  'E009': {
    id: 'E009',
    name: '裁决之剑',
    description: '+4攻击',
    level: 3,
    bonuses: { attack: 4 },
    effects: {},
    imageUrl: '/assets/equipment/e009.png'
  },

  'E010': {
    id: 'E010',
    name: '狂战士之斧',
    description: '+3攻击, 疯狂',
    level: 3,
    bonuses: { attack: 3 },
    effects: {
      onEnter: [createWindfuryEffect()]
    },
    imageUrl: '/assets/equipment/e010.png'
  },

  'E011': {
    id: 'E011',
    name: '双刃剑',
    description: '+5攻击, 受击+1伤害',
    level: 3,
    bonuses: { attack: 5 },
    effects: {
      onHit: [(ctx: EffectContext): EffectResult => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
        if (target) {
          target.currentHealth -= 1
        }
        return { gameState: newState }
      }]
    },
    imageUrl: '/assets/equipment/e011.png'
  },

  'E012': {
    id: 'E012',
    name: '钢铁铠甲',
    description: '+5生命',
    level: 3,
    bonuses: { health: 5 },
    effects: {},
    imageUrl: '/assets/equipment/e012.png'
  },

  'E013': {
    id: 'E013',
    name: '圣盾',
    description: '+2生命, 护盾',
    level: 3,
    bonuses: { health: 2 },
    effects: {
      onEnter: [createShieldEffect(1, '圣盾')]
    },
    imageUrl: '/assets/equipment/e013.png'
  },

  'E014': {
    id: 'E014',
    name: '反击盾',
    description: '+3生命, 反击',
    level: 3,
    bonuses: { health: 3 },
    effects: {
      onHit: [(ctx: EffectContext): EffectResult => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        // 反击：对攻击者造成 1 点伤害
        const attacker = ctx.event?.source as FollowerInstance | undefined
        if (attacker) {
          const enemies = (newState as { enemies?: FollowerInstance[] }).enemies
          const target = enemies?.find((f: FollowerInstance) => f.instanceId === attacker.instanceId)
          if (target) {
            target.currentHealth -= 1
          }
        }
        return { gameState: newState }
      }]
    },
    imageUrl: '/assets/equipment/e014.png'
  },

  'E015': {
    id: 'E015',
    name: '焊接器',
    description: '先手效果永久保留',
    level: 3,
    bonuses: {},
    effects: {}, // 需要在战斗系统中特殊处理
    imageUrl: '/assets/equipment/e015.png'
  },

  'E016': {
    id: 'E016',
    name: '灵魂锁链',
    description: '击杀获得+1/+1',
    level: 3,
    bonuses: {},
    effects: {
      onKill: [createOnKillBuffEffect(1, 1, '灵魂锁链')]
    },
    imageUrl: '/assets/equipment/e016.png'
  },

  // ===== 4星装备 =====

  'E017': {
    id: 'E017',
    name: '毁灭之刃',
    description: '+6攻击',
    level: 4,
    bonuses: { attack: 6 },
    effects: {},
    imageUrl: '/assets/equipment/e017.png'
  },

  'E018': {
    id: 'E018',
    name: '暗影之刃',
    description: '+4攻击, 增伤+2',
    level: 4,
    bonuses: { attack: 4, damageBonus: 2 },
    effects: {},
    imageUrl: '/assets/equipment/e018.png'
  },

  'E019': {
    id: 'E019',
    name: '猎龙弓',
    description: '+5攻击, 击杀+1/+1',
    level: 4,
    bonuses: { attack: 5 },
    effects: {
      onKill: [createOnKillBuffEffect(1, 1, '猎龙弓')]
    },
    imageUrl: '/assets/equipment/e019.png'
  },

  'E020': {
    id: 'E020',
    name: '泰坦铠甲',
    description: '+8生命',
    level: 4,
    bonuses: { health: 8 },
    effects: {},
    imageUrl: '/assets/equipment/e020.png'
  },

  'E021': {
    id: 'E021',
    name: '守护之盾',
    description: '+4生命, 护盾, 嘲讽',
    level: 4,
    bonuses: { health: 4 },
    effects: {
      onEnter: [
        createShieldEffect(1, '守护之盾'),
        createTauntEffect()
      ]
    },
    imageUrl: '/assets/equipment/e021.png'
  },

  'E022': {
    id: 'E022',
    name: '不朽护甲',
    description: '+5生命, 受击获得护盾',
    level: 4,
    bonuses: { health: 5 },
    effects: {
      onHit: [(ctx: EffectContext): EffectResult => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          self.statusList.push({ shield: 1, permanent: true, source: '不朽护甲' })
        }
        return { gameState: newState }
      }]
    },
    imageUrl: '/assets/equipment/e022.png'
  },

  'E023': {
    id: 'E023',
    name: '命运骰子',
    description: '拼点+1',
    level: 4,
    bonuses: {},
    effects: {}, // 拼点需要在战斗系统中特殊处理
    imageUrl: '/assets/equipment/e023.png'
  },

  'E024': {
    id: 'E024',
    name: '时空沙漏',
    description: '成长效果×2',
    level: 4,
    bonuses: {},
    effects: {}, // 光环效果需要特殊处理
    imageUrl: '/assets/equipment/e024.png'
  },

  // ===== 5星装备 =====

  'E025': {
    id: 'E025',
    name: '终焉之剑',
    description: '+8攻击',
    level: 5,
    bonuses: { attack: 8 },
    effects: {},
    imageUrl: '/assets/equipment/e025.png'
  },

  'E026': {
    id: 'E026',
    name: '死神镰刀',
    description: '+5攻击, 击杀消灭目标',
    level: 5,
    bonuses: { attack: 5 },
    effects: {
      onKill: [(ctx: EffectContext): EffectResult => {
        // 消灭目标：将目标生命设为 0
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const target = ctx.event?.target as FollowerInstance | undefined
        if (target) {
          const enemies = (newState as { enemies?: FollowerInstance[] }).enemies
          const enemy = enemies?.find((f: FollowerInstance) => f.instanceId === target.instanceId)
          if (enemy) {
            enemy.currentHealth = 0
          }
        }
        return { gameState: newState }
      }]
    },
    imageUrl: '/assets/equipment/e026.png'
  },

  'E027': {
    id: 'E027',
    name: '混沌之刃',
    description: '+6攻击, 疯狂×2',
    level: 5,
    bonuses: { attack: 6 },
    effects: {
      onEnter: [createWindfuryEffect()] // 疯狂×2 逻辑在战斗系统中处理
    },
    imageUrl: '/assets/equipment/e027.png'
  },

  'E028': {
    id: 'E028',
    name: '世界树皮',
    description: '+10生命',
    level: 5,
    bonuses: { health: 10 },
    effects: {},
    imageUrl: '/assets/equipment/e028.png'
  },

  'E029': {
    id: 'E029',
    name: '天使之翼',
    description: '+5生命, 护盾×2',
    level: 5,
    bonuses: { health: 5 },
    effects: {
      onEnter: [createShieldEffect(2, '天使之翼')]
    },
    imageUrl: '/assets/equipment/e029.png'
  },

  'E030': {
    id: 'E030',
    name: '永恒铠甲',
    description: '+6生命, 嘲讽, 护盾',
    level: 5,
    bonuses: { health: 6 },
    effects: {
      onEnter: [
        createTauntEffect(),
        createShieldEffect(1, '永恒铠甲')
      ]
    },
    imageUrl: '/assets/equipment/e030.png'
  },

  'E031': {
    id: 'E031',
    name: '命运硬币',
    description: '拼点+2',
    level: 5,
    bonuses: {},
    effects: {}, // 拼点需要在战斗系统中特殊处理
    imageUrl: '/assets/equipment/e031.png'
  },

  'E032': {
    id: 'E032',
    name: '时间宝石',
    description: '先手效果×2',
    level: 5,
    bonuses: {},
    effects: {}, // 光环效果需要特殊处理
    imageUrl: '/assets/equipment/e032.png'
  },

  // ===== 6星装备 =====

  'E033': {
    id: 'E033',
    name: '创世之剑',
    description: '+12攻击',
    level: 6,
    bonuses: { attack: 12 },
    effects: {},
    imageUrl: '/assets/equipment/e033.png'
  },

  'E034': {
    id: 'E034',
    name: '毁灭者之刃',
    description: '+8攻击, 疯狂×2, 增伤+3',
    level: 6,
    bonuses: { attack: 8, damageBonus: 3 },
    effects: {
      onEnter: [createWindfuryEffect()]
    },
    imageUrl: '/assets/equipment/e034.png'
  },

  'E035': {
    id: 'E035',
    name: '死亡使者',
    description: '+6攻击, 击杀+3/+3',
    level: 6,
    bonuses: { attack: 6 },
    effects: {
      onKill: [createOnKillBuffEffect(3, 3, '死亡使者')]
    },
    imageUrl: '/assets/equipment/e035.png'
  },

  'E036': {
    id: 'E036',
    name: '守护神铠甲',
    description: '+15生命, 护盾×2',
    level: 6,
    bonuses: { health: 15 },
    effects: {
      onEnter: [createShieldEffect(2, '守护神铠甲')]
    },
    imageUrl: '/assets/equipment/e036.png'
  },

  'E037': {
    id: 'E037',
    name: '不朽之盾',
    description: '+10生命, 嘲讽, 护盾, 受击回复5生命',
    level: 6,
    bonuses: { health: 10 },
    effects: {
      onEnter: [
        createTauntEffect(),
        createShieldEffect(1, '不朽之盾')
      ],
      onHit: [(ctx: EffectContext): EffectResult => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)
        const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
          (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
        )
        if (self) {
          const maxHealth = self.baseHealth + self.statusList.reduce((sum, s) => sum + (s.health ?? 0), 0)
          self.currentHealth = Math.min(self.currentHealth + 5, maxHealth)
        }
        return { gameState: newState }
      }]
    },
    imageUrl: '/assets/equipment/e037.png'
  },

  'E038': {
    id: 'E038',
    name: '天界庇护',
    description: '+8生命, 护盾×3',
    level: 6,
    bonuses: { health: 8 },
    effects: {
      onEnter: [createShieldEffect(3, '天界庇护')]
    },
    imageUrl: '/assets/equipment/e038.png'
  },

  'E039': {
    id: 'E039',
    name: '命运骰子(金)',
    description: '拼点+3, 拼点胜利+2/+2',
    level: 6,
    bonuses: {},
    effects: {}, // 拼点需要在战斗系统中特殊处理
    imageUrl: '/assets/equipment/e039.png'
  },

  'E040': {
    id: 'E040',
    name: '时空裂隙',
    description: '成长效果×3, 先手效果×2',
    level: 6,
    bonuses: {},
    effects: {}, // 光环效果需要特殊处理
    imageUrl: '/assets/equipment/e040.png'
  }
}

// ===== 辅助函数 =====

export function getEquipment(id: string): Equipment | undefined {
  return EQUIPMENTS[id]
}

export function getAllEquipment(): Equipment[] {
  return Object.values(EQUIPMENTS)
}

export function getEquipmentByLevel(level: 2 | 3 | 4 | 5 | 6): Equipment[] {
  return Object.values(EQUIPMENTS).filter(e => e.level === level)
}