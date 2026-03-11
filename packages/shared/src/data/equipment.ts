// 装备数据

export interface Equipment {
  id: string
  name: string
  description: string
  level: 2 | 3 | 4 | 5 | 6
  type: 'attack' | 'defense' | 'special'
  attackBonus?: number
  healthBonus?: number
  shieldBonus?: number
  keywords: EquipmentKeyword[]
  imageUrl: string
}

interface EquipmentKeyword {
  id: string
  name: string
  description: string
  value?: number
}

// 装备数据
export const EQUIPMENTS: Record<string, Equipment> = {
  // ===== 2星装备 =====

  // 攻击型
  'E001': {
    id: 'E001',
    name: '炎龙剑',
    description: '+3攻击',
    level: 2,
    type: 'attack',
    attackBonus: 3,
    keywords: [],
    imageUrl: '/assets/equipment/e001.png'
  },
  'E002': {
    id: 'E002',
    name: '暗杀匕首',
    description: '+2攻击, 疯狂',
    level: 2,
    type: 'attack',
    attackBonus: 2,
    keywords: [{ id: 'windfury', name: '疯狂', description: '攻击次数+1' }],
    imageUrl: '/assets/equipment/e002.png'
  },
  'E003': {
    id: 'E003',
    name: '锋利短剑',
    description: '+2攻击',
    level: 2,
    type: 'attack',
    attackBonus: 2,
    keywords: [],
    imageUrl: '/assets/equipment/e003.png'
  },

  // 防御型
  'E004': {
    id: 'E004',
    name: '铁甲',
    description: '+3生命',
    level: 2,
    type: 'defense',
    healthBonus: 3,
    keywords: [],
    imageUrl: '/assets/equipment/e004.png'
  },
  'E005': {
    id: 'E005',
    name: '木盾',
    description: '+2生命',
    level: 2,
    type: 'defense',
    healthBonus: 2,
    keywords: [],
    imageUrl: '/assets/equipment/e005.png'
  },
  'E006': {
    id: 'E006',
    name: '天使手镜',
    description: '入场护盾',
    level: 2,
    type: 'defense',
    keywords: [{ id: 'shield', name: '护盾', description: '入场获得护盾' }],
    imageUrl: '/assets/equipment/e006.png'
  },

  // 功能型
  'E007': {
    id: 'E007',
    name: '猎手长弓',
    description: '攻击无视嘲讽',
    level: 2,
    type: 'special',
    keywords: [{ id: 'ignore_taunt', name: '无视嘲讽', description: '攻击时忽略嘲讽' }],
    imageUrl: '/assets/equipment/e007.png'
  },
  'E008': {
    id: 'E008',
    name: '吸血镰刀',
    description: '击杀回复2生命',
    level: 2,
    type: 'special',
    keywords: [{ id: 'lifesteal', name: '吸血', description: '击杀回复2生命' }],
    imageUrl: '/assets/equipment/e008.png'
  },

  // ===== 3星装备 =====

  // 攻击型
  'E009': {
    id: 'E009',
    name: '裁决之剑',
    description: '+4攻击',
    level: 3,
    type: 'attack',
    attackBonus: 4,
    keywords: [],
    imageUrl: '/assets/equipment/e009.png'
  },
  'E010': {
    id: 'E010',
    name: '狂战士之斧',
    description: '+3攻击, 疯狂',
    level: 3,
    type: 'attack',
    attackBonus: 3,
    keywords: [{ id: 'windfury', name: '疯狂', description: '攻击次数+1' }],
    imageUrl: '/assets/equipment/e010.png'
  },
  'E011': {
    id: 'E011',
    name: '双刃剑',
    description: '+5攻击, 受击+1伤害',
    level: 3,
    type: 'attack',
    attackBonus: 5,
    keywords: [{ id: 'on_damaged_damage', name: '受击', description: '受到伤害时+1伤害' }],
    imageUrl: '/assets/equipment/e011.png'
  },

  // 防御型
  'E012': {
    id: 'E012',
    name: '钢铁铠甲',
    description: '+5生命',
    level: 3,
    type: 'defense',
    healthBonus: 5,
    keywords: [],
    imageUrl: '/assets/equipment/e012.png'
  },
  'E013': {
    id: 'E013',
    name: '圣盾',
    description: '+2生命, 护盾',
    level: 3,
    type: 'defense',
    healthBonus: 2,
    keywords: [{ id: 'shield', name: '护盾', description: '抵挡一次伤害' }],
    imageUrl: '/assets/equipment/e013.png'
  },
  'E014': {
    id: 'E014',
    name: '反击盾',
    description: '+3生命, 反击',
    level: 3,
    type: 'defense',
    healthBonus: 3,
    keywords: [{ id: 'counter', name: '反击', description: '受到攻击时反击' }],
    imageUrl: '/assets/equipment/e014.png'
  },

  // 功能型
  'E015': {
    id: 'E015',
    name: '焊接器',
    description: '先手效果永久保留',
    level: 3,
    type: 'special',
    keywords: [{ id: 'permanent_first_strike', name: '永久先手', description: '先手效果永久保留' }],
    imageUrl: '/assets/equipment/e015.png'
  },
  'E016': {
    id: 'E016',
    name: '灵魂锁链',
    description: '击杀获得+1/+1',
    level: 3,
    type: 'special',
    keywords: [{ id: 'on_kill_buff', name: '击杀', description: '击杀后+1/+1' }],
    imageUrl: '/assets/equipment/e016.png'
  },

  // ===== 4星装备 =====

  // 攻击型
  'E017': {
    id: 'E017',
    name: '毁灭之刃',
    description: '+6攻击',
    level: 4,
    type: 'attack',
    attackBonus: 6,
    keywords: [],
    imageUrl: '/assets/equipment/e017.png'
  },
  'E018': {
    id: 'E018',
    name: '暗影之刃',
    description: '+4攻击, 增伤×2',
    level: 4,
    type: 'attack',
    attackBonus: 4,
    keywords: [{ id: 'damage_boost', name: '增伤', description: '增加伤害×2', value: 2 }],
    imageUrl: '/assets/equipment/e018.png'
  },
  'E019': {
    id: 'E019',
    name: '猎龙弓',
    description: '+5攻击, 击杀+1/+1',
    level: 4,
    type: 'attack',
    attackBonus: 5,
    keywords: [{ id: 'on_kill_buff', name: '击杀', description: '击杀后+1/+1' }],
    imageUrl: '/assets/equipment/e019.png'
  },

  // 防御型
  'E020': {
    id: 'E020',
    name: '泰坦铠甲',
    description: '+8生命',
    level: 4,
    type: 'defense',
    healthBonus: 8,
    keywords: [],
    imageUrl: '/assets/equipment/e020.png'
  },
  'E021': {
    id: 'E021',
    name: '守护之盾',
    description: '+4生命, 护盾, 嘲讽',
    level: 4,
    type: 'defense',
    healthBonus: 4,
    keywords: [
      { id: 'shield', name: '护盾', description: '抵挡一次伤害' },
      { id: 'taunt', name: '嘲讽', description: '优先被攻击' }
    ],
    imageUrl: '/assets/equipment/e021.png'
  },
  'E022': {
    id: 'E022',
    name: '不朽护甲',
    description: '+5生命, 受击获得护盾',
    level: 4,
    type: 'defense',
    healthBonus: 5,
    keywords: [{ id: 'on_damaged_shield', name: '受击护盾', description: '受到伤害时获得护盾' }],
    imageUrl: '/assets/equipment/e022.png'
  },

  // 功能型
  'E023': {
    id: 'E023',
    name: '命运骰子',
    description: '拼点+1',
    level: 4,
    type: 'special',
    keywords: [{ id: 'dice_roll', name: '拼点', description: '拼点+1', value: 1 }],
    imageUrl: '/assets/equipment/e023.png'
  },
  'E024': {
    id: 'E024',
    name: '时空沙漏',
    description: '成长效果×2',
    level: 4,
    type: 'special',
    keywords: [{ id: 'aura_growth', name: '成长', description: '成长效果×2', value: 2 }],
    imageUrl: '/assets/equipment/e024.png'
  },

  // ===== 5星装备 =====

  // 攻击型
  'E025': {
    id: 'E025',
    name: '终焉之剑',
    description: '+8攻击',
    level: 5,
    type: 'attack',
    attackBonus: 8,
    keywords: [],
    imageUrl: '/assets/equipment/e025.png'
  },
  'E026': {
    id: 'E026',
    name: '死神镰刀',
    description: '+5攻击, 击杀消灭目标',
    level: 5,
    type: 'attack',
    attackBonus: 5,
    keywords: [{ id: 'on_kill_kill', name: '击杀', description: '击杀后消灭目标' }],
    imageUrl: '/assets/equipment/e026.png'
  },
  'E027': {
    id: 'E027',
    name: '混沌之刃',
    description: '+6攻击, 疯狂×2',
    level: 5,
    type: 'attack',
    attackBonus: 6,
    keywords: [{ id: 'windfury', name: '疯狂', description: '攻击次数+1', value: 2 }],
    imageUrl: '/assets/equipment/e027.png'
  },

  // 防御型
  'E028': {
    id: 'E028',
    name: '世界树皮',
    description: '+10生命',
    level: 5,
    type: 'defense',
    healthBonus: 10,
    keywords: [],
    imageUrl: '/assets/equipment/e028.png'
  },
  'E029': {
    id: 'E029',
    name: '天使之翼',
    description: '+5生命, 护盾×2',
    level: 5,
    type: 'defense',
    healthBonus: 5,
    keywords: [{ id: 'shield', name: '护盾', description: '抵挡一次伤害', value: 2 }],
    imageUrl: '/assets/equipment/e029.png'
  },
  'E030': {
    id: 'E030',
    name: '永恒铠甲',
    description: '+6生命, 嘲讽, 护盾',
    level: 5,
    type: 'defense',
    healthBonus: 6,
    keywords: [
      { id: 'taunt', name: '嘲讽', description: '优先被攻击' },
      { id: 'shield', name: '护盾', description: '抵挡一次伤害' }
    ],
    imageUrl: '/assets/equipment/e030.png'
  },

  // 功能型
  'E031': {
    id: 'E031',
    name: '命运硬币',
    description: '拼点+2',
    level: 5,
    type: 'special',
    keywords: [{ id: 'dice_roll', name: '拼点', description: '拼点+2', value: 2 }],
    imageUrl: '/assets/equipment/e031.png'
  },
  'E032': {
    id: 'E032',
    name: '时间宝石',
    description: '先手效果×2',
    level: 5,
    type: 'special',
    keywords: [{ id: 'aura_first_strike', name: '先手', description: '先手效果×2', value: 2 }],
    imageUrl: '/assets/equipment/e032.png'
  },

  // ===== 6星装备 =====

  // 攻击型
  'E033': {
    id: 'E033',
    name: '创世之剑',
    description: '+12攻击',
    level: 6,
    type: 'attack',
    attackBonus: 12,
    keywords: [],
    imageUrl: '/assets/equipment/e033.png'
  },
  'E034': {
    id: 'E034',
    name: '毁灭者之刃',
    description: '+8攻击, 疯狂×2, 增伤×3',
    level: 6,
    type: 'attack',
    attackBonus: 8,
    keywords: [
      { id: 'windfury', name: '疯狂', description: '攻击次数+1', value: 2 },
      { id: 'damage_boost', name: '增伤', description: '增加伤害×3', value: 3 }
    ],
    imageUrl: '/assets/equipment/e034.png'
  },
  'E035': {
    id: 'E035',
    name: '死亡使者',
    description: '+6攻击, 击杀+3/+3',
    level: 6,
    type: 'attack',
    attackBonus: 6,
    keywords: [{ id: 'on_kill_buff', name: '击杀', description: '击杀后+3/+3', value: 3 }],
    imageUrl: '/assets/equipment/e035.png'
  },

  // 防御型
  'E036': {
    id: 'E036',
    name: '守护神铠甲',
    description: '+15生命, 护盾×2',
    level: 6,
    type: 'defense',
    healthBonus: 15,
    keywords: [{ id: 'shield', name: '护盾', description: '抵挡一次伤害', value: 2 }],
    imageUrl: '/assets/equipment/e036.png'
  },
  'E037': {
    id: 'E037',
    name: '不朽之盾',
    description: '+10生命, 嘲讽, 护盾, 受击回复5生命',
    level: 6,
    type: 'defense',
    healthBonus: 10,
    keywords: [
      { id: 'taunt', name: '嘲讽', description: '优先被攻击' },
      { id: 'shield', name: '护盾', description: '抵挡一次伤害' },
      { id: 'lifesteal', name: '受击回复', description: '受到伤害时回复5生命', value: 5 }
    ],
    imageUrl: '/assets/equipment/e037.png'
  },
  'E038': {
    id: 'E038',
    name: '天界庇护',
    description: '+8生命, 护盾×3',
    level: 6,
    type: 'defense',
    healthBonus: 8,
    keywords: [{ id: 'shield', name: '护盾', description: '抵挡一次伤害', value: 3 }],
    imageUrl: '/assets/equipment/e038.png'
  },

  // 功能型
  'E039': {
    id: 'E039',
    name: '命运骰子(金)',
    description: '拼点+3, 拼点胜利+2/+2',
    level: 6,
    type: 'special',
    keywords: [
      { id: 'dice_roll', name: '拼点', description: '拼点+3', value: 3 },
      { id: 'dice_win_buff', name: '拼点胜利', description: '拼点胜利+2/+2', value: 2 }
    ],
    imageUrl: '/assets/equipment/e039.png'
  },
  'E040': {
    id: 'E040',
    name: '时空裂隙',
    description: '成长效果×3, 先手效果×2',
    level: 6,
    type: 'special',
    keywords: [
      { id: 'aura_growth', name: '成长', description: '成长效果×3', value: 3 },
      { id: 'aura_first_strike', name: '先手', description: '先手效果×2', value: 2 }
    ],
    imageUrl: '/assets/equipment/e040.png'
  }
}

// 快捷获取装备
export function getEquipment(id: string): Equipment | undefined {
  return EQUIPMENTS[id]
}

// 获取所有装备
export function getAllEquipment(): Equipment[] {
  return Object.values(EQUIPMENTS)
}

// 按星级获取装备
export function getEquipmentByLevel(level: 2 | 3 | 4 | 5 | 6): Equipment[] {
  return Object.values(EQUIPMENTS).filter(e => e.level === level)
}

// 按类型获取装备
export function getEquipmentByType(type: 'attack' | 'defense' | 'special'): Equipment[] {
  return Object.values(EQUIPMENTS).filter(e => e.type === type)
}
