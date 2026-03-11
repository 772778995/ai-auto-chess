import type { Keyword } from '../types/keyword'

export const KEYWORDS: Record<string, Keyword> = {
  // ===== 触发时机词条 =====

  // 入场
  'bc_damage': {
    id: 'bc_damage',
    name: '入场伤害',
    description: '入场时对随机目标造成伤害',
    trigger: 'on_enter',
    effect: { type: 'damage', target: 'random_enemy', value: 2 },
    visible: true
  },
  'bc_shield': {
    id: 'bc_shield',
    name: '入场护盾',
    description: '入场时获得护盾',
    trigger: 'on_enter',
    effect: { type: 'shield', target: 'self' },
    visible: true
  },
  'bc_draw': {
    id: 'bc_draw',
    name: '入场发现',
    description: '入场时获得随机随从',
    trigger: 'on_enter',
    effect: { type: 'summon', target: 'self' },
    visible: true
  },

  // 成长
  'growth_both': {
    id: 'growth_both',
    name: '成长',
    description: '每回合获得+X/+X',
    trigger: 'on_growth',
    effect: { type: 'attach', target: 'self', value: 1 },
    visible: true
  },
  'growth_attack': {
    id: 'growth_attack',
    name: '成长',
    description: '每回合获得+X攻击',
    trigger: 'on_growth',
    effect: { type: 'buff_attack', target: 'self', value: 1 },
    visible: true
  },
  'growth_health': {
    id: 'growth_health',
    name: '成长',
    description: '每回合获得+X生命',
    trigger: 'on_growth',
    effect: { type: 'buff_health', target: 'self', value: 1 },
    visible: true
  },
  'growth_transform': {
    id: 'growth_transform',
    name: '成长变形',
    description: '成长时变成更强大的随从',
    trigger: 'on_growth',
    effect: { type: 'attach', target: 'self' },
    visible: true
  },
  'growth_draw': {
    id: 'growth_draw',
    name: '成长发现',
    description: '成长时发现随从',
    trigger: 'on_growth',
    effect: { type: 'summon', target: 'self' },
    visible: true
  },

  // 先手
  'first_strike': {
    id: 'first_strike',
    name: '先手',
    description: '战斗开始前获得增益',
    trigger: 'on_first_strike',
    effect: { type: 'attach', target: 'self', value: 2 },
    visible: true
  },

  // 击杀
  'on_kill_buff': {
    id: 'on_kill_buff',
    name: '击杀',
    description: '击杀后获得增益',
    trigger: 'on_kill',
    effect: { type: 'attach', target: 'self', value: 1 },
    visible: true
  },
  'on_kill_damage': {
    id: 'on_kill_damage',
    name: '击杀',
    description: '击杀后造成额外伤害',
    trigger: 'on_kill',
    effect: { type: 'damage', target: 'target', value: 2 },
    visible: true
  },
  'on_kill_kill': {
    id: 'on_kill_kill',
    name: '击杀',
    description: '击杀后消灭目标',
    trigger: 'on_kill',
    effect: { type: 'kill', target: 'target' },
    visible: true
  },

  // 遗言
  'deathrattle_summon': {
    id: 'deathrattle_summon',
    name: '遗言',
    description: '死亡时召唤衍生物',
    trigger: 'on_death',
    effect: { type: 'summon', target: 'self' },
    visible: true
  },
  'deathrattle_summon_multiple': {
    id: 'deathrattle_summon_multiple',
    name: '遗言',
    description: '死亡时召唤多个衍生物',
    trigger: 'on_death',
    effect: { type: 'summon', target: 'self' },
    visible: true
  },

  // 受击
  'on_damaged_health': {
    id: 'on_damaged_health',
    name: '受击',
    description: '受到伤害时获得生命',
    trigger: 'on_damage',
    effect: { type: 'heal', target: 'self', value: 1 },
    visible: true
  },
  'on_damaged_damage': {
    id: 'on_damaged_damage',
    name: '受击',
    description: '受到伤害时造成伤害',
    trigger: 'on_damage',
    effect: { type: 'damage', target: 'random_enemy', value: 2 },
    visible: true
  },

  // 准备
  'prepare_gold': {
    id: 'prepare_gold',
    name: '准备',
    description: '战斗结束后获得金币',
    trigger: 'on_round_end',
    effect: { type: 'heal', target: 'self', value: 2 },
    visible: true
  },

  // 拼点
  'dice_roll': {
    id: 'dice_roll',
    name: '拼点',
    description: '拼点时获得增益',
    trigger: 'on_first_strike',
    effect: { type: 'buff_attack', target: 'self', value: 3 },
    visible: true
  },

  // ===== 状态效果词条 =====

  // 嘲讽
  'taunt': {
    id: 'taunt',
    name: '嘲讽',
    description: '优先被攻击',
    effect: { type: 'attach', target: 'self' },
    visible: true
  },

  // 护盾
  'shield': {
    id: 'shield',
    name: '护盾',
    description: '抵挡一次伤害',
    effect: { type: 'shield', target: 'self' },
    visible: true
  },

  // 疯狂
  'windfury': {
    id: 'windfury',
    name: '疯狂',
    description: '攻击次数+1',
    effect: { type: 'attach', target: 'self' },
    stacks: true,
    visible: true
  },

  // 反击
  'counter': {
    id: 'counter',
    name: '反击',
    description: '受到攻击时反击',
    effect: { type: 'damage', target: 'attacker' },
    visible: true
  },

  // 增伤
  'damage_boost': {
    id: 'damage_boost',
    name: '增伤',
    description: '增加伤害',
    effect: { type: 'attach', target: 'self' },
    stacks: true,
    visible: true
  },

  // ===== 光环词条 =====

  // 同列光环
  'aura_column': {
    id: 'aura_column',
    name: '光环',
    description: '同列随从获得增益',
    trigger: 'aura',
    effect: { type: 'attach', target: 'front_row', value: 1 },
    visible: true
  },

  // 成长倍增光环
  'aura_growth': {
    id: 'aura_growth',
    name: '光环',
    description: '成长效果倍增',
    trigger: 'aura',
    effect: { type: 'attach', target: 'self', value: 2 },
    visible: true
  },

  // 先手倍增光环
  'aura_first_strike': {
    id: 'aura_first_strike',
    name: '光环',
    description: '先手效果倍增',
    trigger: 'aura',
    effect: { type: 'attach', target: 'self', value: 2 },
    visible: true
  },

  // 全场光环
  'aura_all': {
    id: 'aura_all',
    name: '光环',
    description: '所有随从获得增益',
    trigger: 'aura',
    effect: { type: 'attach', target: 'all_allies', value: 1 },
    visible: true
  }
}

// 快捷获取
export function getKeyword(id: string): Keyword | undefined {
  return KEYWORDS[id]
}

// 获取所有关键词
export function getAllKeywords(): Keyword[] {
  return Object.values(KEYWORDS)
}

// 导出类型
export * from '../types/keyword'