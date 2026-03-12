import type { Spell } from '../index'

export default {
  id: 'S015',
  name: '战斗号角',
  description: '所有我方随从+2攻击',
  level: 3,
  type: 'buff',
  effect: { type: 'buff_all', value: 2 },
  targetType: 'all_allies',
  cost: 2,
  imageUrl: '/assets/spells/s015.png'
} satisfies Spell
