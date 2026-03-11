// 咒术数据

export interface Spell {
  id: string
  name: string
  description: string
  level: 2 | 3 | 4 | 5 | 6
  type: 'damage' | 'buff' | 'discover' | 'special'
  effect: SpellEffect
  targetType: SpellTargetType
  cost: number
  imageUrl: string
}

interface SpellEffect {
  type: SpellEffectType
  value?: number
  condition?: string
}

type SpellEffectType =
  | 'damage'
  | 'damage_splash'
  | 'damage_freeze'
  | 'buff_single'
  | 'buff_all'
  | 'shield_single'
  | 'shield_all'
  | 'kill'
  | 'discover_follower'
  | 'discover_equipment'
  | 'discover_spell'
  | 'gold'
  | 'summon'
  | 'resurrect'
  | 'transform'
  | 'copy'
  | 'reset'
  | 'dice_win'
  | 'discover_any'

type SpellTargetType =
  | 'single_enemy'
  | 'single_ally'
  | 'all_enemies'
  | 'all_allies'
  | 'all'
  | 'empty'
  | 'self'

export type { SpellEffect, SpellEffectType, SpellTargetType }

// 咒术数据
export const SPELLS: Record<string, Spell> = {
  // ===== 2星咒术 =====

  // 伤害型
  'S001': {
    id: 'S001',
    name: '火球术',
    description: '造成5点伤害',
    level: 2,
    type: 'damage',
    effect: { type: 'damage', value: 5 },
    targetType: 'single_enemy',
    cost: 1,
    imageUrl: '/assets/spells/s001.png'
  },
  'S002': {
    id: 'S002',
    name: '冰霜箭',
    description: '造成3点伤害，冻结目标1回合',
    level: 2,
    type: 'damage',
    effect: { type: 'damage_freeze', value: 3 },
    targetType: 'single_enemy',
    cost: 1,
    imageUrl: '/assets/spells/s002.png'
  },
  'S003': {
    id: 'S003',
    name: '连锁闪电',
    description: '造成2点伤害，弹射到相邻随从',
    level: 2,
    type: 'damage',
    effect: { type: 'damage_splash', value: 2 },
    targetType: 'single_enemy',
    cost: 1,
    imageUrl: '/assets/spells/s003.png'
  },

  // 增益型
  'S004': {
    id: 'S004',
    name: '祝福术',
    description: '目标+3/+3',
    level: 2,
    type: 'buff',
    effect: { type: 'buff_single', value: 3 },
    targetType: 'single_ally',
    cost: 1,
    imageUrl: '/assets/spells/s004.png'
  },
  'S005': {
    id: 'S005',
    name: '全体祝福',
    description: '所有我方随从+1/+1',
    level: 2,
    type: 'buff',
    effect: { type: 'buff_all', value: 1 },
    targetType: 'all_allies',
    cost: 1,
    imageUrl: '/assets/spells/s005.png'
  },
  'S006': {
    id: 'S006',
    name: '护盾术',
    description: '给目标护盾',
    level: 2,
    type: 'buff',
    effect: { type: 'shield_single' },
    targetType: 'single_ally',
    cost: 1,
    imageUrl: '/assets/spells/s006.png'
  },

  // 发现型
  'S007': {
    id: 'S007',
    name: '随从发现',
    description: '发现1张2星随从',
    level: 2,
    type: 'discover',
    effect: { type: 'discover_follower', value: 2 },
    targetType: 'self',
    cost: 1,
    imageUrl: '/assets/spells/s007.png'
  },
  'S008': {
    id: 'S008',
    name: '装备发现',
    description: '发现1张2星装备',
    level: 2,
    type: 'discover',
    effect: { type: 'discover_equipment', value: 2 },
    targetType: 'self',
    cost: 1,
    imageUrl: '/assets/spells/s008.png'
  },

  // 功能型
  'S009': {
    id: 'S009',
    name: '金币雨',
    description: '获得3金币',
    level: 2,
    type: 'special',
    effect: { type: 'gold', value: 3 },
    targetType: 'self',
    cost: 1,
    imageUrl: '/assets/spells/s009.png'
  },
  'S010': {
    id: 'S010',
    name: '召唤小兵',
    description: '召唤2个1/1士兵',
    level: 2,
    type: 'special',
    effect: { type: 'summon', value: 2 },
    targetType: 'empty',
    cost: 1,
    imageUrl: '/assets/spells/s010.png'
  },

  // ===== 3星咒术 =====

  // 伤害型
  'S011': {
    id: 'S011',
    name: '大火球',
    description: '造成8点伤害',
    level: 3,
    type: 'damage',
    effect: { type: 'damage', value: 8 },
    targetType: 'single_enemy',
    cost: 2,
    imageUrl: '/assets/spells/s011.png'
  },
  'S012': {
    id: 'S012',
    name: '暗影箭',
    description: '造成6点伤害，如果目标死亡则返回手牌',
    level: 3,
    type: 'damage',
    effect: { type: 'damage', value: 6, condition: 'return_on_death' },
    targetType: 'single_enemy',
    cost: 2,
    imageUrl: '/assets/spells/s012.png'
  },
  'S013': {
    id: 'S013',
    name: '火焰风暴',
    description: '对所有敌方随从造成2点伤害',
    level: 3,
    type: 'damage',
    effect: { type: 'damage_splash', value: 2 },
    targetType: 'all_enemies',
    cost: 2,
    imageUrl: '/assets/spells/s013.png'
  },

  // 增益型
  'S014': {
    id: 'S014',
    name: '强效祝福',
    description: '目标+5/+5',
    level: 3,
    type: 'buff',
    effect: { type: 'buff_single', value: 5 },
    targetType: 'single_ally',
    cost: 2,
    imageUrl: '/assets/spells/s014.png'
  },
  'S015': {
    id: 'S015',
    name: '战斗号角',
    description: '所有我方随从+2攻击',
    level: 3,
    type: 'buff',
    effect: { type: 'buff_all', value: 2 },
    targetType: 'all_allies',
    cost: 2,
    imageUrl: '/assets/spells/s015.png'
  },
  'S016': {
    id: 'S016',
    name: '铁壁术',
    description: '所有我方随从+2生命',
    level: 3,
    type: 'buff',
    effect: { type: 'buff_all', value: 2 },
    targetType: 'all_allies',
    cost: 2,
    imageUrl: '/assets/spells/s016.png'
  },

  // 发现型
  'S017': {
    id: 'S017',
    name: '随从发现II',
    description: '发现1张3星随从',
    level: 3,
    type: 'discover',
    effect: { type: 'discover_follower', value: 3 },
    targetType: 'self',
    cost: 2,
    imageUrl: '/assets/spells/s017.png'
  },
  'S018': {
    id: 'S018',
    name: '装备发现II',
    description: '发现1张3星装备',
    level: 3,
    type: 'discover',
    effect: { type: 'discover_equipment', value: 3 },
    targetType: 'self',
    cost: 2,
    imageUrl: '/assets/spells/s018.png'
  },
  'S019': {
    id: 'S019',
    name: '咒术发现',
    description: '发现1张3星咒术',
    level: 3,
    type: 'discover',
    effect: { type: 'discover_spell', value: 3 },
    targetType: 'self',
    cost: 2,
    imageUrl: '/assets/spells/s019.png'
  },

  // 功能型
  'S020': {
    id: 'S020',
    name: '击杀术',
    description: '消灭目标随从，获得1金币',
    level: 3,
    type: 'special',
    effect: { type: 'kill', value: 1 },
    targetType: 'single_enemy',
    cost: 2,
    imageUrl: '/assets/spells/s020.png'
  },
  'S021': {
    id: 'S021',
    name: '召唤大军',
    description: '在每个空位召唤2/2士兵',
    level: 3,
    type: 'special',
    effect: { type: 'summon', value: 2 },
    targetType: 'empty',
    cost: 2,
    imageUrl: '/assets/spells/s021.png'
  },

  // ===== 4星咒术 =====

  // 伤害型
  'S022': {
    id: 'S022',
    name: '毁灭火球',
    description: '造成12点伤害',
    level: 4,
    type: 'damage',
    effect: { type: 'damage', value: 12 },
    targetType: 'single_enemy',
    cost: 3,
    imageUrl: '/assets/spells/s022.png'
  },
  'S023': {
    id: 'S023',
    name: '死亡之吻',
    description: '消灭目标随从，如果目标星级≥4则获得2金币',
    level: 4,
    type: 'damage',
    effect: { type: 'kill', condition: 'gold_on_high_star' },
    targetType: 'single_enemy',
    cost: 3,
    imageUrl: '/assets/spells/s023.png'
  },
  'S024': {
    id: 'S024',
    name: '混沌风暴',
    description: '对所有随从造成4点伤害',
    level: 4,
    type: 'damage',
    effect: { type: 'damage', value: 4 },
    targetType: 'all',
    cost: 3,
    imageUrl: '/assets/spells/s024.png'
  },

  // 增益型
  'S025': {
    id: 'S025',
    name: '神圣祝福',
    description: '目标+8/+8',
    level: 4,
    type: 'buff',
    effect: { type: 'buff_single', value: 8 },
    targetType: 'single_ally',
    cost: 3,
    imageUrl: '/assets/spells/s025.png'
  },
  'S026': {
    id: 'S026',
    name: '战争动员',
    description: '所有我方随从+3/+3',
    level: 4,
    type: 'buff',
    effect: { type: 'buff_all', value: 3 },
    targetType: 'all_allies',
    cost: 3,
    imageUrl: '/assets/spells/s026.png'
  },
  'S027': {
    id: 'S027',
    name: '护盾祝福',
    description: '所有我方随从获得护盾',
    level: 4,
    type: 'buff',
    effect: { type: 'shield_all' },
    targetType: 'all_allies',
    cost: 3,
    imageUrl: '/assets/spells/s027.png'
  },

  // 发现型
  'S028': {
    id: 'S028',
    name: '随从发现III',
    description: '发现1张4星随从',
    level: 4,
    type: 'discover',
    effect: { type: 'discover_follower', value: 4 },
    targetType: 'self',
    cost: 3,
    imageUrl: '/assets/spells/s028.png'
  },
  'S029': {
    id: 'S029',
    name: '高级发现',
    description: '发现1张5星随从',
    level: 4,
    type: 'discover',
    effect: { type: 'discover_follower', value: 5 },
    targetType: 'self',
    cost: 3,
    imageUrl: '/assets/spells/s029.png'
  },

  // 功能型
  'S030': {
    id: 'S030',
    name: '复制术',
    description: '复制目标随从的所有属性和效果',
    level: 4,
    type: 'special',
    effect: { type: 'copy' },
    targetType: 'single_ally',
    cost: 3,
    imageUrl: '/assets/spells/s030.png'
  },
  'S031': {
    id: 'S031',
    name: '变形术',
    description: '将目标随从变形为随机同星级随从',
    level: 4,
    type: 'special',
    effect: { type: 'transform' },
    targetType: 'single_enemy',
    cost: 3,
    imageUrl: '/assets/spells/s031.png'
  },

  // ===== 5星咒术 =====

  // 伤害型
  'S032': {
    id: 'S032',
    name: '终焉之火',
    description: '造成20点伤害',
    level: 5,
    type: 'damage',
    effect: { type: 'damage', value: 20 },
    targetType: 'single_enemy',
    cost: 4,
    imageUrl: '/assets/spells/s032.png'
  },
  'S033': {
    id: 'S033',
    name: '死亡判决',
    description: '消灭目标随从',
    level: 5,
    type: 'damage',
    effect: { type: 'kill' },
    targetType: 'single_enemy',
    cost: 4,
    imageUrl: '/assets/spells/s033.png'
  },
  'S034': {
    id: 'S034',
    name: '天灾',
    description: '对所有敌方随从造成6点伤害',
    level: 5,
    type: 'damage',
    effect: { type: 'damage', value: 6 },
    targetType: 'all_enemies',
    cost: 4,
    imageUrl: '/assets/spells/s034.png'
  },

  // 增益型
  'S035': {
    id: 'S035',
    name: '神之祝福',
    description: '目标+12/+12',
    level: 5,
    type: 'buff',
    effect: { type: 'buff_single', value: 12 },
    targetType: 'single_ally',
    cost: 4,
    imageUrl: '/assets/spells/s035.png'
  },
  'S036': {
    id: 'S036',
    name: '军团祝福',
    description: '所有我方随从+5/+5',
    level: 5,
    type: 'buff',
    effect: { type: 'buff_all', value: 5 },
    targetType: 'all_allies',
    cost: 4,
    imageUrl: '/assets/spells/s036.png'
  },
  'S037': {
    id: 'S037',
    name: '不朽祝福',
    description: '所有我方随从获得护盾×2',
    level: 5,
    type: 'buff',
    effect: { type: 'shield_all', value: 2 },
    targetType: 'all_allies',
    cost: 4,
    imageUrl: '/assets/spells/s037.png'
  },

  // 发现型
  'S038': {
    id: 'S038',
    name: '随从发现IV',
    description: '发现1张5星随从',
    level: 5,
    type: 'discover',
    effect: { type: 'discover_follower', value: 5 },
    targetType: 'self',
    cost: 4,
    imageUrl: '/assets/spells/s038.png'
  },
  'S039': {
    id: 'S039',
    name: '终极发现',
    description: '发现1张6星随从',
    level: 5,
    type: 'discover',
    effect: { type: 'discover_follower', value: 6 },
    targetType: 'self',
    cost: 4,
    imageUrl: '/assets/spells/s039.png'
  },

  // 功能型
  'S040': {
    id: 'S040',
    name: '复活术',
    description: '复活上回合死亡的最强随从',
    level: 5,
    type: 'special',
    effect: { type: 'resurrect', value: 1 },
    targetType: 'empty',
    cost: 4,
    imageUrl: '/assets/spells/s040.png'
  },
  'S041': {
    id: 'S041',
    name: '时间回溯',
    description: '重置所有随从状态（移除debuff）',
    level: 5,
    type: 'special',
    effect: { type: 'reset' },
    targetType: 'all_allies',
    cost: 4,
    imageUrl: '/assets/spells/s041.png'
  },

  // ===== 6星咒术 =====

  // 伤害型
  'S042': {
    id: 'S042',
    name: '创世之火',
    description: '造成30点伤害',
    level: 6,
    type: 'damage',
    effect: { type: 'damage', value: 30 },
    targetType: 'single_enemy',
    cost: 5,
    imageUrl: '/assets/spells/s042.png'
  },
  'S043': {
    id: 'S043',
    name: '死亡之翼的吐息',
    description: '消灭所有敌方随从',
    level: 6,
    type: 'damage',
    effect: { type: 'kill' },
    targetType: 'all_enemies',
    cost: 5,
    imageUrl: '/assets/spells/s043.png'
  },
  'S044': {
    id: 'S044',
    name: '混沌毁灭',
    description: '对所有随从造成15点伤害',
    level: 6,
    type: 'damage',
    effect: { type: 'damage', value: 15 },
    targetType: 'all',
    cost: 5,
    imageUrl: '/assets/spells/s044.png'
  },

  // 增益型
  'S045': {
    id: 'S045',
    name: '创世祝福',
    description: '目标+20/+20',
    level: 6,
    type: 'buff',
    effect: { type: 'buff_single', value: 20 },
    targetType: 'single_ally',
    cost: 5,
    imageUrl: '/assets/spells/s045.png'
  },
  'S046': {
    id: 'S046',
    name: '神圣军团',
    description: '所有我方随从+8/+8',
    level: 6,
    type: 'buff',
    effect: { type: 'buff_all', value: 8 },
    targetType: 'all_allies',
    cost: 5,
    imageUrl: '/assets/spells/s046.png'
  },
  'S047': {
    id: 'S047',
    name: '永恒庇护',
    description: '所有我方随从获得护盾×3',
    level: 6,
    type: 'buff',
    effect: { type: 'shield_all', value: 3 },
    targetType: 'all_allies',
    cost: 5,
    imageUrl: '/assets/spells/s047.png'
  },

  // 发现型
  'S048': {
    id: 'S048',
    name: '命运发现',
    description: '发现2张6星随从',
    level: 6,
    type: 'discover',
    effect: { type: 'discover_follower', value: 6 },
    targetType: 'self',
    cost: 5,
    imageUrl: '/assets/spells/s048.png'
  },
  'S049': {
    id: 'S049',
    name: '全知发现',
    description: '发现1张任意星级卡牌',
    level: 6,
    type: 'discover',
    effect: { type: 'discover_any' },
    targetType: 'self',
    cost: 5,
    imageUrl: '/assets/spells/s049.png'
  },

  // 功能型
  'S050': {
    id: 'S050',
    name: '群体复活',
    description: '复活所有上回合死亡的随从',
    level: 6,
    type: 'special',
    effect: { type: 'resurrect', value: -1 },
    targetType: 'empty',
    cost: 5,
    imageUrl: '/assets/spells/s050.png'
  },
  'S051': {
    id: 'S051',
    name: '时间停止',
    description: '本回合拼点必定胜利',
    level: 6,
    type: 'special',
    effect: { type: 'dice_win' },
    targetType: 'self',
    cost: 5,
    imageUrl: '/assets/spells/s051.png'
  }
}

// 快捷获取咒术
export function getSpell(id: string): Spell | undefined {
  return SPELLS[id]
}

// 获取所有咒术
export function getAllSpells(): Spell[] {
  return Object.values(SPELLS)
}

// 按星级获取咒术
export function getSpellsByLevel(level: 2 | 3 | 4 | 5 | 6): Spell[] {
  return Object.values(SPELLS).filter(s => s.level === level)
}

// 按类型获取咒术
export function getSpellsByType(type: 'damage' | 'buff' | 'discover' | 'special'): Spell[] {
  return Object.values(SPELLS).filter(s => s.type === type)
}
