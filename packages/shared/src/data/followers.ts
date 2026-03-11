import type { Follower } from '../types/follower'

export type { Follower, FollowerInstance } from '../types/follower'

// 随从数据
export const FOLLOWERS: Record<string, Follower> = {
  // ===== 1星随从 =====

  // 攻击型
  'F001': {
    id: 'F001',
    name: '小狼',
    description: '基础攻击型',
    level: 1,
    attack: 2,
    health: 1,
    keywords: [],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f001.png'
  },
  'F002': {
    id: 'F002',
    name: '刺客学徒',
    description: '击杀后获得+1/+1',
    level: 1,
    attack: 1,
    health: 2,
    keywords: [{ id: 'on_kill_buff', name: '击杀', description: '击杀后+1/+1', effect: { type: 'attach', target: 'self', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f002.png'
  },
  'F003': {
    id: 'F003',
    name: '火焰精灵',
    description: '入场造成2点伤害',
    level: 1,
    attack: 2,
    health: 1,
    keywords: [{ id: 'bc_damage', name: '入场伤害', description: '入场造成2点伤害', trigger: 'on_enter', effect: { type: 'damage', target: 'target', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f003.png'
  },

  // 防御型
  'F004': {
    id: 'F004',
    name: '铁皮猪',
    description: '基础防御型',
    level: 1,
    attack: 1,
    health: 3,
    keywords: [],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f004.png'
  },
  'F005': {
    id: 'F005',
    name: '持盾新兵',
    description: '入场获得护盾',
    level: 1,
    attack: 1,
    health: 2,
    keywords: [{ id: 'bc_shield', name: '入场护盾', description: '入场获得护盾', trigger: 'on_enter', effect: { type: 'shield', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f005.png'
  },
  'F006': {
    id: 'F006',
    name: '嘲讽石像',
    description: '嘲讽',
    level: 1,
    attack: 0,
    health: 4,
    keywords: [{ id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f006.png'
  },

  // 成长型
  'F007': {
    id: 'F007',
    name: '种子精灵',
    description: '成长+1/+1',
    level: 1,
    attack: 1,
    health: 1,
    keywords: [{ id: 'growth_both', name: '成长', description: '每回合+1/+1', trigger: 'on_growth', effect: { type: 'attach', target: 'self', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f007.png'
  },
  'F008': {
    id: 'F008',
    name: '幼龙',
    description: '成长+1攻击',
    level: 1,
    attack: 1,
    health: 2,
    keywords: [{ id: 'growth_attack', name: '成长', description: '每回合+1攻击', trigger: 'on_growth', effect: { type: 'buff_attack', target: 'self', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f008.png'
  },

  // 召唤型
  'F009': {
    id: 'F009',
    name: '母蜘蛛',
    description: '遗言召唤1/1蜘蛛',
    level: 1,
    attack: 1,
    health: 2,
    keywords: [{ id: 'deathrattle_summon', name: '遗言', description: '死亡时召唤1/1蜘蛛', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '1/1' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f009.png'
  },
  'F010': {
    id: 'F010',
    name: '分裂史莱姆',
    description: '遗言召唤2个1/1史莱姆',
    level: 1,
    attack: 1,
    health: 1,
    keywords: [{ id: 'deathrattle_summon_multiple', name: '遗言', description: '死亡时召唤2个1/1史莱姆', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '2x1/1' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f010.png'
  },

  // 功能型
  'F011': {
    id: 'F011',
    name: '信鸽',
    description: '入场获得随机随从',
    level: 1,
    attack: 1,
    health: 1,
    keywords: [{ id: 'bc_draw', name: '入场抽牌', description: '入场获得随机随从', trigger: 'on_enter', effect: { type: 'summon', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f011.png'
  },
  'F012': {
    id: 'F012',
    name: '商人学徒',
    description: '卖出获得1金币',
    level: 1,
    attack: 1,
    health: 1,
    keywords: [],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f012.png'
  },

  // ===== 2星随从 =====

  // 攻击型
  'F013': {
    id: 'F013',
    name: '剑客',
    description: '高攻击力',
    level: 2,
    attack: 3,
    health: 2,
    keywords: [],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f013.png'
  },
  'F014': {
    id: 'F014',
    name: '狂战士',
    description: '疯狂',
    level: 2,
    attack: 4,
    health: 1,
    keywords: [{ id: 'windfury', name: '疯狂', description: '攻击次数+1', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f014.png'
  },
  'F015': {
    id: 'F015',
    name: '暗杀者',
    description: '先手+2攻击',
    level: 2,
    attack: 2,
    health: 2,
    keywords: [{ id: 'first_strike', name: '先手', description: '战斗开始前+2攻击', trigger: 'on_first_strike', effect: { type: 'buff_attack', target: 'self', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f015.png'
  },

  // 防御型
  'F016': {
    id: 'F016',
    name: '铁甲卫兵',
    description: '嘲讽',
    level: 2,
    attack: 2,
    health: 4,
    keywords: [{ id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f016.png'
  },
  'F017': {
    id: 'F017',
    name: '圣盾骑士',
    description: '护盾',
    level: 2,
    attack: 2,
    health: 3,
    keywords: [{ id: 'shield', name: '护盾', description: '抵挡一次伤害', effect: { type: 'shield', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f017.png'
  },

  // 成长型
  'F018': {
    id: 'F018',
    name: '森林守卫',
    description: '成长+2/+1',
    level: 2,
    attack: 2,
    health: 2,
    keywords: [{ id: 'growth_both', name: '成长', description: '每回合+2/+1', trigger: 'on_growth', effect: { type: 'attach', target: 'self', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f018.png'
  },
  'F019': {
    id: 'F019',
    name: '火焰幼龙',
    description: '成长+2攻击',
    level: 2,
    attack: 2,
    health: 1,
    keywords: [{ id: 'growth_attack', name: '成长', description: '每回合+2攻击', trigger: 'on_growth', effect: { type: 'buff_attack', target: 'self', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f019.png'
  },

  // 召唤型
  'F020': {
    id: 'F020',
    name: '亡灵召唤师',
    description: '遗言召唤2/2亡灵',
    level: 2,
    attack: 2,
    health: 2,
    keywords: [{ id: 'deathrattle_summon', name: '遗言', description: '死亡时召唤2/2亡灵', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '2/2' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f020.png'
  },
  'F021': {
    id: 'F021',
    name: '麦田傀儡',
    description: '遗言召唤2个1/1稻草人',
    level: 2,
    attack: 2,
    health: 3,
    keywords: [{ id: 'deathrattle_summon_multiple', name: '遗言', description: '死亡时召唤2个1/1稻草人', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '2x1/1' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f021.png'
  },

  // 功能型
  'F022': {
    id: 'F022',
    name: '鉴赏家',
    description: '卖出商店+1星',
    level: 2,
    attack: 1,
    health: 2,
    keywords: [],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f022.png'
  },
  'F023': {
    id: 'F023',
    name: '大厨',
    description: '卖出获得随机咒术',
    level: 2,
    attack: 1,
    health: 2,
    keywords: [],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f023.png'
  },

  // ===== 3星随从 =====

  // 攻击型
  'F024': {
    id: 'F024',
    name: '狼王',
    description: '击杀+1/+1',
    level: 3,
    attack: 4,
    health: 3,
    keywords: [{ id: 'on_kill_buff', name: '击杀', description: '击杀后+1/+1', trigger: 'on_kill', effect: { type: 'attach', target: 'self', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f024.png'
  },
  'F025': {
    id: 'F025',
    name: '双持剑士',
    description: '疯狂',
    level: 3,
    attack: 3,
    health: 3,
    keywords: [{ id: 'windfury', name: '疯狂', description: '攻击次数+1', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f025.png'
  },

  // 防御型
  'F026': {
    id: 'F026',
    name: '钢铁巨人',
    description: '嘲讽',
    level: 3,
    attack: 3,
    health: 6,
    keywords: [{ id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f026.png'
  },
  'F027': {
    id: 'F027',
    name: '守护天使',
    description: '光环同列+1/+1',
    level: 3,
    attack: 2,
    health: 4,
    keywords: [{ id: 'aura_column', name: '光环', description: '同列+1/+1', trigger: 'aura', effect: { type: 'attach', target: 'front_row', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f027.png'
  },

  // 成长型
  'F028': {
    id: 'F028',
    name: '古树',
    description: '成长+2/+2',
    level: 3,
    attack: 2,
    health: 4,
    keywords: [{ id: 'growth_both', name: '成长', description: '每回合+2/+2', trigger: 'on_growth', effect: { type: 'attach', target: 'self', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f028.png'
  },
  'F029': {
    id: 'F029',
    name: '龙蛋',
    description: '成长变成龙',
    level: 3,
    attack: 0,
    health: 3,
    keywords: [{ id: 'growth_transform', name: '成长变形', description: '成长时变成更强大的随从', trigger: 'on_growth', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f029.png'
  },

  // 召唤型
  'F030': {
    id: 'F030',
    name: '渡魂者',
    description: '遗言召唤3/3亡魂',
    level: 3,
    attack: 3,
    health: 3,
    keywords: [{ id: 'deathrattle_summon', name: '遗言', description: '死亡时召唤3/3亡魂', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '3/3' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f030.png'
  },
  'F031': {
    id: 'F031',
    name: '恐怖番茄',
    description: '成长召唤1/1番茄',
    level: 3,
    attack: 2,
    health: 2,
    keywords: [{ id: 'growth_draw', name: '成长发现', description: '成长时召唤1/1番茄', trigger: 'on_growth', effect: { type: 'summon', target: 'self', value: '1/1' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f031.png'
  },

  // 功能型
  'F032': {
    id: 'F032',
    name: '祭司',
    description: '入场获得随机随从',
    level: 3,
    attack: 2,
    health: 2,
    keywords: [{ id: 'bc_draw', name: '入场抽牌', description: '入场获得随机随从', trigger: 'on_enter', effect: { type: 'summon', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f032.png'
  },
  'F033': {
    id: 'F033',
    name: '泉水之灵',
    description: '光环成长×2',
    level: 3,
    attack: 1,
    health: 3,
    keywords: [{ id: 'aura_growth', name: '光环', description: '成长效果×2', trigger: 'aura', effect: { type: 'attach', target: 'self', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f033.png'
  },

  // ===== 4星随从 =====

  // 攻击型
  'F034': {
    id: 'F034',
    name: '战神',
    description: '先手+3/+3',
    level: 4,
    attack: 6,
    health: 4,
    keywords: [{ id: 'first_strike', name: '先手', description: '战斗开始前+3/+3', trigger: 'on_first_strike', effect: { type: 'attach', target: 'self', value: 3 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f034.png'
  },
  'F035': {
    id: 'F035',
    name: '暗影刺客',
    description: '击杀造成2点伤害',
    level: 4,
    attack: 4,
    health: 4,
    keywords: [{ id: 'on_kill_damage', name: '击杀', description: '击杀后造成2点伤害', trigger: 'on_kill', effect: { type: 'damage', target: 'target', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f035.png'
  },

  // 防御型
  'F036': {
    id: 'F036',
    name: '圣盾守护者',
    description: '护盾, 嘲讽',
    level: 4,
    attack: 3,
    health: 5,
    keywords: [
      { id: 'shield', name: '护盾', description: '抵挡一次伤害', effect: { type: 'shield', target: 'self' }, visible: true },
      { id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true }
    ],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f036.png'
  },
  'F037': {
    id: 'F037',
    name: '城堡守卫',
    description: '嘲讽',
    level: 4,
    attack: 2,
    health: 8,
    keywords: [{ id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f037.png'
  },

  // 成长型
  'F038': {
    id: 'F038',
    name: '远古巨树',
    description: '成长+3/+3',
    level: 4,
    attack: 3,
    health: 5,
    keywords: [{ id: 'growth_both', name: '成长', description: '每回合+3/+3', trigger: 'on_growth', effect: { type: 'attach', target: 'self', value: 3 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f038.png'
  },
  'F039': {
    id: 'F039',
    name: '深渊领主',
    description: '成长+4攻击',
    level: 4,
    attack: 4,
    health: 4,
    keywords: [{ id: 'growth_attack', name: '成长', description: '每回合+4攻击', trigger: 'on_growth', effect: { type: 'buff_attack', target: 'self', value: 4 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f039.png'
  },

  // 召唤型
  'F040': {
    id: 'F040',
    name: '骨龙',
    description: '遗言召唤4/4骨龙',
    level: 4,
    attack: 4,
    health: 4,
    keywords: [{ id: 'deathrattle_summon', name: '遗言', description: '死亡时召唤4/4骨龙', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '4/4' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f040.png'
  },
  'F041': {
    id: 'F041',
    name: '召唤大师',
    description: '光环召唤物+1/+1',
    level: 4,
    attack: 3,
    health: 3,
    keywords: [{ id: 'aura_column', name: '光环', description: '召唤物+1/+1', trigger: 'aura', effect: { type: 'attach', target: 'front_row', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f041.png'
  },

  // 功能型
  'F042': {
    id: 'F042',
    name: '栖湖古龙',
    description: '光环先手×2',
    level: 4,
    attack: 3,
    health: 4,
    keywords: [{ id: 'aura_first_strike', name: '光环', description: '先手效果×2', trigger: 'aura', effect: { type: 'attach', target: 'self', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f042.png'
  },
  'F043': {
    id: 'F043',
    name: '时间守护者',
    description: '准备获得2金币',
    level: 4,
    attack: 2,
    health: 4,
    keywords: [{ id: 'prepare_gold', name: '准备', description: '获得2金币', trigger: 'on_round_end', effect: { type: 'heal', target: 'self', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f043.png'
  },

  // ===== 5星随从 =====

  // 攻击型
  'F044': {
    id: 'F044',
    name: '毁灭者',
    description: '先手+5/+5',
    level: 5,
    attack: 8,
    health: 5,
    keywords: [{ id: 'first_strike', name: '先手', description: '战斗开始前+5/+5', trigger: 'on_first_strike', effect: { type: 'attach', target: 'self', value: 5 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f044.png'
  },
  'F045': {
    id: 'F045',
    name: '死神',
    description: '击杀消灭目标',
    level: 5,
    attack: 5,
    health: 5,
    keywords: [{ id: 'on_kill_kill', name: '击杀', description: '击杀后消灭目标', trigger: 'on_kill', effect: { type: 'kill', target: 'target' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f045.png'
  },

  // 防御型
  'F046': {
    id: 'F046',
    name: '泰坦',
    description: '嘲讽, 护盾',
    level: 5,
    attack: 4,
    health: 10,
    keywords: [
      { id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true },
      { id: 'shield', name: '护盾', description: '抵挡一次伤害', effect: { type: 'shield', target: 'self' }, visible: true }
    ],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f046.png'
  },
  'F047': {
    id: 'F047',
    name: '守护神',
    description: '光环全场+2/+2',
    level: 5,
    attack: 3,
    health: 8,
    keywords: [{ id: 'aura_all', name: '光环', description: '全场+2/+2', trigger: 'aura', effect: { type: 'attach', target: 'all_allies', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f047.png'
  },

  // 成长型
  'F048': {
    id: 'F048',
    name: '世界树',
    description: '成长+4/+4',
    level: 5,
    attack: 4,
    health: 6,
    keywords: [{ id: 'growth_both', name: '成长', description: '每回合+4/+4', trigger: 'on_growth', effect: { type: 'attach', target: 'self', value: 4 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f048.png'
  },
  'F049': {
    id: 'F049',
    name: '凤凰',
    description: '成长满血复活',
    level: 5,
    attack: 5,
    health: 5,
    keywords: [{ id: 'growth_transform', name: '成长变形', description: '成长时满血复活', trigger: 'on_growth', effect: { type: 'attach', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f049.png'
  },

  // 召唤型
  'F050': {
    id: 'F050',
    name: '亡灵之王',
    description: '入场召唤所有本局死亡的随从',
    level: 5,
    attack: 5,
    health: 6,
    keywords: [{ id: 'bc_draw', name: '入场抽牌', description: '入场召唤本局死亡随从', trigger: 'on_enter', effect: { type: 'summon', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f050.png'
  },
  'F051': {
    id: 'F051',
    name: '虚空行者',
    description: '遗言召唤5/5虚空兽',
    level: 5,
    attack: 4,
    health: 4,
    keywords: [{ id: 'deathrattle_summon', name: '遗言', description: '死亡时召唤5/5虚空兽', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '5/5' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f051.png'
  },

  // 功能型
  'F052': {
    id: 'F052',
    name: '时钟女士',
    description: '先手全场+2/+2',
    level: 5,
    attack: 4,
    health: 5,
    keywords: [{ id: 'first_strike', name: '先手', description: '战斗开始前全场+2/+2', trigger: 'on_first_strike', effect: { type: 'attach', target: 'all_allies', value: 2 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f052.png'
  },
  'F053': {
    id: 'F053',
    name: '命运女神',
    description: '入场发现3张5星随从',
    level: 5,
    attack: 3,
    health: 5,
    keywords: [{ id: 'bc_draw', name: '入场抽牌', description: '入场发现3张5星随从', trigger: 'on_enter', effect: { type: 'summon', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f053.png'
  },

  // ===== 6星随从 =====

  // 攻击型
  'F054': {
    id: 'F054',
    name: '混沌领主',
    description: '先手+8/+8',
    level: 6,
    attack: 10,
    health: 8,
    keywords: [{ id: 'first_strike', name: '先手', description: '战斗开始前+8/+8', trigger: 'on_first_strike', effect: { type: 'attach', target: 'self', value: 8 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f054.png'
  },
  'F055': {
    id: 'F055',
    name: '死亡之翼',
    description: '最高攻击',
    level: 6,
    attack: 12,
    health: 6,
    keywords: [],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f055.png'
  },

  // 防御型
  'F056': {
    id: 'F056',
    name: '世界守护者',
    description: '嘲讽, 护盾×2',
    level: 6,
    attack: 5,
    health: 15,
    keywords: [
      { id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true },
      { id: 'shield', name: '护盾', description: '抵挡一次伤害', effect: { type: 'shield', target: 'self' }, stacks: true, visible: true }
    ],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f056.png'
  },
  'F057': {
    id: 'F057',
    name: '不朽巨人',
    description: '嘲讽, 受击+1生命',
    level: 6,
    attack: 3,
    health: 12,
    keywords: [
      { id: 'taunt', name: '嘲讽', description: '优先被攻击', effect: { type: 'attach', target: 'self' }, visible: true },
      { id: 'on_damaged_health', name: '受击', description: '受到伤害时+1生命', trigger: 'on_damage', effect: { type: 'heal', target: 'self', value: 1 }, visible: true }
    ],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f057.png'
  },

  // 成长型
  'F058': {
    id: 'F058',
    name: '永恒之树',
    description: '成长+5/+5',
    level: 6,
    attack: 5,
    health: 8,
    keywords: [{ id: 'growth_both', name: '成长', description: '每回合+5/+5', trigger: 'on_growth', effect: { type: 'attach', target: 'self', value: 5 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f058.png'
  },
  'F059': {
    id: 'F059',
    name: '时间巨龙',
    description: '成长所有随从+1/+1',
    level: 6,
    attack: 6,
    health: 6,
    keywords: [{ id: 'growth_both', name: '成长', description: '每回合所有随从+1/+1', trigger: 'on_growth', effect: { type: 'attach', target: 'all_allies', value: 1 }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f059.png'
  },

  // 召唤型
  'F060': {
    id: 'F060',
    name: '军团指挥官',
    description: '入场填满战场6/6士兵',
    level: 6,
    attack: 6,
    health: 7,
    keywords: [{ id: 'bc_draw', name: '入场抽牌', description: '入场填满战场', trigger: 'on_enter', effect: { type: 'summon', target: 'self', value: '6/6' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f060.png'
  },
  'F061': {
    id: 'F061',
    name: '堕落天使',
    description: '遗言召唤6/6天使和恶魔',
    level: 6,
    attack: 5,
    health: 6,
    keywords: [{ id: 'deathrattle_summon_multiple', name: '遗言', description: '死亡时召唤6/6天使和恶魔', trigger: 'on_death', effect: { type: 'summon', target: 'self', value: '6/6+6/6' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f061.png'
  },

  // 功能型
  'F062': {
    id: 'F062',
    name: '全知者',
    description: '成长发现1张随从',
    level: 6,
    attack: 4,
    health: 6,
    keywords: [{ id: 'growth_draw', name: '成长发现', description: '成长时发现1张随从', trigger: 'on_growth', effect: { type: 'summon', target: 'self' }, visible: true }],
    equipmentSlots: 2,
    imageUrl: '/assets/followers/f062.png'
  },
  'F063': {
    id: 'F063',
    name: '命运编织者',
    description: '拼点+3',
    level: 6,
    attack: 5,
    health: 5,
    keywords: [{ id: 'dice_roll', name: '拼点', description: '拼点+3', trigger: 'on_first_strike', effect: { type: 'buff_attack', target: 'self', value: 3 }, visible: true }],
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

// 导出索引
export * from '../types/follower'