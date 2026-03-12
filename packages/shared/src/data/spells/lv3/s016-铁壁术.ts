import type { Spell } from '../index'

export default {
  id: 'S016',
  name: '铁壁术',
  description: '所有我方随从+2生命',
  level: 3,
  type: 'buff',
  effect: { type: 'buff_all', value: 2 },
  targetType: 'all_allies',
  cost: 2,
  imageUrl: '/assets/spells/s016.png'
} satisfies Spell
