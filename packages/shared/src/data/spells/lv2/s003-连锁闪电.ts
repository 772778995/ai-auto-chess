import type { Spell } from '../index'

export default {
  id: 'S003',
  name: '连锁闪电',
  description: '造成2点伤害，弹射到相邻随从',
  level: 2,
  type: 'damage',
  effect: { type: 'damage_splash', value: 2 },
  targetType: 'single_enemy',
  cost: 1,
  imageUrl: '/assets/spells/s003.png'
} satisfies Spell
